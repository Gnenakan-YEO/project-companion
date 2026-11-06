import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { contactSchema, orderSchema } from "./order-schema";
import { priceCart } from "./pricing";

function publicClient() {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

function makeReference() {
  const d = new Date();
  const date = `${String(d.getUTCFullYear()).slice(2)}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;
  const rand = crypto.randomUUID().replace(/-/g, "").slice(0, 5).toUpperCase();
  return `MK-${date}-${rand}`;
}

export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => orderSchema.parse(input))
  .handler(async ({ data }) => {
    let priced;
    try {
      priced = priceCart(data.items);
    } catch {
      return { ok: false as const, error: "Un produit de votre panier n'est plus disponible." };
    }
    const reference = makeReference();
    const { error } = await publicClient()
      .from("orders")
      .insert({
        reference,
        customer_name: data.customerName,
        phone: data.phone,
        email: data.email || null,
        commune: data.commune,
        address: data.address,
        notes: data.notes || null,
        items: priced.lines,
        total_fcfa: priced.totalFcfa,
      });
    if (error) {
      console.error("placeOrder insert failed", error);
      return { ok: false as const, error: "Impossible d'enregistrer la commande. Réessayez." };
    }
    return { ok: true as const, reference, totalFcfa: priced.totalFcfa, lines: priced.lines };
  });

export const sendContactRequest = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => contactSchema.parse(input))
  .handler(async ({ data }) => {
    const { error } = await publicClient()
      .from("contact_requests")
      .insert({
        request_type: data.requestType,
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        company: data.company || null,
        quantity: data.quantity || null,
        message: data.message,
      });
    if (error) {
      console.error("sendContactRequest insert failed", error);
      return { ok: false as const, error: "Impossible d'envoyer votre message. Réessayez." };
    }
    return { ok: true as const };
  });

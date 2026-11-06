import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const ORDER_STATUSES = ["nouvelle", "confirmée", "livrée", "annulée"] as const;

async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (error || !data) throw new Error("Accès réservé au gérant.");
}

export const getAdminStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    return { isAdmin: Boolean(data), email: (context.claims as { email?: string }).email ?? null };
  });

export const listAdminData = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const [orders, requests] = await Promise.all([
      context.supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(200),
      context.supabase.from("contact_requests").select("*").order("created_at", { ascending: false }).limit(200),
    ]);
    if (orders.error || requests.error) throw new Error("Chargement impossible.");
    return { orders: orders.data, requests: requests.data };
  });

export const updateOrderStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ id: z.string().uuid(), status: z.enum(ORDER_STATUSES) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("orders").update({ status: data.status }).eq("id", data.id);
    if (error) throw new Error("Mise à jour impossible.");
    return { ok: true };
  });

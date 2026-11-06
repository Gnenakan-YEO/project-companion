import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Loader2, MessageCircle, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/lib/cart";
import { orderSchema } from "@/lib/order-schema";
import { placeOrder } from "@/lib/orders.functions";
import { findProduct, formatFcfa } from "@/lib/products";
import { COMMUNES, SITE, whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/panier")({
  head: () => ({
    meta: [
      { title: "Mon panier et commande — Maison Karité" },
      { name: "description", content: "Finalisez votre commande de beurre de karité avec livraison à Abidjan." },
      { property: "og:title", content: "Mon panier — Maison Karité" },
      { property: "og:description", content: "Validez votre commande de produits au karité." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PanierPage,
});

type Confirmation = { reference: string; totalFcfa: number; lines: { name: string; size: string; quantity: number }[] };

function PanierPage() {
  const cart = useCart();
  const submit = useServerFn(placeOrder);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [sending, setSending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);
    const fd = new FormData(e.currentTarget);
    const parsed = orderSchema.safeParse({
      customerName: fd.get("customerName"),
      phone: fd.get("phone"),
      email: fd.get("email"),
      commune: fd.get("commune"),
      address: fd.get("address"),
      notes: fd.get("notes"),
      items: cart.items,
    });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) errs[String(issue.path[0])] ??= issue.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    setSending(true);
    try {
      const res = await submit({ data: parsed.data });
      if (res.ok) {
        setConfirmation({ reference: res.reference, totalFcfa: res.totalFcfa, lines: res.lines });
        cart.clear();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setServerError(res.error);
      }
    } catch {
      setServerError("Une erreur est survenue. Vérifiez votre connexion et réessayez.");
    } finally {
      setSending(false);
    }
  }

  if (confirmation) {
    const summary = confirmation.lines.map((l) => `- ${l.quantity} × ${l.name} (${l.size})`).join("\n");
    const message = `Bonjour, je viens de passer la commande ${confirmation.reference} sur votre site :\n${summary}\nTotal : ${formatFcfa(confirmation.totalFcfa)}`;
    return (
      <div className="container-page max-w-2xl py-20 text-center">
        <CheckCircle2 className="mx-auto size-14 text-whatsapp" aria-hidden />
        <h1 className="mt-5 text-4xl font-semibold">Commande enregistrée</h1>
        <p className="mt-3 text-muted-foreground">
          Merci ! Votre référence est <strong className="text-foreground">{confirmation.reference}</strong>.
          Notre équipe vous appellera pour confirmer la livraison.
        </p>
        <div className="mx-auto mt-8 max-w-md rounded-lg border border-border bg-card p-6 text-left shadow-soft">
          <ul className="space-y-2 text-sm">
            {confirmation.lines.map((l) => (
              <li key={`${l.name}-${l.size}`} className="flex justify-between gap-4">
                <span>{l.quantity} × {l.name} <span className="text-muted-foreground">({l.size})</span></span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-border pt-4 font-semibold">
            <span>Total</span>
            <span>{formatFcfa(confirmation.totalFcfa)}</span>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild variant="whatsapp" size="lg">
            <a href={whatsappLink(message)} target="_blank" rel="noreferrer">
              <MessageCircle aria-hidden /> Envoyer aussi sur WhatsApp
            </a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/produits">Continuer mes achats</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="container-page py-24 text-center">
        <ShoppingBag className="mx-auto size-12 text-muted-foreground" aria-hidden />
        <h1 className="mt-5 text-3xl font-semibold">Votre panier est vide</h1>
        <p className="mt-2 text-muted-foreground">Découvrez nos produits au beurre de karité.</p>
        <Button asChild size="lg" className="mt-8">
          <Link to="/produits">Voir les produits</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container-page py-14">
      <p className="eyebrow">Commande</p>
      <h1 className="mt-2 text-4xl font-semibold md:text-5xl">Mon panier</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_26rem]">
        {/* Formulaire de livraison */}
        <form onSubmit={onSubmit} noValidate className="order-2 space-y-5 rounded-lg border border-border bg-card p-6 shadow-soft md:p-8 lg:order-1">
          <h2 className="text-2xl font-semibold">Informations de livraison</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="customerName" label="Nom complet *" error={errors.customerName}>
              <Input id="customerName" name="customerName" autoComplete="name" maxLength={100} />
            </Field>
            <Field id="phone" label="Téléphone / WhatsApp *" error={errors.phone}>
              <Input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="07 00 00 00 00" maxLength={20} />
            </Field>
          </div>
          <Field id="email" label="E-mail (facultatif)" error={errors.email}>
            <Input id="email" name="email" type="email" autoComplete="email" maxLength={255} />
          </Field>
          <Field id="commune" label="Commune *" error={errors.commune}>
            <select
              id="commune"
              name="commune"
              defaultValue=""
              className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="" disabled>Choisissez votre commune</option>
              {COMMUNES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field id="address" label="Adresse / point de repère *" error={errors.address}>
            <Input id="address" name="address" placeholder="Quartier, rue, repère…" maxLength={300} />
          </Field>
          <Field id="notes" label="Remarque (facultatif)" error={errors.notes}>
            <Textarea id="notes" name="notes" rows={3} maxLength={500} placeholder="Horaire de livraison préféré, etc." />
          </Field>

          {errors.items && <p className="text-sm text-destructive">{errors.items}</p>}
          {serverError && (
            <p role="alert" className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">{serverError}</p>
          )}

          <p className="text-sm text-muted-foreground">
            Aucun paiement en ligne : notre équipe vous contacte au {SITE.phoneDisplay} pour confirmer la
            livraison et le mode de paiement.
          </p>
          <Button type="submit" size="lg" disabled={sending} className="w-full sm:w-auto">
            {sending && <Loader2 className="animate-spin" aria-hidden />}
            {sending ? "Envoi en cours…" : "Valider ma commande"}
          </Button>
        </form>

        {/* Récapitulatif */}
        <aside className="order-1 h-fit rounded-lg border border-border bg-card p-6 shadow-soft lg:sticky lg:top-28 lg:order-2">
          <h2 className="text-xl font-semibold">Récapitulatif</h2>
          <ul className="mt-5 divide-y divide-border">
            {cart.items.map((item) => {
              const p = findProduct(item.productId);
              if (!p) return null;
              return (
                <li key={item.productId} className="flex gap-4 py-4">
                  <img src={p.image} alt="" width={64} height={64} className="size-16 rounded-md object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.size} · {formatFcfa(p.priceFcfa)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button type="button" aria-label="Diminuer la quantité" onClick={() => cart.setQuantity(p.id, item.quantity - 1)} className="inline-flex size-7 items-center justify-center rounded border border-border hover:border-primary">
                        <Minus className="size-3.5" />
                      </button>
                      <span className="w-6 text-center text-sm font-semibold" aria-live="polite">{item.quantity}</span>
                      <button type="button" aria-label="Augmenter la quantité" onClick={() => cart.setQuantity(p.id, item.quantity + 1)} className="inline-flex size-7 items-center justify-center rounded border border-border hover:border-primary">
                        <Plus className="size-3.5" />
                      </button>
                      <button type="button" aria-label={`Retirer ${p.name}`} onClick={() => cart.remove(p.id)} className="ml-auto text-muted-foreground hover:text-destructive">
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm font-semibold">{formatFcfa(p.priceFcfa * item.quantity)}</p>
                </li>
              );
            })}
          </ul>
          <div className="mt-2 flex justify-between border-t border-border pt-4 text-lg font-semibold">
            <span>Total</span>
            <span className="text-primary">{formatFcfa(cart.totalFcfa)}</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Frais de livraison confirmés par téléphone.</p>
        </aside>
      </div>
    </div>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

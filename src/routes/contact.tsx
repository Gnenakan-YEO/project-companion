import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Loader2, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { contactSchema, type ContactInput } from "@/lib/order-schema";
import { sendContactRequest } from "@/lib/orders.functions";
import { SITE, whatsappLink } from "@/lib/site";

type Search = { type?: "contact" | "devis" };

export const Route = createFileRoute("/contact")({
  validateSearch: (search: Record<string, unknown>): Search =>
    search["type"] === "devis" ? { type: "devis" } : {},
  head: () => ({
    meta: [
      { title: "Contact & demande de devis — Maison Karité" },
      { name: "description", content: "Contactez Maison Karité à Abidjan par téléphone, WhatsApp ou formulaire. Devis pour achats en gros." },
      { property: "og:title", content: "Contact & devis — Maison Karité" },
      { property: "og:description", content: "Une question ou une commande en gros ? Écrivez-nous." },
    ],
  }),
  component: ContactPage,
});

type Errors = Partial<Record<keyof ContactInput, string>>;

function ContactPage() {
  const search = Route.useSearch();
  const send = useServerFn(sendContactRequest);
  const [requestType, setRequestType] = useState<"contact" | "devis">(search.type ?? "contact");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);
    const fd = new FormData(e.currentTarget);
    const parsed = contactSchema.safeParse({
      requestType,
      name: (fd.get("name") ?? ""),
      phone: (fd.get("phone") ?? ""),
      email: (fd.get("email") ?? ""),
      company: fd.get("company") ?? "",
      quantity: fd.get("quantity") ?? "",
      message: (fd.get("message") ?? ""),
    });
    if (!parsed.success) {
      const errs: Errors = {};
      for (const issue of parsed.error.issues) errs[issue.path[0] as keyof ContactInput] ??= issue.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    setStatus("sending");
    try {
      const res = await send({ data: parsed.data });
      if (res.ok) setStatus("sent");
      else {
        setServerError(res.error);
        setStatus("idle");
      }
    } catch {
      setServerError("Une erreur est survenue. Vérifiez votre connexion et réessayez.");
      setStatus("idle");
    }
  }

  return (
    <div className="container-page py-14">
      <p className="eyebrow">Contact</p>
      <h1 className="mt-2 text-4xl font-semibold md:text-5xl">Parlons de votre besoin</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Une question sur nos produits, une commande en gros ? Remplissez le formulaire ou contactez-nous
        directement.
      </p>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_22rem]">
        <div className="rounded-lg border border-border bg-card p-6 shadow-soft md:p-9">
          {status === "sent" ? (
            <div className="py-10 text-center">
              <CheckCircle2 className="mx-auto size-12 text-whatsapp" aria-hidden />
              <h2 className="mt-4 text-2xl font-semibold">Message bien reçu</h2>
              <p className="mt-2 text-muted-foreground">
                Merci ! Notre équipe vous recontactera au numéro indiqué.
              </p>
              <Button className="mt-6" variant="outline" onClick={() => setStatus("idle")}>
                Envoyer un autre message
              </Button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="space-y-5">
              <div className="inline-flex rounded-md border border-border bg-muted p-1" role="radiogroup" aria-label="Type de demande">
                {(["contact", "devis"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    role="radio"
                    aria-checked={requestType === t}
                    onClick={() => setRequestType(t)}
                    className={
                      requestType === t
                        ? "rounded px-4 py-2 text-sm font-semibold bg-card text-primary shadow-soft"
                        : "rounded px-4 py-2 text-sm font-medium text-muted-foreground"
                    }
                  >
                    {t === "contact" ? "Question" : "Demande de devis"}
                  </button>
                ))}
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="name" label="Nom complet *" error={errors.name}>
                  <Input id="name" name="name" autoComplete="name" maxLength={100} />
                </Field>
                <Field id="phone" label="Téléphone / WhatsApp *" error={errors.phone}>
                  <Input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="07 00 00 00 00" maxLength={20} />
                </Field>
              </div>
              <Field id="email" label="E-mail (facultatif)" error={errors.email}>
                <Input id="email" name="email" type="email" autoComplete="email" maxLength={255} />
              </Field>

              {requestType === "devis" && (
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field id="company" label="Entreprise / boutique" error={errors.company}>
                    <Input id="company" name="company" maxLength={120} />
                  </Field>
                  <Field id="quantity" label="Quantité souhaitée" error={errors.quantity}>
                    <Input id="quantity" name="quantity" placeholder="Ex. : 20 kg par mois" maxLength={120} />
                  </Field>
                </div>
              )}

              <Field id="message" label="Votre message *" error={errors.message}>
                <Textarea id="message" name="message" rows={5} maxLength={1500} />
              </Field>

              {serverError && (
                <p role="alert" className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {serverError}
                </p>
              )}

              <Button type="submit" size="lg" disabled={status === "sending"}>
                {status === "sending" && <Loader2 className="animate-spin" aria-hidden />}
                {status === "sending" ? "Envoi en cours…" : requestType === "devis" ? "Envoyer ma demande de devis" : "Envoyer mon message"}
              </Button>
            </form>
          )}
        </div>

        <aside className="space-y-4">
          <a href={whatsappLink("Bonjour, j'ai une question concernant vos produits.")} target="_blank" rel="noreferrer" className="flex items-center gap-4 rounded-lg bg-whatsapp p-5 text-whatsapp-foreground shadow-soft">
            <MessageCircle className="size-6" aria-hidden />
            <div>
              <p className="font-semibold">WhatsApp</p>
              <p className="text-sm opacity-90">Réponse rapide</p>
            </div>
          </a>
          <a href={SITE.phoneHref} className="flex items-center gap-4 rounded-lg border border-border bg-card p-5 shadow-soft">
            <Phone className="size-6 text-primary" aria-hidden />
            <div>
              <p className="font-semibold">Appeler</p>
              <p className="text-sm text-muted-foreground">{SITE.phoneDisplay}</p>
            </div>
          </a>
          <a href={`mailto:${SITE.email}`} className="flex items-center gap-4 rounded-lg border border-border bg-card p-5 shadow-soft">
            <Mail className="size-6 text-primary" aria-hidden />
            <div>
              <p className="font-semibold">E-mail</p>
              <p className="text-sm text-muted-foreground">{SITE.email}</p>
            </div>
          </a>
          <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-5 shadow-soft">
            <MapPin className="size-6 text-primary" aria-hidden />
            <div>
              <p className="font-semibold">{SITE.city}</p>
              <p className="text-sm text-muted-foreground">{SITE.hours}</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string | undefined; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

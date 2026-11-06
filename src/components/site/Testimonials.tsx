import { MessageCircle, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TESTIMONIALS } from "@/lib/testimonials";
import { whatsappLink } from "@/lib/site";

export function Testimonials() {
  return (
    <section className="container-page py-20">
      <p className="eyebrow">Témoignages</p>
      <h2 className="mt-2 text-3xl font-semibold md:text-4xl">Ils nous font confiance</h2>
      {TESTIMONIALS.length > 0 ? (
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name + t.text} className="rounded-lg border border-border bg-card p-7 shadow-soft">
              <Quote className="size-6 text-gold" aria-hidden />
              <blockquote className="mt-3 text-foreground/85">« {t.text} »</blockquote>
              <figcaption className="mt-4 text-sm font-semibold">{t.name} <span className="font-normal text-muted-foreground">· {t.city}</span></figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-lg border border-dashed border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">Vous avez essayé nos produits ? Votre avis compte pour nous.</p>
          <Button asChild variant="whatsapp" className="mt-4">
            <a href={whatsappLink("Bonjour, voici mon avis sur vos produits : ")} target="_blank" rel="noreferrer">
              <MessageCircle aria-hidden /> Donner mon avis
            </a>
          </Button>
        </div>
      )}
    </section>
  );
}

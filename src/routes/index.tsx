import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Leaf, MessageCircle, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/site/ProductCard";
import { Testimonials } from "@/components/site/Testimonials";
import { PRODUCTS } from "@/lib/products";
import { SITE, whatsappLink } from "@/lib/site";
import hero from "@/assets/hero-karite.jpg";
import cooperative from "@/assets/cooperative.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Maison Karité — Beurre de karité pur, livré à Abidjan" },
      {
        name: "description",
        content: "Beurre de karité 100 % naturel de Côte d'Ivoire. Commandez en ligne ou sur WhatsApp, livraison dans toutes les communes d'Abidjan.",
      },
      { property: "og:title", content: "Maison Karité — Beurre de karité pur, livré à Abidjan" },
      { property: "og:description", content: "Commandez votre beurre de karité naturel en ligne ou sur WhatsApp." },
    ],
  }),
  component: Index,
});

const ENGAGEMENTS = [
  { icon: Leaf, title: "100 % naturel", text: "Beurre de karité brut, huiles végétales et vitamine E, sans eau ajoutée." },
  { icon: ShieldCheck, title: "Qualité contrôlée", text: "Chaque lot est vérifié avant conditionnement." },
  { icon: Truck, title: "Livraison à Abidjan", text: "Livré chez vous, dans toutes les communes." },
  { icon: MessageCircle, title: "Conseil personnalisé", text: "Une question ? Écrivez-nous sur WhatsApp." },
];

function Index() {
  const featured = PRODUCTS;
  return (
    <>
      {/* Bandeau d'accueil */}
      <section className="relative overflow-hidden bg-forest text-forest-foreground">
        <img
          src={hero}
          alt="Beurre de karité brut dans un bol en bois, entouré de noix de karité"
          width={1600}
          height={1008}
          className="absolute inset-0 size-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-forest via-forest/85 to-forest/10" aria-hidden />
        <div className="container-page relative py-24 md:py-36">
          <p className="eyebrow">Côte d'Ivoire · Abidjan</p>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-[1.1] md:text-6xl">
            Le beurre de karité pur, livré chez vous.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-forest-foreground/85">
            Un soin naturel pour la peau et les cheveux, issu du savoir-faire ivoirien. Commandez en
            quelques clics ou directement sur WhatsApp.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild variant="gold" size="lg">
              <Link to="/produits">
                Voir les produits <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="ivoryOutline" size="lg">
              <a href={whatsappLink("Bonjour, je souhaite commander du beurre de karité.")} target="_blank" rel="noreferrer">
                <MessageCircle aria-hidden /> Commander sur WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Engagements */}
      <section className="border-b border-border bg-card">
        <div className="container-page grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {ENGAGEMENTS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-4">
              <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-md bg-accent text-primary">
                <Icon className="size-5" aria-hidden />
              </span>
              <div>
                <h2 className="font-sans text-base font-bold text-foreground">{title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Produits phares */}
      <section className="container-page py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Nos produits</p>
            <h2 className="mt-2 text-3xl font-semibold md:text-4xl">SHINE et SHINE PROTECTION</h2>
          </div>
          <Link to="/produits" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
            Tout le catalogue <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Origine */}
      <section className="bg-secondary">
        <div className="container-page grid items-center gap-12 py-20 md:grid-cols-2">
          <img
            src={cooperative}
            alt="Femmes triant des noix de karité dans un village"
            width={1200}
            height={912}
            loading="lazy"
            className="aspect-[4/3] w-full rounded-lg object-cover shadow-elevated"
          />
          <div>
            <p className="eyebrow">Notre origine</p>
            <h2 className="mt-2 text-3xl font-semibold md:text-4xl">Un savoir-faire transmis de mère en fille</h2>
            <p className="mt-5 text-muted-foreground">
              Notre beurre de karité est produit selon les méthodes traditionnelles du nord de la Côte
              d'Ivoire : collecte des noix, séchage, broyage et barattage à la main.
            </p>
            <Button asChild variant="outline" className="mt-8">
              <Link to="/a-propos">Découvrir notre histoire</Link>
            </Button>
          </div>
        </div>
      </section>

      <Testimonials />

      {/* Professionnels */}
      <section className="container-page py-20">
        <div className="rounded-lg bg-gradient-forest px-8 py-12 text-forest-foreground md:flex md:items-center md:justify-between md:px-14">
          <div className="max-w-xl">
            <p className="eyebrow">Revendeurs, salons, boutiques</p>
            <h2 className="mt-2 text-3xl font-semibold">Besoin de grandes quantités ?</h2>
            <p className="mt-3 text-forest-foreground/80">
              Demandez un devis pour vos achats en gros. Nous vous répondons rapidement.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3 md:mt-0">
            <Button asChild variant="gold" size="lg">
              <Link to="/contact" search={{ type: "devis" }}>Demander un devis</Link>
            </Button>
            <Button asChild variant="ivoryOutline" size="lg">
              <a href={SITE.phoneHref}>Appeler</a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

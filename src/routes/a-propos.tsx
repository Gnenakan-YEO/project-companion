import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import cooperative from "@/assets/cooperative.jpg";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "À propos — Maison Karité, Abidjan" },
      { name: "description", content: "Notre mission : rendre le beurre de karité ivoirien pur accessible à tous, à Abidjan et au-delà." },
      { property: "og:title", content: "À propos — Maison Karité" },
      { property: "og:description", content: "Découvrez l'histoire et les engagements de Maison Karité." },
    ],
  }),
  component: AProposPage,
});

const VALEURS = [
  { title: "Authenticité", text: "Un beurre produit selon les méthodes traditionnelles, sans transformation chimique." },
  { title: "Équité", text: "Nous travaillons avec des productrices locales et valorisons leur travail." },
  { title: "Service", text: "Une équipe disponible pour vous conseiller et livrer rapidement à Abidjan." },
];

function AProposPage() {
  return (
    <>
      <section className="container-page grid items-center gap-12 py-16 md:grid-cols-2">
        <div>
          <p className="eyebrow">À propos</p>
          <h1 className="mt-2 text-4xl font-semibold md:text-5xl">L'or blanc de Côte d'Ivoire</h1>
          <p className="mt-6 text-muted-foreground">
            Maison Karité est née d'une conviction simple : le beurre de karité ivoirien est l'un des
            meilleurs soins naturels au monde, et il mérite d'être proposé avec qualité et sérieux.
          </p>
          <p className="mt-4 text-muted-foreground">
            Basés à Abidjan, nous sélectionnons notre beurre auprès de productrices du nord du pays, le
            conditionnons avec soin et le livrons aux particuliers comme aux professionnels.
          </p>
        </div>
        <img
          src={cooperative}
          alt="Productrices triant des noix de karité"
          width={1200}
          height={912}
          className="aspect-[4/3] w-full rounded-lg object-cover shadow-elevated"
        />
      </section>

      <section className="bg-secondary">
        <div className="container-page py-16">
          <p className="eyebrow">Nos valeurs</p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {VALEURS.map((v, i) => (
              <div key={v.title} className="rounded-lg border border-border bg-card p-7 shadow-soft">
                <span className="font-display text-3xl font-semibold text-gold">0{i + 1}</span>
                <h2 className="mt-3 text-xl font-semibold">{v.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16 text-center">
        <h2 className="text-3xl font-semibold">Prêt à essayer ?</h2>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg"><Link to="/produits">Voir les produits</Link></Button>
          <Button asChild size="lg" variant="outline"><Link to="/contact">Nous contacter</Link></Button>
        </div>
      </section>
    </>
  );
}

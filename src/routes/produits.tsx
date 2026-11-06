import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/site/ProductCard";
import { PRODUCTS } from "@/lib/products";

export const Route = createFileRoute("/produits")({
  head: () => ({
    meta: [
      { title: "Nos produits au karité — Maison Karité" },
      { name: "description", content: "Beurre de karité brut, karité fouetté, baume à lèvres et savon artisanal. Prix en FCFA, livraison à Abidjan." },
      { property: "og:title", content: "Nos produits au karité — Maison Karité" },
      { property: "og:description", content: "Découvrez notre gamme de produits naturels au beurre de karité." },
    ],
  }),
  component: ProduitsPage,
});

const CATEGORIES = ["Tous", "Beurre brut", "Soins", "Hygiène"] as const;

function ProduitsPage() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("Tous");
  const [query, setQuery] = useState("");

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        (category === "Tous" || p.category === category) &&
        (!q || `${p.name} ${p.size} ${p.description}`.toLowerCase().includes(q)),
    );
  }, [category, query]);

  return (
    <div className="container-page py-14">
      <p className="eyebrow">Catalogue</p>
      <h1 className="mt-2 text-4xl font-semibold md:text-5xl">Nos produits</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Ajoutez vos produits au panier, puis validez votre commande. Le paiement se fait à la livraison
        ou selon les modalités convenues avec notre équipe.
      </p>

      <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Catégories">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={category === c}
              onClick={() => setCategory(c)}
              className={
                category === c
                  ? "rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                  : "rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:border-primary"
              }
            >
              {c}
            </button>
          ))}
        </div>
        <div className="relative md:w-72">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un produit…"
            className="h-10 bg-card pl-9"
            aria-label="Rechercher un produit"
          />
        </div>
      </div>

      {list.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">Aucun produit ne correspond à votre recherche.</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

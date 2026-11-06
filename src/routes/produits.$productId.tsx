import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check, MessageCircle, Minus, Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/site/ProductCard";
import { useCart } from "@/lib/cart";
import { findProduct, formatFcfa, PRODUCTS, USAGE_TIPS } from "@/lib/products";
import { whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/produits/$productId")({
  loader: ({ params }) => {
    const product = findProduct(params.productId);
    if (!product) throw notFound();
    return { productId: product.id };
  },
  head: ({ loaderData }) => {
    const p = loaderData ? findProduct(loaderData.productId) : undefined;
    const title = p ? `${p.name} – ${p.size} — Maison Karité` : "Produit introuvable — Maison Karité";
    const description = p ? `${p.description} ${formatFcfa(p.priceFcfa)}, livraison à Abidjan.` : "Ce produit n'existe pas.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        ...(p ? [] : [{ name: "robots", content: "noindex" }]),
      ],
    };
  },
  notFoundComponent: () => (
    <div className="container-page py-24 text-center">
      <h1 className="text-3xl font-semibold">Produit introuvable</h1>
      <Button asChild className="mt-6"><Link to="/produits">Retour au catalogue</Link></Button>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { productId } = Route.useLoaderData();
  const product = findProduct(productId)!;
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const related = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

  function handleAdd() {
    add(product.id, qty);
    setAdded(true);
    toast.success(`${qty} × ${product.name} ajouté au panier`);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="container-page py-12">
      <Link to="/produits" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="size-4" aria-hidden /> Tous les produits
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <img src={product.image} alt={`${product.name} – ${product.size}`} width={912} height={912} className="aspect-square w-full rounded-lg bg-ivory object-cover shadow-elevated" />
        <div>
          <p className="eyebrow">{product.category}</p>
          <h1 className="mt-2 text-4xl font-semibold">{product.name}</h1>
          <p className="mt-1 text-muted-foreground">{product.size}</p>
          <p className="mt-5 font-display text-3xl font-semibold text-primary">{formatFcfa(product.priceFcfa)}</p>
          <p className="mt-5 text-foreground/80">{product.description}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center rounded-md border border-border bg-card">
              <button type="button" aria-label="Diminuer" onClick={() => setQty((q) => Math.max(1, q - 1))} className="inline-flex size-12 items-center justify-center"><Minus className="size-4" /></button>
              <span className="w-8 text-center font-semibold" aria-live="polite">{qty}</span>
              <button type="button" aria-label="Augmenter" onClick={() => setQty((q) => Math.min(100, q + 1))} className="inline-flex size-12 items-center justify-center"><Plus className="size-4" /></button>
            </div>
            <Button size="lg" onClick={handleAdd}>
              {added ? <Check aria-hidden /> : <ShoppingBag aria-hidden />} {added ? "Ajouté" : "Ajouter au panier"}
            </Button>
          </div>
          <Button asChild variant="whatsapp" size="lg" className="mt-3">
            <a href={whatsappLink(`Bonjour, je souhaite commander : ${qty} × ${product.name} (${product.size}).`)} target="_blank" rel="noreferrer">
              <MessageCircle aria-hidden /> Commander sur WhatsApp
            </a>
          </Button>

          <div className="mt-10 rounded-lg border border-border bg-card p-6">
            <h2 className="text-xl font-semibold">Conseils d'utilisation</h2>
            <ul className="mt-4 space-y-2.5 text-sm text-foreground/80">
              {USAGE_TIPS[product.category].map((tip) => (
                <li key={tip} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <section className="mt-20">
        <h2 className="text-2xl font-semibold">Vous aimerez aussi</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>
  );
}

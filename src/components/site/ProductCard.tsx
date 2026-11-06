import { Check, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { useCart } from "@/lib/cart";
import { formatFcfa, type Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    add(product.id, 1);
    setAdded(true);
    toast.success(`${product.name} (${product.size}) ajouté au panier`);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-soft transition-shadow hover:shadow-elevated">
      <Link to="/produits/$productId" params={{ productId: product.id }} className="block aspect-square overflow-hidden bg-ivory">
        <img
          src={product.image}
          alt={`${product.name} – ${product.size}`}
          width={1024}
          height={1024}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {product.size}
        </p>
        <h3 className="mt-1.5 text-lg font-semibold text-foreground">
          <Link to="/produits/$productId" params={{ productId: product.id }} className="hover:text-primary">{product.name}</Link>
        </h3>
        <p className="mt-2 flex-1 text-sm text-muted-foreground">{product.description}</p>
        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="font-display text-xl font-semibold text-primary">{formatFcfa(product.priceFcfa)}</span>
          <Button onClick={handleAdd} size="sm" aria-label={`Ajouter ${product.name} ${product.size} au panier`}>
            {added ? <Check aria-hidden /> : <Plus aria-hidden />}
            {added ? "Ajouté" : "Ajouter"}
          </Button>
        </div>
      </div>
    </article>
  );
}

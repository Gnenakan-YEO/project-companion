import { Link } from "@tanstack/react-router";
import { Menu, Phone, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { SITE } from "@/lib/site";

const NAV = [
  { to: "/", label: "Accueil" },
  { to: "/produits", label: "Produits" },
  { to: "/a-propos", label: "À propos" },
  { to: "/contact", label: "Contact & devis" },
] as const;

export function SiteHeader() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="hidden bg-forest text-forest-foreground md:block">
        <div className="container-page flex h-9 items-center justify-between text-xs">
          <span>Livraison à Abidjan · Commande par WhatsApp ou en ligne</span>
          <a href={SITE.phoneHref} className="inline-flex items-center gap-1.5 hover:text-gold">
            <Phone className="size-3.5" aria-hidden /> {SITE.phoneDisplay}
          </a>
        </div>
      </div>
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-baseline gap-2" onClick={() => setOpen(false)}>
          <span className="font-display text-2xl font-semibold text-primary">{SITE.name}</span>
          <span className="hidden text-xs uppercase tracking-[0.2em] text-muted-foreground sm:inline">
            Abidjan
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Navigation principale">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="text-sm font-medium text-foreground/75 transition-colors hover:text-primary"
              activeProps={{ className: "text-primary underline decoration-gold decoration-2 underline-offset-8" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/panier"
            className="relative inline-flex h-10 items-center gap-2 rounded-md border border-border bg-card px-3 text-sm font-medium text-foreground hover:border-primary"
            aria-label={`Panier, ${count} article${count > 1 ? "s" : ""}`}
            onClick={() => setOpen(false)}
          >
            <ShoppingBag className="size-4" aria-hidden />
            <span className="hidden sm:inline">Panier</span>
            {count > 0 && (
              <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-gold px-1.5 text-xs font-bold text-gold-foreground">
                {count}
              </span>
            )}
          </Link>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-md border border-border md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-background md:hidden" aria-label="Navigation mobile">
          <div className="container-page flex flex-col py-3">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                onClick={() => setOpen(false)}
                className="py-3 text-base font-medium text-foreground/80"
                activeProps={{ className: "text-primary" }}
              >
                {item.label}
              </Link>
            ))}
            <a href={SITE.phoneHref} className="mt-2 inline-flex items-center gap-2 py-3 text-primary">
              <Phone className="size-4" aria-hidden /> Appeler {SITE.phoneDisplay}
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}

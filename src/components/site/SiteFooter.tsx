import { Link } from "@tanstack/react-router";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-gradient-forest text-forest-foreground">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-2xl font-semibold">{SITE.name}</p>
          <p className="mt-3 max-w-sm text-sm text-forest-foreground/75">
            {SITE.tagline}. Produits naturels, sélectionnés avec soin et livrés partout à Abidjan.
          </p>
          <div className="mt-5 flex gap-4 text-sm">
            <a href={SITE.socials.facebook} target="_blank" rel="noreferrer" className="hover:text-gold">
              Facebook
            </a>
            <a href={SITE.socials.instagram} target="_blank" rel="noreferrer" className="hover:text-gold">
              Instagram
            </a>
          </div>
        </div>
        <div>
          <p className="eyebrow">Navigation</p>
          <ul className="mt-4 space-y-2 text-sm text-forest-foreground/80">
            <li><Link to="/produits" className="hover:text-gold">Nos produits</Link></li>
            <li><Link to="/panier" className="hover:text-gold">Mon panier</Link></li>
            <li><Link to="/a-propos" className="hover:text-gold">À propos</Link></li>
            <li><Link to="/contact" className="hover:text-gold">Contact & devis</Link></li>
            <li><Link to="/faq" className="hover:text-gold">FAQ</Link></li>
            <li><Link to="/gerant" className="hover:text-gold">Espace gérant</Link></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow">Nous joindre</p>
          <ul className="mt-4 space-y-3 text-sm text-forest-foreground/80">
            <li className="flex gap-2"><MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />{SITE.city}</li>
            <li className="flex gap-2"><Phone className="mt-0.5 size-4 shrink-0" aria-hidden /><a href={SITE.phoneHref} className="hover:text-gold">{SITE.phoneDisplay}</a></li>
            <li className="flex gap-2"><Mail className="mt-0.5 size-4 shrink-0" aria-hidden /><a href={`mailto:${SITE.email}`} className="hover:text-gold">{SITE.email}</a></li>
            <li className="flex gap-2"><Clock className="mt-0.5 size-4 shrink-0" aria-hidden />{SITE.hours}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-forest-foreground/15">
        <div className="container-page py-5 text-xs text-forest-foreground/60">
          © {new Date().getFullYear()} {SITE.name}. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}

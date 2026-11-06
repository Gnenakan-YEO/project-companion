import { createFileRoute, Link } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Questions fréquentes — Maison Karité" },
      { name: "description", content: "Commande, livraison à Abidjan, utilisation et conservation du beurre de karité : nos réponses." },
      { property: "og:title", content: "Questions fréquentes — Maison Karité" },
      { property: "og:description", content: "Tout savoir sur nos produits au karité et nos commandes." },
    ],
  }),
  component: FaqPage,
});

const FAQ = [
  { q: "Comment passer commande ?", a: "Ajoutez vos produits au panier puis remplissez vos informations de livraison. Vous pouvez aussi commander directement sur WhatsApp." },
  { q: "Comment se passe le paiement ?", a: "Il n'y a pas de paiement en ligne. Après votre commande, notre équipe vous appelle pour confirmer la livraison et le mode de paiement." },
  { q: "Livrez-vous partout à Abidjan ?", a: "Oui, nous livrons dans les communes d'Abidjan. Pour une livraison hors d'Abidjan, choisissez « Autre » dans le formulaire et nous vous contacterons." },
  { q: "Quelle est la différence entre SHINE et SHINE PROTECTION ?", a: "SHINE est une pommade nourrissante qui convient à tous types de peaux, même sensibles. SHINE PROTECTION est enrichie en vaseline pour protéger durablement les peaux très sèches et les zones rugueuses (coudes, talons)." },
  { q: "Le beurre de karité convient-il aux cheveux ?", a: "Oui. Il nourrit les longueurs et les pointes sèches. Appliquez une petite quantité fondue entre les mains." },
  { q: "Pourquoi mon beurre change-t-il de texture ?", a: "C'est normal : le karité naturel ramollit à la chaleur et durcit au frais. Sa qualité n'est pas modifiée." },
  { q: "Comment conserver le beurre de karité ?", a: "Gardez le pot bien fermé, à l'abri de la chaleur et de la lumière directe." },
  { q: "Vendez-vous en gros ?", a: "Oui. Faites une demande de devis en précisant la quantité souhaitée, nous vous répondrons rapidement." },
];

function FaqPage() {
  return (
    <div className="container-page max-w-3xl py-14">
      <p className="eyebrow">FAQ</p>
      <h1 className="mt-2 text-4xl font-semibold md:text-5xl">Questions fréquentes</h1>
      <Accordion type="single" collapsible className="mt-10 rounded-lg border border-border bg-card px-6 shadow-soft">
        {FAQ.map((item, i) => (
          <AccordionItem key={item.q} value={`q${i}`}>
            <AccordionTrigger className="text-left text-base font-semibold">{item.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <div className="mt-12 text-center">
        <p className="text-muted-foreground">Vous ne trouvez pas votre réponse ?</p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Button asChild variant="whatsapp"><a href={whatsappLink("Bonjour, j'ai une question.")} target="_blank" rel="noreferrer">WhatsApp</a></Button>
          <Button asChild variant="outline"><Link to="/contact">Nous écrire</Link></Button>
        </div>
      </div>
    </div>
  );
}

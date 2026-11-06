// Coordonnées de l'entreprise — À REMPLACER par les vraies informations.
export const SITE = {
  name: "Maison Karité",
  tagline: "Beurre de karité pur de Côte d'Ivoire",
  city: "Abidjan, Côte d'Ivoire",
  // Numéro au format international, sans espaces ni « + » (utilisé pour WhatsApp)
  whatsappNumber: "2250700000000",
  // Numéro affiché et utilisé pour les appels
  phoneDisplay: "+225 07 00 00 00 00",
  phoneHref: "tel:+2250700000000",
  email: "contact@maisonkarite.ci",
  hours: "Lundi – Samedi, 8h – 18h",
  socials: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
  },
} as const;

export function whatsappLink(message: string) {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const COMMUNES = [
  "Abobo",
  "Adjamé",
  "Attécoubé",
  "Cocody",
  "Koumassi",
  "Marcory",
  "Plateau",
  "Port-Bouët",
  "Treichville",
  "Yopougon",
  "Bingerville",
  "Songon",
  "Anyama",
  "Autre (hors Abidjan)",
] as const;

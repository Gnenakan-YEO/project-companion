import shine from "@/assets/produit-shine.jpg";
import shineProtection from "@/assets/produit-shine-protection.jpg";

export type ProductLine = "SHINE" | "SHINE PROTECTION";

export type Product = {
  id: string;
  name: string;
  size: string;
  priceFcfa: number;
  category: ProductLine;
  description: string;
  image: string;
  weight: string;
  dimensions: string;
};

type LineInfo = {
  subtitle: string;
  tagline: string;
  longDescription: string;
  benefits: string[];
  colors: { label: string; value: string }[];
};

export const LINES: Record<ProductLine, LineInfo> = {
  SHINE: {
    subtitle: "Pommade nourrissante au beurre de karité",
    tagline: "La nature au service de votre peau",
    longDescription:
      "Formulée à base de beurre de karité brut, d'huiles végétales nobles et de vitamine E, cette pommade 100 % naturelle nourrit en profondeur, apaise et protège tous types de peaux — même les plus sensibles.",
    benefits: [
      "Nourrit intensément les peaux sèches",
      "Apaise et régénère la barrière cutanée",
      "Favorise la cicatrisation",
      "Sans eau ajoutée — 100 % actifs naturels",
      "Convient à tous types de peaux",
    ],
    colors: [
      { label: "Couvercle", value: "Doré" },
      { label: "Contenu", value: "Jaune poussin" },
      { label: "Étiquette", value: "Jaune" },
    ],
  },
  "SHINE PROTECTION": {
    subtitle: "Pommade protectrice au beurre de karité",
    tagline: "Protection intense, éclat naturel",
    longDescription:
      "Enrichie en vaseline pour une protection renforcée, SHINE PROTECTION nourrit et protège durablement les peaux très sèches et les zones rugueuses. Une formule naturelle à base de beurre de karité, huiles végétales et vitamine E.",
    benefits: [
      "Protection longue durée de la barrière cutanée",
      "Nourrit intensément les peaux très sèches",
      "Idéal coudes, talons, zones rugueuses",
      "100 % actifs naturels, sans eau ajoutée",
    ],
    colors: [
      { label: "Couvercle", value: "Doré" },
      { label: "Contenu", value: "Jaune or" },
      { label: "Étiquette", value: "Bleu et or" },
    ],
  },
};

// Dimensions transmises en « mm » par le client ; affichées en cm (à confirmer).
const DIM_100 = "4,2 cm de long × 6,9 cm de large";
const DIM_50 = "3 cm de long × 6,9 cm de large";

export const PRODUCTS: Product[] = [
  {
    id: "shine-100",
    name: "SHINE",
    size: "Pot 100 g",
    priceFcfa: 5000,
    category: "SHINE",
    description: "Pommade nourrissante au beurre de karité, 100 % naturelle, pour tous types de peaux.",
    image: shine,
    weight: "100 g",
    dimensions: DIM_100,
  },
  {
    id: "shine-50",
    name: "SHINE",
    size: "Pot 50 g",
    priceFcfa: 2500,
    category: "SHINE",
    description: "Le format pratique de notre pommade nourrissante, à glisser dans le sac.",
    image: shine,
    weight: "50 g",
    dimensions: DIM_50,
  },
  {
    id: "shine-protection-100",
    name: "SHINE PROTECTION",
    size: "Pot 100 g",
    priceFcfa: 6000,
    category: "SHINE PROTECTION",
    description: "Protection intense enrichie en vaseline, pour les peaux très sèches et les zones rugueuses.",
    image: shineProtection,
    weight: "100 g",
    dimensions: DIM_100,
  },
  {
    id: "shine-protection-50",
    name: "SHINE PROTECTION",
    size: "Pot 50 g",
    priceFcfa: 3000,
    category: "SHINE PROTECTION",
    description: "Le format pratique pour protéger coudes, talons et mains au quotidien.",
    image: shineProtection,
    weight: "50 g",
    dimensions: DIM_50,
  },
];

export function findProduct(id: string) {
  return PRODUCTS.find((p) => p.id === id);
}

export function formatFcfa(amount: number) {
  return `${new Intl.NumberFormat("fr-FR").format(amount).replace(/\u202f|\u00a0/g, " ")} FCFA`;
}

// Conseils d'utilisation par gamme (affichés sur la fiche produit).
export const USAGE_TIPS: Record<ProductLine, string[]> = {
  SHINE: [
    "Prélevez une petite noisette et réchauffez-la entre vos doigts.",
    "Appliquez sur une peau propre, de préférence après la douche, en massant doucement.",
    "Convient au visage comme au corps, même aux peaux sensibles.",
    "Refermez bien le pot et conservez-le à l'abri de la chaleur et du soleil.",
  ],
  "SHINE PROTECTION": [
    "Appliquez une couche généreuse sur les zones très sèches : coudes, genoux, talons, mains.",
    "Idéal le soir pour une protection pendant toute la nuit.",
    "Renouvelez l'application aussi souvent que nécessaire.",
    "Refermez bien le pot et conservez-le à l'abri de la chaleur et du soleil.",
  ],
};

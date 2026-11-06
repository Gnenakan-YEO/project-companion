import brut from "@/assets/produit-brut.jpg";
import parfume from "@/assets/produit-parfume.jpg";
import baume from "@/assets/produit-baume.jpg";
import savon from "@/assets/produit-savon.jpg";

export type Product = {
  id: string;
  name: string;
  size: string;
  priceFcfa: number;
  category: "Beurre brut" | "Soins" | "Hygiène";
  description: string;
  image: string;
};

// Prix d'exemple — À REMPLACER par vos vrais prix.
export const PRODUCTS: Product[] = [
  {
    id: "brut-250",
    name: "Beurre de karité brut",
    size: "Pot 250 g",
    priceFcfa: 2500,
    category: "Beurre brut",
    description: "100 % naturel, non raffiné. Nourrit la peau et les cheveux secs.",
    image: brut,
  },
  {
    id: "brut-500",
    name: "Beurre de karité brut",
    size: "Pot 500 g",
    priceFcfa: 4500,
    category: "Beurre brut",
    description: "Le format familial pour le corps, les cheveux et les soins de bébé.",
    image: brut,
  },
  {
    id: "brut-1kg",
    name: "Beurre de karité brut",
    size: "Seau 1 kg",
    priceFcfa: 8000,
    category: "Beurre brut",
    description: "Idéal pour les salons, revendeurs et préparations maison.",
    image: brut,
  },
  {
    id: "fouette-coco",
    name: "Karité fouetté à la noix de coco",
    size: "Pot 200 g",
    priceFcfa: 3500,
    category: "Soins",
    description: "Texture légère et parfum doux de coco pour un soin quotidien.",
    image: parfume,
  },
  {
    id: "baume-levres",
    name: "Baume à lèvres au karité",
    size: "Boîte 15 g",
    priceFcfa: 1500,
    category: "Soins",
    description: "Protège et répare les lèvres sèches ou gercées.",
    image: baume,
  },
  {
    id: "savon-karite",
    name: "Savon artisanal au karité",
    size: "Pain 100 g",
    priceFcfa: 1500,
    category: "Hygiène",
    description: "Savon doux fabriqué à la main, adapté aux peaux sensibles.",
    image: savon,
  },
];

export function findProduct(id: string) {
  return PRODUCTS.find((p) => p.id === id);
}

export function formatFcfa(amount: number) {
  return `${new Intl.NumberFormat("fr-FR").format(amount).replace(/\u202f|\u00a0/g, " ")} FCFA`;
}

// Conseils d'utilisation par catégorie (affichés sur la fiche produit).
export const USAGE_TIPS: Record<Product["category"], string[]> = {
  "Beurre brut": [
    "Prélevez une petite noisette et réchauffez-la entre vos mains jusqu'à ce qu'elle fonde.",
    "Peau : appliquez sur une peau propre, de préférence après la douche.",
    "Cheveux : massez les longueurs et les pointes, en bain d'huile ou en soin sans rinçage.",
    "Conservez le pot fermé, à l'abri de la chaleur et du soleil.",
  ],
  Soins: [
    "Appliquez en fine couche, aussi souvent que nécessaire.",
    "Idéal le soir pour un soin nourrissant pendant la nuit.",
    "Conservez à l'abri de la chaleur pour garder la texture.",
  ],
  Hygiène: [
    "Faites mousser sur une peau mouillée, puis rincez abondamment.",
    "Laissez sécher le savon sur un porte-savon entre deux utilisations.",
  ],
};

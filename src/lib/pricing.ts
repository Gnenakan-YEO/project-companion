import { findProduct } from "./products";

export type PricedLine = {
  productId: string;
  name: string;
  size: string;
  unitPriceFcfa: number;
  quantity: number;
  lineTotalFcfa: number;
};

/** Calcule le total à partir du catalogue (jamais à partir des prix envoyés par le navigateur). */
export function priceCart(items: { productId: string; quantity: number }[]) {
  const merged = new Map<string, number>();
  for (const item of items) {
    merged.set(item.productId, (merged.get(item.productId) ?? 0) + item.quantity);
  }
  const lines: PricedLine[] = [];
  for (const [productId, quantity] of merged) {
    const product = findProduct(productId);
    if (!product) throw new Error(`Produit inconnu : ${productId}`);
    lines.push({
      productId,
      name: product.name,
      size: product.size,
      unitPriceFcfa: product.priceFcfa,
      quantity,
      lineTotalFcfa: product.priceFcfa * quantity,
    });
  }
  const totalFcfa = lines.reduce((sum, l) => sum + l.lineTotalFcfa, 0);
  return { lines, totalFcfa };
}

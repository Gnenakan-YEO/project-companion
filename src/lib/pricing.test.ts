import { describe, expect, it } from "vitest";
import { priceCart } from "./pricing";
import { findProduct } from "./products";

describe("catalogue prices", () => {
  it("SHINE 100 g costs 5 000 FCFA and 50 g costs 2 500 FCFA", () => {
    expect(findProduct("shine-100")?.priceFcfa).toBe(5000);
    expect(findProduct("shine-50")?.priceFcfa).toBe(2500);
  });

  it("SHINE PROTECTION 100 g costs 6 000 FCFA and 50 g costs 3 000 FCFA", () => {
    expect(findProduct("shine-protection-100")?.priceFcfa).toBe(6000);
    expect(findProduct("shine-protection-50")?.priceFcfa).toBe(3000);
  });
});

describe("priceCart", () => {
  it("computes the total from catalogue prices", () => {
    const { totalFcfa } = priceCart([
      { productId: "shine-100", quantity: 2 },
      { productId: "shine-protection-50", quantity: 1 },
    ]);
    expect(totalFcfa).toBe(2 * 5000 + 3000);
  });

  it("merges duplicate lines of the same product", () => {
    const { lines } = priceCart([
      { productId: "shine-protection-100", quantity: 1 },
      { productId: "shine-protection-100", quantity: 2 },
    ]);
    expect(lines).toHaveLength(1);
    expect(lines[0]!.quantity).toBe(3);
    expect(lines[0]!.lineTotalFcfa).toBe(18000);
  });

  it("rejects unknown products", () => {
    expect(() => priceCart([{ productId: "brut-250", quantity: 1 }])).toThrow();
  });
});

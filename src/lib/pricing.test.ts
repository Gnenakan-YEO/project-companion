import { describe, expect, it } from "vitest";
import { priceCart } from "./pricing";

describe("priceCart", () => {
  it("computes the total from catalogue prices", () => {
    const { totalFcfa } = priceCart([
      { productId: "brut-250", quantity: 2 },
      { productId: "baume-levres", quantity: 1 },
    ]);
    expect(totalFcfa).toBe(2 * 2500 + 1500);
  });

  it("merges duplicate lines of the same product", () => {
    const { lines } = priceCart([
      { productId: "brut-1kg", quantity: 1 },
      { productId: "brut-1kg", quantity: 2 },
    ]);
    expect(lines).toHaveLength(1);
    expect(lines[0]!.quantity).toBe(3);
    expect(lines[0]!.lineTotalFcfa).toBe(24000);
  });

  it("rejects unknown products", () => {
    expect(() => priceCart([{ productId: "faux", quantity: 1 }])).toThrow();
  });
});

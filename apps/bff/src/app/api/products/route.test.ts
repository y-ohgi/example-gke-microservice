import { describe, test, expect, vi, afterEach } from "vitest";
import { GET } from "./route";

describe("GET /api/products", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test("forwards the catalog-service response", async () => {
    const products = [
      { id: 1, name: "コーヒー豆 200g", price: 1200, stock: 50 },
    ];
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify(products), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );

    const res = await GET();

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(products);
  });
});

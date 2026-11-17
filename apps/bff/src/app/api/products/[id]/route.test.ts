import { describe, test, expect, vi, afterEach } from "vitest";
import { GET } from "./route";

describe("GET /api/products/[id]", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test("returns the product when catalog-service finds it", async () => {
    const product = { id: 1, name: "コーヒー豆 200g", price: 1200, stock: 50 };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(JSON.stringify(product), { status: 200 })),
    );

    const res = await GET(new Request("http://localhost/api/products/1"), {
      params: Promise.resolve({ id: "1" }),
    });

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(product);
  });

  test("returns 404 when catalog-service has no such product", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 404 })));

    const res = await GET(new Request("http://localhost/api/products/999"), {
      params: Promise.resolve({ id: "999" }),
    });

    expect(res.status).toBe(404);
  });

  test("URLエンコードが必要なidはエンコードしてcatalog-serviceへ渡す", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 404 }));
    vi.stubGlobal("fetch", fetchMock);

    await GET(new Request("http://localhost/api/products/foo%20bar"), {
      params: Promise.resolve({ id: "foo bar" }),
    });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/products/foo%20bar"),
      expect.anything(),
    );
  });

  test("catalog-serviceに到達できない場合は502を返す", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network error")));

    const res = await GET(new Request("http://localhost/api/products/1"), {
      params: Promise.resolve({ id: "1" }),
    });

    expect(res.status).toBe(502);
  });
});

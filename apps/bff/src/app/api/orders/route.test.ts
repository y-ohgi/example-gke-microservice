import { describe, test, expect, vi, afterEach } from "vitest";
import { GET, POST } from "./route";

describe("/api/orders", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test("GET forwards the order-service list", async () => {
    const orders = [
      {
        id: 1,
        productId: 1,
        productName: "コーヒー豆 200g",
        quantity: 2,
        unitPrice: 1200,
        totalPrice: 2400,
        createdAt: "2026-01-01T00:00:00Z",
      },
    ];
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(JSON.stringify(orders), { status: 200 })),
    );

    const res = await GET();

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(orders);
  });

  test("POST forwards the request body and returns the created order", async () => {
    const created = {
      id: 1,
      productId: 1,
      productName: "コーヒー豆 200g",
      quantity: 2,
      unitPrice: 1200,
      totalPrice: 2400,
      createdAt: "2026-01-01T00:00:00Z",
    };
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify(created), { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);

    const request = new Request("http://localhost/api/orders", {
      method: "POST",
      body: JSON.stringify({ productId: 1, quantity: 2 }),
    });
    const res = await POST(request);

    expect(res.status).toBe(201);
    expect(await res.json()).toEqual(created);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/orders"),
      expect.objectContaining({ method: "POST" }),
    );
  });

  test("POST returns the order-service error status with no body", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 404 })));

    const request = new Request("http://localhost/api/orders", {
      method: "POST",
      body: JSON.stringify({ productId: 999, quantity: 1 }),
    });
    const res = await POST(request);

    expect(res.status).toBe(404);
  });
});

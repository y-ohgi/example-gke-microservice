import { describe, expect, test } from "vitest";
import { GET } from "./route";

describe("GET /api/health", () => {
  test("liveness/readiness probe用に200を返す", async () => {
    const res = await GET();

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: "ok" });
  });
});

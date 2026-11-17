import { NextResponse } from "next/server";

export const catalogServiceUrl =
  process.env.CATALOG_SERVICE_URL ?? "http://localhost:8080";

export const orderServiceUrl =
  process.env.ORDER_SERVICE_URL ?? "http://localhost:8081";

/**
 * バックエンドの Response をそのまま BFF のレスポンスとして転送する。
 * 404/400 などボディの無いレスポンスも安全に扱う。
 */
export async function forwardResponse(res: Response): Promise<NextResponse> {
  const text = await res.text();
  if (!text) {
    return new NextResponse(null, { status: res.status });
  }
  return new NextResponse(text, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}

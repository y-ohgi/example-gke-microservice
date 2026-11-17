import { NextResponse } from "next/server";

export const catalogServiceUrl =
  process.env.CATALOG_SERVICE_URL ?? "http://localhost:8080";

export const orderServiceUrl =
  process.env.ORDER_SERVICE_URL ?? "http://localhost:8081";

async function forwardResponse(res: Response): Promise<NextResponse> {
  const text = await res.text();
  if (!text) {
    return new NextResponse(null, { status: res.status });
  }
  const contentType = res.headers.get("content-type") ?? "application/json";
  return new NextResponse(text, {
    status: res.status,
    headers: { "Content-Type": contentType },
  });
}

/**
 * バックエンドへ fetch し、レスポンスをそのまま転送する。
 * ネットワーク障害時は REST/JSON の契約を保つため 502 の JSON を返す
 * (fetch の例外をそのまま投げると Next.js の汎用HTMLエラーになってしまうため)。
 */
export async function proxyFetch(
  url: string,
  init?: RequestInit,
): Promise<NextResponse> {
  let res: Response;
  try {
    res = await fetch(url, init);
  } catch {
    return NextResponse.json(
      { error: "upstream service unavailable" },
      { status: 502 },
    );
  }
  return forwardResponse(res);
}

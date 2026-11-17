import { orderServiceUrl, proxyFetch } from "@/lib/backend";

export async function GET() {
  return proxyFetch(`${orderServiceUrl}/orders`, { cache: "no-store" });
}

export async function POST(request: Request) {
  const body = await request.text();
  return proxyFetch(`${orderServiceUrl}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
}

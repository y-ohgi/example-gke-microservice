import { orderServiceUrl, forwardResponse } from "@/lib/backend";

export async function GET() {
  const res = await fetch(`${orderServiceUrl}/orders`, { cache: "no-store" });
  return forwardResponse(res);
}

export async function POST(request: Request) {
  const body = await request.text();
  const res = await fetch(`${orderServiceUrl}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
  return forwardResponse(res);
}

import { catalogServiceUrl, forwardResponse } from "@/lib/backend";

export async function GET() {
  const res = await fetch(`${catalogServiceUrl}/products`, {
    cache: "no-store",
  });
  return forwardResponse(res);
}

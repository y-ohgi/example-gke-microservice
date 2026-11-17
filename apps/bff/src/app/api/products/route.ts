import { catalogServiceUrl, proxyFetch } from "@/lib/backend";

export async function GET() {
  return proxyFetch(`${catalogServiceUrl}/products`, { cache: "no-store" });
}

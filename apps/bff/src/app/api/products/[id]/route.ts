import { catalogServiceUrl, forwardResponse } from "@/lib/backend";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const res = await fetch(`${catalogServiceUrl}/products/${id}`, {
    cache: "no-store",
  });
  return forwardResponse(res);
}

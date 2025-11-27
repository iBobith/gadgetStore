import { Product, RouterLike } from "./types";

export function handleDetails(
  product: Product,
  onDetails: ((p: Product) => void) | undefined,
  router: RouterLike
) {
  if (onDetails) {
    onDetails(product);
    return;
  }

  const rawId = product.id;
  if (rawId !== undefined && rawId !== null && String(rawId).trim() !== "") {
    const id = encodeURIComponent(String(rawId));
    router.push(`/products/${id}`);
    return;
  }

  const slug = String(product.title || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");
  if (slug) router.push(`/products?slug=${encodeURIComponent(slug)}`);
}

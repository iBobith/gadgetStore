import { Product } from "./types";

type DeleteOptions = {
  onDelete?: (p: Product) => void;
  apiBase?: string;
  setOpenMenu?: (v: boolean) => void;
  setDeleting?: (v: boolean) => void;
};

export async function handleDeleteProduct(
  product: Product,
  opts: DeleteOptions = {}
) {
  const { onDelete, apiBase: providedBase, setOpenMenu, setDeleting } = opts;

  if (onDelete) {
    onDelete(product);
    return true;
  }

  if (setOpenMenu) setOpenMenu(false);

  if (!confirm(`Delete product "${product.title}"?`)) return false;

  try {
    if (setDeleting) setDeleting(true);
    const apiBase =
      providedBase ??
      (process.env.NEXT_PUBLIC_API_URL as string) ??
      "http://localhost:4000";

    const rawId = product.id;
    if (rawId === undefined || rawId === null) {
      console.error("No id available to attempt id-based delete", product);
      alert("Cannot delete product: missing id. Refresh and try again.");
      return false;
    }

    const candidates = new Set<string>();
    candidates.add(String(rawId));
    const num = Number(String(rawId));
    if (!Number.isNaN(num)) candidates.add(String(num));

    let deleted = false;
    for (const cid of candidates) {
      const id = encodeURIComponent(cid);
      const url = `${apiBase.replace(/\/+$/, "")}/products/${id}`;
      console.log("Checking existence for candidate id:", cid, url);

      const check = await fetch(url, { method: "GET" });
      console.log("Existence check result:", check.status, check.statusText);
      if (!check.ok) {
        if (check.status !== 404) {
          const txt = await check.text().catch(() => "<no body>");
          console.error("Error checking product id", cid, check.status, txt);
          alert(`Error checking product: ${check.status} ${txt}`);
          return false;
        }
        continue;
      }

      const found = await check.json().catch(() => null);
      console.log("Found resource for candidate:", found);

      const r = await fetch(url, { method: "DELETE" });
      console.log("Delete attempt result:", r.status, r.statusText);
      if (r.ok) {
        deleted = true;
        break;
      }
      const txt = await r.text().catch(() => "<no body>");
      console.error("Delete failed for id", cid, r.status, txt);
      alert(`Failed to delete product id ${cid}: ${r.status} ${txt}`);
      return false;
    }

    if (!deleted) {
      console.error(
        "No matching id found on server for candidates",
        Array.from(candidates)
      );
      alert("Delete failed: no matching product id found on the server.");
      return false;
    }

    if (typeof window !== "undefined") window.location.reload();
    return true;
  } catch (err) {
    console.error(err);
    alert("Failed to delete the product. Check the console for details.");
    return false;
  } finally {
    if (setDeleting) setDeleting(false);
  }
}

import { Product } from "./types";

export function handleEditProduct(
  product: Product,
  onEdit: ((p: Product) => void) | undefined,
  setOpenMenu: (v: boolean) => void,
  setEditing: (v: boolean) => void
) {
  setOpenMenu(false);
  if (onEdit) onEdit(product);
  else setEditing(true);
}

import { revalidatePath, revalidateTag } from "next/cache";
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from "payload";

export const CATALOG_TAG = "catalog";

// Clears cached catalog data and the statically built homepage after any
// catalog edit, so admin changes show up on the storefront right away.
function revalidateCatalog() {
  try {
    revalidateTag(CATALOG_TAG);
    revalidatePath("/", "layout");
  } catch {
    // Outside a Next.js request (e.g. `npm run seed`) there is no cache to clear.
  }
}

export const revalidateCatalogAfterChange: CollectionAfterChangeHook = ({ doc }) => {
  revalidateCatalog();
  return doc;
};

export const revalidateCatalogAfterDelete: CollectionAfterDeleteHook = ({ doc }) => {
  revalidateCatalog();
  return doc;
};

import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import config from "@/payload.config";
import { CATALOG_TAG } from "@/hooks/revalidateCatalog";

// Catalog reads are cached across requests so storefront pages don't hit MongoDB
// on every visit. The cache is invalidated from Payload hooks (see
// src/hooks/revalidateCatalog.ts) whenever catalog data changes in the admin.
const REVALIDATE_SECONDS = 3600;

const cached = <A extends unknown[], R>(fn: (...args: A) => Promise<R>, key: string) =>
  unstable_cache(fn, [key], { tags: [CATALOG_TAG], revalidate: REVALIDATE_SECONDS });

const sortField = (sort: string) =>
  sort === "price-desc" ? "-price" : sort === "price-asc" ? "price" : "-createdAt";

export const getNavCategories = cached(async () => {
  const payload = await getPayload({ config });
  const [categories, subcategories] = await Promise.all([
    payload.find({ collection: "categories", sort: "displayOrder", depth: 0, limit: 100 }),
    payload.find({ collection: "subcategories", sort: "displayOrder", depth: 0, limit: 200 }),
  ]);

  return categories.docs.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    subcategories: subcategories.docs
      .filter((sub) => sub.category === cat.id)
      .map((sub) => ({ id: sub.id, name: sub.name, slug: sub.slug })),
  }));
}, "nav-categories");

export const getCategoryBySlug = cached(async (slug: string) => {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "categories",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  });
  return docs[0] ?? null;
}, "category-by-slug");

export const getSubcategoryBySlug = cached(async (categoryId: string, slug: string) => {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "subcategories",
    where: { slug: { equals: slug }, category: { equals: categoryId } },
    limit: 1,
    depth: 1,
  });
  return docs[0] ?? null;
}, "subcategory-by-slug");

export const getSubcategories = cached(async (categoryId: string) => {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "subcategories",
    where: { category: { equals: categoryId } },
    sort: "displayOrder",
    depth: 1,
    limit: 100,
  });
  return docs;
}, "subcategories");

export const getProducts = cached(
  async (filter: { category?: string; subcategory?: string }, sort: string) => {
    const payload = await getPayload({ config });
    const { docs, totalDocs } = await payload.find({
      collection: "products",
      where: filter.subcategory
        ? { subcategory: { equals: filter.subcategory } }
        : { category: { equals: filter.category } },
      sort: sortField(sort),
      limit: 12,
      // depth 1 populates mainImage and category/subcategory, which is all the cards need
      depth: 1,
    });
    return { docs, totalDocs };
  },
  "products",
);

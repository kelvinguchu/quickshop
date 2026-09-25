// Seeds categories, subcategories and products from the images in /public.
// Run with: npx payload run scripts/seed.ts
// Safe to re-run: existing media (by filename), categories/subcategories (by slug)
// and products (by SKU) are reused instead of duplicated.
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getPayload } from "payload";
import config from "../src/payload.config";

const ADMIN_EMAIL = "kulmidigital@gmail.com";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(dirname, "../public");

const payload = await getPayload({ config });

// ---------- helpers ----------

const mediaCache = new Map<string, string>();

async function media(relPath: string, alt: string): Promise<string> {
  const cached = mediaCache.get(relPath);
  if (cached) return cached;

  const filename = path.basename(relPath);
  const existing = await payload.find({
    collection: "media",
    where: { filename: { equals: filename } },
    limit: 1,
  });

  const id =
    existing.docs[0]?.id ??
    (
      await payload.create({
        collection: "media",
        data: { alt },
        filePath: path.join(publicDir, relPath),
      })
    ).id;

  console.log(`  media ${existing.docs[0] ? "exists " : "uploaded"} ${relPath}`);
  mediaCache.set(relPath, String(id));
  return String(id);
}

function richText(...paragraphs: string[]) {
  return {
    root: {
      type: "root",
      format: "" as const,
      indent: 0,
      version: 1,
      direction: "ltr" as const,
      children: paragraphs.map((text) => ({
        type: "paragraph",
        format: "",
        indent: 0,
        version: 1,
        direction: "ltr",
        textFormat: 0,
        children: [
          { type: "text", text, format: 0, detail: 0, mode: "normal", style: "", version: 1 },
        ],
      })),
    },
  };
}

async function upsertBySlug<T extends "categories" | "subcategories">(
  collection: T,
  slug: string,
  data: Record<string, unknown>,
): Promise<string> {
  const existing = await payload.find({ collection, where: { slug: { equals: slug } }, limit: 1 });
  const doc = existing.docs[0]
    ? await payload.update({ collection, id: existing.docs[0].id, data: data as never })
    : await payload.create({ collection, data: { ...data, slug } as never });
  console.log(`${collection} ${existing.docs[0] ? "updated" : "created"} ${slug}`);
  return String(doc.id);
}

const titleCase = (s: string) =>
  s.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");

// ---------- data ----------

const SIZES = ["S", "M", "L", "XL", "XXL"] as const;
const sizeVariations = SIZES.map((size) => ({ size, inStock: true }));

const HEIGHTS = {
  abaya: [
    { min: 150, max: 160, label: "Petite" },
    { min: 160, max: 170, label: "Regular" },
    { min: 170, max: 180, label: "Tall" },
  ],
  qamis: [
    { min: 160, max: 170, label: "Short" },
    { min: 170, max: 180, label: "Regular" },
    { min: 180, max: 195, label: "Tall" },
  ],
};

const COLOR_CODES: Record<string, string> = {
  black: "#141414",
  grey: "#7a7482",
  lilac: "#c9aeb0",
  beige: "#d9c2a3",
  "fuschia-lily": "#c2185b",
  green: "#1f3b33",
  maroon: "#5c1a22",
  charcoal: "#3a3a3c",
  "deep-olive": "#3b3a24",
  "khaki-olive": "#8a7d62",
  mahogany: "#4a1f1c",
  "dusky-blue": "#9aa8b5",
  latte: "#c2ab93",
  "rich-auburn": "#4a2418",
  "smoked-mauve": "#6e5f60",
  "dusty-mocha": "#7a5a45",
  "mauve-grey": "#7d7477",
  "sage-grey": "#8d918b",
};

type Category = "abaya" | "qamis";

type ProductSeed = {
  sku: string;
  name: string;
  category: Category;
  subcategory: string;
  price: number;
  description: string[];
  featured?: boolean;
  trending?: boolean;
} & (
  | { image: string; color: string; colorCode: string }
  | { colorFolder: string; colorPrefix: string; colors: string[] }
);

const categories: Record<Category, { name: string; description: string; image: string; displayOrder: number }> = {
  abaya: {
    name: "Abayas",
    description: "Elegant, modest abayas in flowing fabrics, from everyday essentials to embellished occasion wear.",
    image: "hero/hero-abaya.jpg",
    displayOrder: 1,
  },
  qamis: {
    name: "Qamis",
    description: "Refined qamis and thobes for men, tailored for comfort in classic collared and Emirati cuts.",
    image: "hero/hero-thobe.jpg",
    displayOrder: 2,
  },
};

const subcategories: { slug: string; name: string; category: Category; description: string; image: string }[] = [
  { slug: "everyday-abayas", name: "Everyday Abayas", category: "abaya", description: "Easy, breathable closed abayas for daily wear.", image: "abayas/abaya7.webp" },
  { slug: "belted-abayas", name: "Belted Abayas", category: "abaya", description: "Abayas with a tie belt for a defined, graceful silhouette.", image: "different-color-abayas/abaya2-beige.webp" },
  { slug: "flowy-abayas", name: "Flowy Abayas", category: "abaya", description: "Full, flared abayas with beautiful movement.", image: "different-color-abayas/abaya1-lilac.webp" },
  { slug: "embellished-abayas", name: "Embellished Abayas", category: "abaya", description: "Abayas finished with delicate trim and detailing for special occasions.", image: "abayas/abaya9.webp" },
  { slug: "textured-abayas", name: "Textured Abayas", category: "abaya", description: "Abayas in rich textured fabrics with a subtle sheen.", image: "abayas/abaya5.webp" },
  { slug: "collared-qamis", name: "Collared Qamis", category: "qamis", description: "Qamis with a classic mandarin collar and button placket.", image: "different-color-qamis/qamis1-mahogany.webp" },
  { slug: "emirati-qamis", name: "Emirati Qamis", category: "qamis", description: "Collarless Emirati-style qamis with a tasselled neckline.", image: "different-color-qamis/qamis5-dusty-mocha.webp" },
  { slug: "short-sleeve-qamis", name: "Short Sleeve Qamis", category: "qamis", description: "Lightweight short-sleeve qamis for warm days.", image: "qamis/qamis10.webp" },
];

const products: ProductSeed[] = [
  // ----- Abayas: multi-colour styles -----
  {
    sku: "QS-ABY-101", name: "Satin Flow Abaya", category: "abaya", subcategory: "flowy-abayas", price: 79,
    colorFolder: "different-color-abayas", colorPrefix: "abaya", colors: ["black", "grey", "lilac"],
    description: ["A luxuriously soft satin-finish abaya with a full flared hem and gathered cuffs.", "Drapes beautifully and moves with you - perfect for Eid, weddings and special gatherings."],
    featured: true, trending: true,
  },
  {
    sku: "QS-ABY-102", name: "Pleated Flare Abaya", category: "abaya", subcategory: "flowy-abayas", price: 85,
    colorFolder: "different-color-abayas", colorPrefix: "abaya1", colors: ["black", "grey", "lilac"],
    description: ["A statement abaya with soft pleats that fan out into a dramatic flared skirt.", "Features balloon sleeves with elasticated cuffs for an elegant finish."],
    featured: true,
  },
  {
    sku: "QS-ABY-103", name: "Belted Flare Abaya", category: "abaya", subcategory: "belted-abayas", price: 72,
    colorFolder: "different-color-abayas", colorPrefix: "abaya2", colors: ["beige", "black", "fuschia-lily", "green", "maroon"],
    description: ["Our best-selling belted abaya, cut in a flowing crepe with a detachable tie belt.", "Available in five rich colours to suit every occasion."],
    featured: true, trending: true,
  },
  // ----- Abayas: single styles -----
  { sku: "QS-ABY-001", name: "Dove Grey Everyday Abaya", category: "abaya", subcategory: "everyday-abayas", price: 49, image: "abayas/abaya.webp", color: "Dove Grey", colorCode: "#c8c3c6", description: ["A light, airy closed abaya in a soft dove grey.", "Relaxed fit with gathered cuffs - an effortless everyday staple."], trending: true },
  { sku: "QS-ABY-002", name: "Espresso Belted Abaya", category: "abaya", subcategory: "belted-abayas", price: 59, image: "abayas/abaya1.webp", color: "Espresso Brown", colorCode: "#5a4636", description: ["A rich espresso-brown abaya with wide flared sleeves and a self-tie belt.", "Pairs beautifully with the matching chiffon hijab."] },
  { sku: "QS-ABY-003", name: "Khaki Batwing Abaya", category: "abaya", subcategory: "everyday-abayas", price: 52, image: "abayas/abaya2.webp", color: "Khaki Brown", colorCode: "#6b5a47", description: ["A graceful batwing-sleeve abaya in warm khaki.", "Loose and comfortable with a clean, modest line."] },
  { sku: "QS-ABY-004", name: "Olive Crepe Abaya", category: "abaya", subcategory: "everyday-abayas", price: 55, image: "abayas/abaya3.webp", color: "Olive", colorCode: "#4b5230", description: ["An earthy olive crepe abaya with a subtle front zip.", "Soft, breathable fabric that is easy to wear all day."] },
  { sku: "QS-ABY-005", name: "Midnight Textured Abaya", category: "abaya", subcategory: "textured-abayas", price: 68, image: "abayas/abaya4.webp", color: "Midnight Navy", colorCode: "#1d2338", description: ["Deep midnight navy in a crinkle-textured fabric with a gentle sheen.", "Finished with wide sleeves and a tie belt."], featured: true },
  { sku: "QS-ABY-006", name: "Slate Shimmer Abaya", category: "abaya", subcategory: "textured-abayas", price: 69, image: "abayas/abaya5.webp", color: "Slate", colorCode: "#2f3638", description: ["A textured slate abaya with a soft shimmer that catches the light.", "Relaxed silhouette with generous sleeves."] },
  { sku: "QS-ABY-007", name: "Navy Classic Abaya", category: "abaya", subcategory: "everyday-abayas", price: 45, image: "abayas/abaya6.webp", color: "Navy", colorCode: "#1b2238", description: ["A timeless navy closed abaya in a smooth, lightweight fabric.", "A versatile wardrobe essential."] },
  { sku: "QS-ABY-008", name: "Black Essential Abaya", category: "abaya", subcategory: "everyday-abayas", price: 45, image: "abayas/abaya7.webp", color: "Black", colorCode: "#141414", description: ["The essential black abaya - simple, elegant and endlessly versatile.", "Lightweight fabric with a relaxed fit."], trending: true },
  { sku: "QS-ABY-009", name: "Olive Trim Abaya", category: "abaya", subcategory: "embellished-abayas", price: 75, image: "abayas/abaya8.webp", color: "Olive Brown", colorCode: "#5b4a33", description: ["An olive-brown abaya finished with delicate pom-pom trim along the front and cuffs.", "Understated detailing for a refined look."] },
  { sku: "QS-ABY-010", name: "Steel Blue Trim Abaya", category: "abaya", subcategory: "embellished-abayas", price: 75, image: "abayas/abaya9.webp", color: "Steel Blue", colorCode: "#4c6a8a", description: ["A steel-blue abaya with contrast black trim framing the front and wide sleeves.", "Eye-catching yet modest."], featured: true },
  { sku: "QS-ABY-011", name: "Dusty Rose Trim Abaya", category: "abaya", subcategory: "embellished-abayas", price: 75, image: "abayas/abaya10.webp", color: "Dusty Rose", colorCode: "#9c7470", description: ["A soft dusty-rose abaya with delicate trim detailing.", "Pairs beautifully with a blush hijab."], trending: true },

  // ----- Qamis: multi-colour styles -----
  {
    sku: "QS-QMS-101", name: "Classic Collared Qamis", category: "qamis", subcategory: "collared-qamis", price: 49,
    colorFolder: "different-color-qamis", colorPrefix: "qamis", colors: ["black", "charcoal", "deep-olive", "khaki-olive"],
    description: ["A classic long-sleeve qamis with a mandarin collar and concealed button placket.", "Tailored from a soft, breathable fabric for all-day comfort."],
    featured: true, trending: true,
  },
  {
    sku: "QS-QMS-102", name: "Premium Collared Qamis", category: "qamis", subcategory: "collared-qamis", price: 55,
    colorFolder: "different-color-qamis", colorPrefix: "qamis1", colors: ["mahogany", "black", "charcoal", "deep-olive"],
    description: ["Our premium collared qamis in a smooth, fine-weave fabric with a subtle sheen.", "Features side pockets and a chest pocket."],
    featured: true,
  },
  {
    sku: "QS-QMS-103", name: "Essential Collared Qamis", category: "qamis", subcategory: "collared-qamis", price: 45,
    colorFolder: "different-color-qamis", colorPrefix: "qamis2", colors: ["black", "charcoal", "deep-olive"],
    description: ["An everyday collared qamis with a clean, straight cut.", "Easy-care fabric that holds its shape."],
  },
  {
    sku: "QS-QMS-104", name: "Emirati Qamis", category: "qamis", subcategory: "emirati-qamis", price: 52,
    colorFolder: "different-color-qamis", colorPrefix: "qamis3", colors: ["dusky-blue", "khaki-olive", "latte"],
    description: ["A collarless Emirati-style qamis with a tonal embroidered placket.", "Relaxed fit with side pockets."],
    trending: true,
  },
  {
    sku: "QS-QMS-105", name: "Royal Emirati Qamis", category: "qamis", subcategory: "emirati-qamis", price: 58,
    colorFolder: "different-color-qamis", colorPrefix: "qamis4", colors: ["rich-auburn", "khaki-olive", "smoked-mauve"],
    description: ["A refined Emirati qamis in deep, rich tones.", "Finished with a traditional tassel at the neckline."],
    featured: true,
  },
  {
    sku: "QS-QMS-106", name: "Tassel Emirati Qamis", category: "qamis", subcategory: "emirati-qamis", price: 56,
    colorFolder: "different-color-qamis", colorPrefix: "qamis5", colors: ["dusty-mocha", "mauve-grey", "sage-grey"],
    description: ["An Emirati qamis with contrast piping and a decorative tassel.", "A smart choice for Jumu'ah and Eid."],
  },
  // ----- Qamis: single styles -----
  { sku: "QS-QMS-001", name: "Powder Blue Collared Qamis", category: "qamis", subcategory: "collared-qamis", price: 45, image: "qamis/qamis4.webp", color: "Powder Blue", colorCode: "#9fb1c2", description: ["A light powder-blue qamis with a mandarin collar.", "Cool and comfortable for warm weather."] },
  { sku: "QS-QMS-002", name: "Taupe Embroidered Qamis", category: "qamis", subcategory: "emirati-qamis", price: 54, image: "qamis/qamis5.webp", color: "Taupe", colorCode: "#9b927f", description: ["A taupe Emirati qamis with tonal V-yoke embroidery.", "Subtle detailing with a relaxed fit."], trending: true },
  { sku: "QS-QMS-003", name: "Camel Emirati Qamis", category: "qamis", subcategory: "emirati-qamis", price: 50, image: "qamis/qamis6.webp", color: "Camel", colorCode: "#b09470", description: ["A warm camel Emirati qamis with a round neckline.", "Clean lines and a comfortable straight cut."] },
  { sku: "QS-QMS-004", name: "Stone Grey Collared Qamis", category: "qamis", subcategory: "collared-qamis", price: 47, image: "qamis/qamis7.webp", color: "Stone Grey", colorCode: "#a8a49b", description: ["A versatile stone-grey qamis with a mandarin collar.", "Soft, breathable fabric for everyday wear."] },
  { sku: "QS-QMS-005", name: "Sage Emirati Qamis", category: "qamis", subcategory: "emirati-qamis", price: 50, image: "qamis/qamis8.webp", color: "Sage", colorCode: "#c8ccc0", description: ["A fresh sage Emirati qamis with a tasselled neckline.", "Light and airy for the summer months."] },
  { sku: "QS-QMS-006", name: "Blush Short Sleeve Qamis", category: "qamis", subcategory: "short-sleeve-qamis", price: 39, image: "qamis/qamis9.webp", color: "Blush", colorCode: "#ecd8c8", description: ["A lightweight short-sleeve qamis in soft blush.", "Perfect for hot days and relaxed occasions."] },
  { sku: "QS-QMS-007", name: "Sky Blue Short Sleeve Qamis", category: "qamis", subcategory: "short-sleeve-qamis", price: 39, image: "qamis/qamis10.webp", color: "Sky Blue", colorCode: "#aac4d6", description: ["A breezy sky-blue short-sleeve qamis with contrast piping.", "Cool, comfortable and easy to wear."], featured: true },
];

// ---------- seed ----------

console.log("\n== Categories");
const categoryIds = {} as Record<Category, string>;
for (const [slug, c] of Object.entries(categories) as [Category, (typeof categories)[Category]][]) {
  const image = await media(c.image, c.name);
  categoryIds[slug] = await upsertBySlug("categories", slug, {
    name: c.name,
    description: c.description,
    featured: true,
    displayOrder: c.displayOrder,
    image,
    bannerImage: image,
  });
}

console.log("\n== Subcategories");
const subcategoryIds: Record<string, string> = {};
for (const [i, s] of subcategories.entries()) {
  subcategoryIds[s.slug] = await upsertBySlug("subcategories", s.slug, {
    name: s.name,
    category: categoryIds[s.category],
    description: s.description,
    displayOrder: i + 1,
    image: await media(s.image, s.name),
  });
}

for (const slug of Object.keys(categoryIds) as Category[]) {
  await payload.update({
    collection: "categories",
    id: categoryIds[slug],
    data: {
      subcategories: subcategories.filter((s) => s.category === slug).map((s) => subcategoryIds[s.slug]),
    },
  });
}

console.log("\n== Products");
for (const p of products) {
  let colorData;
  if ("image" in p) {
    colorData = {
      mainImage: await media(p.image, p.name),
      color: p.color,
      colorCode: p.colorCode,
      colorVariations: [],
    };
  } else {
    const file = (color: string) => `${p.colorFolder}/${p.colorPrefix}-${color}.webp`;
    const [main, ...rest] = p.colors;
    colorData = {
      mainImage: await media(file(main), `${p.name} - ${titleCase(main)}`),
      color: titleCase(main),
      colorCode: COLOR_CODES[main],
      colorVariations: await Promise.all(
        rest.map(async (color) => ({
          color: titleCase(color),
          colorCode: COLOR_CODES[color],
          image: await media(file(color), `${p.name} - ${titleCase(color)}`),
        })),
      ),
    };
  }

  const data = {
    name: p.name,
    description: richText(...p.description),
    price: p.price,
    category: categoryIds[p.category],
    subcategory: subcategoryIds[p.subcategory],
    status: "active" as const,
    featured: p.featured ?? false,
    trending: p.trending ?? false,
    sku: p.sku,
    sizeVariations,
    heightRanges: HEIGHTS[p.category],
    ...colorData,
  };

  const existing = await payload.find({ collection: "products", where: { sku: { equals: p.sku } }, limit: 1 });
  if (existing.docs[0]) {
    await payload.update({ collection: "products", id: existing.docs[0].id, data });
  } else {
    await payload.create({ collection: "products", data });
  }
  console.log(`products ${existing.docs[0] ? "updated" : "created"} ${p.sku} ${p.name}`);
}

console.log("\n== Admin user");
const updated = await payload.update({
  collection: "users",
  where: { email: { equals: ADMIN_EMAIL } },
  data: { role: "admin" },
});
console.log(updated.docs.length ? `${ADMIN_EMAIL} is now admin` : `${ADMIN_EMAIL} not found`);

console.log(`\nDone: ${products.length} products, ${subcategories.length} subcategories, ${Object.keys(categories).length} categories.`);
process.exit(0);

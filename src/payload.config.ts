import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { payloadCloudPlugin } from "@payloadcms/payload-cloud";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Categories } from "./collections/Categories";
import { SubCategories } from "./collections/SubCategories";
import { Products } from "./collections/Products";
import Orders from "./collections/Orders";
import CustomOrders from "./collections/CustomOrders";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: " - QuickShop",
      icons: [
        {
          rel: "icon",
          type: "image/png",
          url: "/icons/icon-192x192.png",
        },
      ],
    },
    components: {
      graphics: {
        Logo: "./components/admin/Logo.tsx",
        Icon: "./components/admin/Icon.tsx",
      },
    },
  },
  collections: [
    Users,
    Media,
    Categories,
    SubCategories,
    Products,
    Orders,
    CustomOrders,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET ?? "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI ?? "",
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    vercelBlobStorage({
      collections: {
        // key must match the slug in ./collections/Media
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
      // Uncomment if you need to upload files larger than 4.5 MB directly from the client
      // clientUploads: true,
    }),
  ],
});

import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
  },
  auth: true,
  fields: [
    // Email added by default
    {
      name: "firstName",
      type: "text",
      required: true,
    },
    {
      name: "lastName",
      type: "text",
      required: true,
    },
    {
      name: "profilePhoto",
      type: "upload",
      relationTo: "media",
      admin: {
        description: "Upload a profile photo",
      },
    },
    {
      name: "cart",
      type: "json",
      admin: {
        description: "User's saved cart items",
      },
    },
    {
      name: "wishlist",
      type: "json",
      admin: {
        description: "User's saved wishlist items",
      },
    },
  ],
};

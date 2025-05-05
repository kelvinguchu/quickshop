import type { CollectionConfig } from "payload";

export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "category", "price", "status"],
    listSearchableFields: ["name", "description", "sku"],
  },
  access: {
    read: () => true, // Everyone can read products
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "richText",
      required: true,
    },
    {
      name: "price",
      type: "number",
      required: true,
      min: 0,
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      required: true,
      hasMany: false,
    },
    {
      name: "subcategory",
      type: "relationship",
      relationTo: "subcategories",
      required: true,
      hasMany: false,
      admin: {
        condition: (data) => Boolean(data?.category),
        description:
          "Select a subcategory that belongs to the selected main category",
      },
      // Filter subcategories based on the selected category
      filterOptions: ({ data }) => {
        if (!data?.category) return false;
        return {
          category: { equals: data.category },
        };
      },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "active",
      options: [
        { label: "Active", value: "active" },
        { label: "Draft", value: "draft" },
        { label: "Out of Stock", value: "out-of-stock" },
      ],
    },
    {
      name: "featured",
      type: "checkbox",
      label: "Featured Product",
      defaultValue: false,
    },
    {
      name: "trending",
      type: "checkbox",
      label: "Trending Product",
      defaultValue: false,
    },
    {
      name: "sku",
      type: "text",
      required: false,
      unique: true,
    },
    {
      name: "mainImage",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    // Main Color
    {
      name: "color",
      type: "text",
      label: "Main Color",
      required: true,
    },
    {
      name: "colorCode",
      type: "text",
      label: "Color Code (Hex)",
      required: false,
      admin: {
        description: "Hex code or color name for the main color",
      },
    },
    // Product Color Variations - Additional color options
    {
      name: "colorVariations",
      type: "array",
      label: "Additional Color Variations",
      fields: [
        {
          name: "color",
          type: "text",
          required: true,
        },
        {
          name: "colorCode",
          type: "text", // Hex code or color name
          required: false,
        },
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
        {
          name: "additionalImages",
          type: "array",
          label: "Additional Images",
          fields: [
            {
              name: "image",
              type: "upload",
              relationTo: "media",
              required: true,
            },
          ],
        },
      ],
    },
    // Size Variations
    {
      name: "sizeVariations",
      type: "array",
      label: "Size Variations",
      minRows: 1,
      fields: [
        {
          name: "size",
          type: "select",
          required: true,
          options: [
            { label: "S", value: "S" },
            { label: "M", value: "M" },
            { label: "L", value: "L" },
            { label: "XL", value: "XL" },
            { label: "XXL", value: "XXL" },
          ],
        },
        {
          name: "inStock",
          type: "checkbox",
          defaultValue: true,
        },
      ],
    },
    // Height Ranges
    {
      name: "heightRanges",
      type: "array",
      label: "Height Ranges (cm)",
      minRows: 1,
      fields: [
        {
          name: "min",
          type: "number",
          required: true,
        },
        {
          name: "max",
          type: "number",
          required: true,
        },
        {
          name: "label",
          type: "text",
          required: true,
          admin: {
            description: 'E.g., "Short", "Regular", "Tall"',
          },
        },
      ],
    },
  ],
};

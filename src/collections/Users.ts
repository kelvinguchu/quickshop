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
    {
      name: "phone",
      type: "text",
      admin: {
        description: "User's mobile/phone number",
      },
    },
    {
      name: "savedMeasurements",
      type: "group",
      admin: {
        description:
          "User's saved body measurements for custom orders by category",
      },
      fields: [
        {
          name: "abaya",
          type: "group",
          admin: {
            description: "Measurements for abaya category",
          },
          fields: [
            {
              name: "chest",
              type: "number",
              admin: {
                description: "Chest measurement in cm",
              },
            },
            {
              name: "shoulder",
              type: "number",
              admin: {
                description: "Shoulder width in cm",
              },
            },
            {
              name: "sleeve",
              type: "number",
              admin: {
                description: "Sleeve length in cm",
              },
            },
            {
              name: "length",
              type: "number",
              admin: {
                description: "Total length in cm",
              },
            },
            {
              name: "waist",
              type: "number",
              admin: {
                description: "Waist measurement in cm",
              },
            },
            {
              name: "hip",
              type: "number",
              admin: {
                description: "Hip measurement in cm",
              },
            },
          ],
        },
        {
          name: "qamis",
          type: "group",
          admin: {
            description: "Measurements for qamis category",
          },
          fields: [
            {
              name: "chest",
              type: "number",
              admin: {
                description: "Chest measurement in cm",
              },
            },
            {
              name: "shoulder",
              type: "number",
              admin: {
                description: "Shoulder width in cm",
              },
            },
            {
              name: "sleeve",
              type: "number",
              admin: {
                description: "Sleeve length in cm",
              },
            },
            {
              name: "length",
              type: "number",
              admin: {
                description: "Total length in cm",
              },
            },
            {
              name: "waist",
              type: "number",
              admin: {
                description: "Waist measurement in cm",
              },
            },
            {
              name: "hip",
              type: "number",
              admin: {
                description: "Hip measurement in cm",
              },
            },
          ],
        },
      ],
    },
    {
      name: "savedShippingAddress",
      type: "group",
      admin: {
        description: "User's saved shipping address",
      },
      fields: [
        {
          name: "address",
          type: "text",
          admin: {
            description: "Street address",
          },
        },
        {
          name: "city",
          type: "text",
          admin: {
            description: "City",
          },
        },
        {
          name: "country",
          type: "text",
          admin: {
            description: "Country",
          },
        },
        {
          name: "postalCode",
          type: "text",
          admin: {
            description: "Postal/ZIP code",
          },
        },
      ],
    },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "customer",
      options: [
        {
          label: "Customer",
          value: "customer",
        },
        {
          label: "Admin",
          value: "admin",
        },
      ],
      admin: {
        description: "User role for access control",
      },
    },
  ],
};

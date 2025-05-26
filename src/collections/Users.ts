import type { CollectionConfig } from "payload";

// Helper function for measurement fields
const measurementField = (name: string, description: string) => ({
  name,
  type: "number" as const,
  min: 0,
  max: 300,
  admin: { description },
});

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
      validate: (value: string | null | undefined) => {
        if (!value) return true; // Allow empty since it's optional
        const phoneRegex =
          /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{4,6}$/;
        if (!phoneRegex.test(value)) {
          return "Please enter a valid phone number";
        }
        return true;
      },
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
            measurementField("chest", "Chest measurement in cm"),
            measurementField("shoulder", "Shoulder width in cm"),
            measurementField("sleeve", "Sleeve length in cm"),
            measurementField("length", "Total length in cm"),
            measurementField("waist", "Waist measurement in cm"),
            measurementField("hip", "Hip measurement in cm"),
          ],
        },
        {
          name: "qamis",
          type: "group",
          admin: {
            description: "Measurements for qamis category",
          },
          fields: [
            measurementField("chest", "Chest measurement in cm"),
            measurementField("shoulder", "Shoulder width in cm"),
            measurementField("sleeve", "Sleeve length in cm"),
            measurementField("length", "Total length in cm"),
            measurementField("waist", "Waist measurement in cm"),
            measurementField("hip", "Hip measurement in cm"),
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
          maxLength: 200,
          admin: {
            description: "Street address",
          },
        },
        {
          name: "city",
          type: "text",
          maxLength: 100,
          admin: {
            description: "City",
          },
        },
        {
          name: "country",
          type: "text",
          maxLength: 100,
          admin: {
            description: "Country",
          },
        },
        {
          name: "postalCode",
          type: "text",
          maxLength: 20,
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

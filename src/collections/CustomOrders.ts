import type { CollectionConfig } from "payload";

const CustomOrders: CollectionConfig = {
  slug: "custom-orders",
  admin: {
    useAsTitle: "orderNumber",
    defaultColumns: [
      "orderNumber",
      "customer",
      "product",
      "status",
      "createdAt",
    ],
    description: "Custom measurement orders with deposit payments",
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false;
      // Admins can read all orders
      if (user.role === "admin") return true;
      // Users can only read their own orders using userId for better security
      return {
        userId: {
          equals: user.id,
        },
      };
    },
    create: ({ req: { user } }) => {
      // Only authenticated users can create orders
      return !!user;
    },
    update: ({ req: { user } }) => {
      if (!user) return false;
      // Admins can update all orders
      if (user.role === "admin") return true;
      // Users can only update their own orders using userId for better security
      return {
        userId: {
          equals: user.id,
        },
      };
    },
    delete: ({ req: { user } }) => {
      if (!user) return false;
      // Only admins can delete orders
      return user.role === "admin";
    },
  },
  fields: [
    {
      name: "orderNumber",
      type: "text",
      required: true,
      admin: {
        description: "Unique custom order identifier",
      },
    },
    {
      name: "userId",
      type: "text",
      required: true,
      admin: {
        description: "ID of the user who created this order",
      },
      access: {
        update: ({ req: { user } }) => {
          // Only admins can update userId to prevent tampering
          return user?.role === "admin";
        },
      },
    },
    {
      name: "product",
      type: "group",
      fields: [
        {
          name: "id",
          type: "text",
          required: true,
          admin: {
            description: "Product ID/slug",
          },
        },
        {
          name: "name",
          type: "text",
          required: true,
        },
        {
          name: "price",
          type: "number",
          required: true,
        },
        {
          name: "image",
          type: "text",
          admin: {
            description: "Product image URL",
          },
        },
      ],
    },
    {
      name: "measurements",
      type: "group",
      fields: [
        {
          name: "chest",
          type: "number",
          required: true,
          admin: {
            description: "Chest measurement in cm",
          },
        },
        {
          name: "shoulder",
          type: "number",
          required: true,
          admin: {
            description: "Shoulder width in cm",
          },
        },
        {
          name: "sleeve",
          type: "number",
          required: true,
          admin: {
            description: "Sleeve length in cm",
          },
        },
        {
          name: "length",
          type: "number",
          required: true,
          admin: {
            description: "Total length in cm",
          },
        },
        {
          name: "waist",
          type: "number",
          required: true,
          admin: {
            description: "Waist measurement in cm",
          },
        },
        {
          name: "hip",
          type: "number",
          required: true,
          admin: {
            description: "Hip measurement in cm",
          },
        },
      ],
    },
    {
      name: "customer",
      type: "group",
      fields: [
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
          name: "email",
          type: "email",
          required: true,
        },
        {
          name: "phone",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "shippingAddress",
      type: "group",
      fields: [
        {
          name: "address",
          type: "text",
          required: true,
        },
        {
          name: "city",
          type: "text",
          required: true,
        },
        {
          name: "country",
          type: "text",
          required: true,
        },
        {
          name: "postalCode",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "depositAmount",
      type: "number",
      required: true,
      admin: {
        description: "30% deposit amount paid",
      },
    },
    {
      name: "remainingAmount",
      type: "number",
      required: true,
      admin: {
        description: "Remaining 70% to be paid",
      },
    },
    {
      name: "totalAmount",
      type: "number",
      required: true,
      admin: {
        description: "Total order amount",
      },
    },
    {
      name: "payment",
      type: "group",
      fields: [
        {
          name: "method",
          type: "select",
          required: true,
          options: [
            {
              label: "Card Payment",
              value: "card",
            },
            {
              label: "M-Pesa",
              value: "mpesa",
            },
            {
              label: "Bank Transfer",
              value: "bank",
            },
          ],
        },
        {
          name: "transactionId",
          type: "text",
          admin: {
            description: "Payment provider transaction ID for deposit",
          },
        },
        {
          name: "status",
          type: "select",
          defaultValue: "pending",
          options: [
            {
              label: "Pending",
              value: "pending",
            },
            {
              label: "Complete",
              value: "complete",
            },
            {
              label: "Failed",
              value: "failed",
            },
          ],
        },
        {
          name: "details",
          type: "json",
          admin: {
            description: "Additional payment details from provider",
          },
          access: {
            read: ({ req: { user } }) => {
              // Only admins can read full payment details
              return user?.role === "admin";
            },
            update: ({ req: { user } }) => {
              // Only admins can update payment details
              return user?.role === "admin";
            },
          },
        },
      ],
    },
    {
      name: "finalPayment",
      type: "group",
      admin: {
        description: "Final 70% payment details",
      },
      fields: [
        {
          name: "method",
          type: "select",
          options: [
            {
              label: "Card Payment",
              value: "card",
            },
            {
              label: "M-Pesa",
              value: "mpesa",
            },
            {
              label: "Bank Transfer",
              value: "bank",
            },
            {
              label: "Cash on Delivery",
              value: "cod",
            },
          ],
        },
        {
          name: "transactionId",
          type: "text",
          admin: {
            description: "Payment provider transaction ID for final payment",
          },
        },
        {
          name: "status",
          type: "select",
          defaultValue: "pending",
          options: [
            {
              label: "Pending",
              value: "pending",
            },
            {
              label: "Complete",
              value: "complete",
            },
            {
              label: "Failed",
              value: "failed",
            },
          ],
        },
        {
          name: "paidAt",
          type: "date",
          admin: {
            description: "When the final payment was completed",
          },
        },
      ],
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "deposit-paid",
      options: [
        {
          label: "Deposit Paid",
          value: "deposit-paid",
        },
        {
          label: "In Production",
          value: "in-production",
        },
        {
          label: "Quality Check",
          value: "quality-check",
        },
        {
          label: "Ready for Final Payment",
          value: "ready-for-payment",
        },
        {
          label: "Fully Paid",
          value: "fully-paid",
        },
        {
          label: "Shipped",
          value: "shipped",
        },
        {
          label: "Delivered",
          value: "delivered",
        },
        {
          label: "Cancelled",
          value: "cancelled",
        },
      ],
      access: {
        update: ({ req: { user } }) => {
          // Only admins can update order status
          return user?.role === "admin";
        },
      },
    },
    {
      name: "notes",
      type: "textarea",
      admin: {
        description: "Customer notes or special requirements",
      },
    },
    {
      name: "productionNotes",
      type: "textarea",
      admin: {
        description: "Internal production notes",
      },
      access: {
        read: ({ req: { user } }) => {
          // Only admins can read production notes
          return user?.role === "admin";
        },
        update: ({ req: { user } }) => {
          // Only admins can update production notes
          return user?.role === "admin";
        },
      },
    },
    {
      name: "estimatedCompletionDate",
      type: "date",
      admin: {
        description: "Estimated completion date for production",
      },
    },
    {
      name: "completedAt",
      type: "date",
      admin: {
        description: "When the order was completed",
      },
    },
  ],
  timestamps: true,
};

export default CustomOrders;

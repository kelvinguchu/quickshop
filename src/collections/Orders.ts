import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'customer', 'status', 'total', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => {
      // Admin can read all orders
      if (user?.role === 'admin') return true

      // Customers can only read their own orders
      if (user?.role === 'customer') {
        return {
          customer: {
            equals: user.id,
          },
        }
      }

      return false
    },
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      return false
    },
    delete: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      return false
    },
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Unique order identifier',
      },
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Processing', value: 'processing' },
        { label: 'Shipped', value: 'shipped' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
        },
        {
          name: 'color',
          type: 'text',
          required: true,
        },
        {
          name: 'size',
          type: 'text',
          required: true,
        },
        {
          name: 'height',
          type: 'text',
        },
        {
          name: 'customMeasurements',
          type: 'json',
          admin: {
            description: 'Custom measurements provided by the customer',
          },
        },
        {
          name: 'price',
          type: 'number',
          required: true,
          min: 0,
        },
      ],
    },
    {
      name: 'subtotal',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'shipping',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'tax',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'total',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'shippingAddress',
      type: 'group',
      required: true,
      fields: [
        {
          name: 'fullName',
          type: 'text',
          required: true,
        },
        {
          name: 'addressLine1',
          type: 'text',
          required: true,
        },
        {
          name: 'addressLine2',
          type: 'text',
        },
        {
          name: 'city',
          type: 'text',
          required: true,
        },
        {
          name: 'state',
          type: 'text',
          required: true,
        },
        {
          name: 'postalCode',
          type: 'text',
          required: true,
        },
        {
          name: 'country',
          type: 'text',
          required: true,
        },
        {
          name: 'phone',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'billingAddress',
      type: 'group',
      fields: [
        {
          name: 'sameAsShipping',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'fullName',
          type: 'text',
          admin: {
            condition: (data, siblingData) => !siblingData?.sameAsShipping,
          },
        },
        {
          name: 'addressLine1',
          type: 'text',
          admin: {
            condition: (data, siblingData) => !siblingData?.sameAsShipping,
          },
        },
        {
          name: 'addressLine2',
          type: 'text',
          admin: {
            condition: (data, siblingData) => !siblingData?.sameAsShipping,
          },
        },
        {
          name: 'city',
          type: 'text',
          admin: {
            condition: (data, siblingData) => !siblingData?.sameAsShipping,
          },
        },
        {
          name: 'state',
          type: 'text',
          admin: {
            condition: (data, siblingData) => !siblingData?.sameAsShipping,
          },
        },
        {
          name: 'postalCode',
          type: 'text',
          admin: {
            condition: (data, siblingData) => !siblingData?.sameAsShipping,
          },
        },
        {
          name: 'country',
          type: 'text',
          admin: {
            condition: (data, siblingData) => !siblingData?.sameAsShipping,
          },
        },
        {
          name: 'phone',
          type: 'text',
          admin: {
            condition: (data, siblingData) => !siblingData?.sameAsShipping,
          },
        },
      ],
    },
    {
      name: 'paymentMethod',
      type: 'select',
      required: true,
      options: [
        { label: 'Credit Card', value: 'credit-card' },
        { label: 'Bank Transfer', value: 'bank-transfer' },
        { label: 'Cash on Delivery', value: 'cash-on-delivery' },
      ],
    },
    {
      name: 'paymentStatus',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Processing', value: 'processing' },
        { label: 'Completed', value: 'completed' },
        { label: 'Failed', value: 'failed' },
        { label: 'Refunded', value: 'refunded' },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
    },
  ],
  hooks: {
    beforeChange: [
      // Generate unique order number if not provided
      ({ data }) => {
        if (!data.orderNumber) {
          data.orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`
        }
        return data
      },
    ],
  },
}

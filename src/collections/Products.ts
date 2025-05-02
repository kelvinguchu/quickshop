import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'price', 'status'],
    listSearchableFields: ['name', 'description', 'sku'],
  },
  access: {
    read: () => true, // Everyone can read products
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      hasMany: false,
    },
    {
      name: 'subcategory',
      type: 'relationship',
      relationTo: 'subcategories',
      required: true,
      hasMany: false,
      admin: {
        condition: (data) => Boolean(data?.category),
        description: 'Select a subcategory that belongs to the selected main category',
      },
      // Filter subcategories based on the selected category
      filterOptions: ({ data }) => {
        if (!data?.category) return {}
        return {
          category: { equals: data.category },
        }
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Draft', value: 'draft' },
        { label: 'Out of Stock', value: 'out-of-stock' },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Featured Product',
      defaultValue: false,
    },
    {
      name: 'trending',
      type: 'checkbox',
      label: 'Trending Product',
      defaultValue: false,
    },
    {
      name: 'sku',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'mainImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    // Product Color Variations
    {
      name: 'colorVariations',
      type: 'array',
      label: 'Color Variations',
      minRows: 1,
      fields: [
        {
          name: 'color',
          type: 'text',
          required: true,
        },
        {
          name: 'colorCode',
          type: 'text', // Hex code or color name
          required: true,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'additionalImages',
          type: 'array',
          label: 'Additional Images',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
          ],
        },
      ],
    },
    // Size Variations
    {
      name: 'sizeVariations',
      type: 'array',
      label: 'Size Variations',
      minRows: 1,
      fields: [
        {
          name: 'size',
          type: 'select',
          required: true,
          options: [
            { label: 'S', value: 'S' },
            { label: 'M', value: 'M' },
            { label: 'L', value: 'L' },
            { label: 'XL', value: 'XL' },
            { label: 'XXL', value: 'XXL' },
          ],
        },
        {
          name: 'measurements',
          type: 'group',
          fields: [
            {
              name: 'chest',
              type: 'number',
              label: 'Chest (cm)',
              required: true,
            },
            {
              name: 'shoulder',
              type: 'number',
              label: 'Shoulder (cm)',
              required: true,
            },
            {
              name: 'sleeve',
              type: 'number',
              label: 'Sleeve Length (cm)',
              required: true,
            },
            {
              name: 'length',
              type: 'number',
              label: 'Total Length (cm)',
              required: true,
            },
            {
              name: 'waist',
              type: 'number',
              label: 'Waist (cm)',
              admin: {
                description: 'Required for specific product types like abaya',
              },
            },
            {
              name: 'hip',
              type: 'number',
              label: 'Hip (cm)',
              admin: {
                description: 'Required for specific product types like abaya',
              },
            },
          ],
        },
        {
          name: 'inStock',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
    // Height Ranges
    {
      name: 'heightRanges',
      type: 'array',
      label: 'Height Ranges (cm)',
      minRows: 1,
      fields: [
        {
          name: 'min',
          type: 'number',
          required: true,
        },
        {
          name: 'max',
          type: 'number',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: {
            description: 'E.g., "Short", "Regular", "Tall"',
          },
        },
      ],
    },
    // Custom Measurement Options
    {
      name: 'allowCustomMeasurements',
      type: 'checkbox',
      defaultValue: true,
      label: 'Allow Custom Measurements',
    },
    {
      name: 'customMeasurementFields',
      type: 'array',
      label: 'Custom Measurement Fields',
      admin: {
        condition: (data) => data?.allowCustomMeasurements,
      },
      fields: [
        {
          name: 'fieldName',
          type: 'text',
          required: true,
        },
        {
          name: 'unit',
          type: 'select',
          required: true,
          defaultValue: 'cm',
          options: [
            { label: 'Centimeters (cm)', value: 'cm' },
            { label: 'Inches (in)', value: 'in' },
          ],
        },
        {
          name: 'required',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
    // Additional Product Metadata
    {
      name: 'metadata',
      type: 'group',
      fields: [
        {
          name: 'material',
          type: 'text',
        },
        {
          name: 'careInstructions',
          type: 'textarea',
        },
        {
          name: 'tags',
          type: 'array',
          fields: [
            {
              name: 'tag',
              type: 'text',
            },
          ],
        },
      ],
    },
  ],
}

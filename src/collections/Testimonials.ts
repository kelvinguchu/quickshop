import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'customerName',
    defaultColumns: ['customerName', 'rating', 'active', 'createdAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'customerName',
      type: 'text',
      required: true,
    },
    {
      name: 'customerImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'rating',
      type: 'select',
      required: true,
      options: [
        { label: '5 Stars', value: '5' },
        { label: '4 Stars', value: '4' },
        { label: '3 Stars', value: '3' },
        { label: '2 Stars', value: '2' },
        { label: '1 Star', value: '1' },
      ],
    },
    {
      name: 'text',
      type: 'textarea',
      required: true,
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      label: 'Display on Website',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Feature on Homepage',
    },
  ],
}

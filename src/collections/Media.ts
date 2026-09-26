import type { CollectionConfig } from 'payload'
import { revalidateCatalogAfterChange, revalidateCatalogAfterDelete } from '@/hooks/revalidateCatalog'

export const Media: CollectionConfig = {
  slug: 'media',
  hooks: {
    afterChange: [revalidateCatalogAfterChange],
    afterDelete: [revalidateCatalogAfterDelete],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}

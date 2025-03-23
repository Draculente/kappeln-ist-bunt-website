import type { CollectionConfig } from 'payload'

export const newsletter: CollectionConfig = {
  slug: 'newsletter',
  admin: {
    useAsTitle: 'issue',
  },
  fields: [
    {
      name: 'issue',
      label: 'Issue',
      type: 'number',
      required: true,
      unique: true,
    },
    {
      name: 'date',
      label: 'Date',
      type: 'date',
      required: true,
    },
    {
      name: 'preface',
      label: 'Preface',
      type: 'richText',
      required: true,
    },
    {
      name: 'articles',
      label: 'Articles',
      type: 'array',
      labels: {
        singular: 'Article',
        plural: 'Articles',
      },
      fields: [
        {
          name: 'title',
          label: 'Title',
          type: 'text',
          required: true,
        },
        {
          name: 'body',
          label: 'Body',
          type: 'richText',
          required: true,
        },
        {
          name: 'image',
          label: 'Image',
          type: 'upload',
          relationTo: 'media',
          required: false,
        },
        {
          name: 'link',
          label: 'Link',
          type: 'text',
          required: false,
        },
      ],
    },
  ],
}

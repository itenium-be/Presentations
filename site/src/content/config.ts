import { defineCollection, z } from 'astro:content'

const creators = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    order: z.number(),
    tags: z.array(z.string()).default([]),
    live: z.object({
      deck: z.enum(['showcase', 'rosetta']),
      slide: z.string(),
    }).optional(),
  }),
})

export const collections = { creators }

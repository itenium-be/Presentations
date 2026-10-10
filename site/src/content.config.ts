import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const creators = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/creators' }),
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

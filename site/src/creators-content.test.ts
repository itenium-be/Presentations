import { describe, expect, test } from 'bun:test'
import { readdirSync, readFileSync, existsSync } from 'fs'
import { resolve, join, basename } from 'path'
import matter from 'gray-matter'
import { SECTIONS } from './creators'

const root = resolve(import.meta.dir, '../..')
const contentDir = resolve(import.meta.dir, 'content/creators')

const docs = SECTIONS.flatMap(section =>
  readdirSync(join(contentDir, section)).map(file => ({
    id: `${section}/${file}`,
    data: matter(readFileSync(join(contentDir, section, file), 'utf-8')).data,
  })),
)

function routeAliases(deck: string): string[] {
  const deckDir = join(root, 'talks', deck)
  const files = readdirSync(deckDir, { recursive: true }).map(String).filter(f => f.endsWith('.md'))
  return files.flatMap(f => [...readFileSync(join(deckDir, f), 'utf-8').matchAll(/^routeAlias:\s*(\S+)/gm)].map(m => m[1]))
}

describe('creators docs', () => {
  test('every theme layout is documented', () => {
    const layouts = readdirSync(join(root, 'layouts')).map(f => basename(f, '.vue'))
    const missing = layouts.filter(l => !existsSync(join(contentDir, 'layouts', `${l}.md`)))
    expect(missing).toEqual([])
  })

  test('every live link points at an existing routeAlias', () => {
    const broken = docs
      .filter(d => d.data.live)
      .filter(d => !routeAliases(d.data.live.deck).includes(d.data.live.slide))
      .map(d => `${d.id} → ${d.data.live.deck}/${d.data.live.slide}`)
    expect(broken).toEqual([])
  })

  test('every layout doc has a live slide', () => {
    expect(docs.filter(d => d.id.startsWith('layouts/') && !d.data.live).map(d => d.id)).toEqual([])
  })
})

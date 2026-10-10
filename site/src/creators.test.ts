import { describe, expect, test } from 'bun:test'
import { liveSlideUrl, deckUrl, groupBySection } from './creators'

describe('liveSlideUrl', () => {
  test('dev points at the deck\'s local slidev server', () => {
    expect(liveSlideUrl({ deck: 'showcase', slide: 'cover' }, true)).toBe('http://localhost:3030/cover')
    expect(liveSlideUrl({ deck: 'rosetta', slide: 'csharp' }, true)).toBe('http://localhost:3031/csharp')
  })

  test('prod points at the published deck under creators', () => {
    expect(liveSlideUrl({ deck: 'showcase', slide: 'cover' }, false)).toBe('/Presentations/creators/showcase/cover')
  })
})

describe('deckUrl', () => {
  test('dev and prod deck roots', () => {
    expect(deckUrl('rosetta', true)).toBe('http://localhost:3031/')
    expect(deckUrl('rosetta', false)).toBe('/Presentations/creators/rosetta/')
  })
})

describe('groupBySection', () => {
  test('groups by folder and sorts on order', () => {
    const entries = [
      { id: 'layouts/default', data: { order: 2 } },
      { id: 'start/new-talk', data: { order: 1 } },
      { id: 'layouts/cover', data: { order: 1 } },
    ]
    const grouped = groupBySection(entries)
    expect(grouped.start.map(e => e.id)).toEqual(['start/new-talk'])
    expect(grouped.layouts.map(e => e.id)).toEqual(['layouts/cover', 'layouts/default'])
    expect(grouped.recipes).toEqual([])
  })
})

// Ports must match scripts/dev-creators.ts
export const DECK_PORTS = { showcase: 3030, rosetta: 3031 } as const

export type Deck = keyof typeof DECK_PORTS
export interface LiveSlide { deck: Deck; slide: string }

export const SECTIONS = ['start', 'layouts', 'recipes'] as const
export type Section = typeof SECTIONS[number]

export function deckUrl(deck: Deck, dev: boolean): string {
  return dev ? `http://localhost:${DECK_PORTS[deck]}/` : `/Presentations/creators/${deck}/`
}

export function liveSlideUrl({ deck, slide }: LiveSlide, dev: boolean): string {
  return deckUrl(deck, dev) + slide
}

export function groupBySection<T extends { id: string; data: { order: number } }>(entries: T[]): Record<Section, T[]> {
  const grouped = Object.fromEntries(SECTIONS.map(s => [s, [] as T[]])) as Record<Section, T[]>
  for (const entry of entries) grouped[entry.id.split('/')[0] as Section].push(entry)
  for (const s of SECTIONS) grouped[s].sort((a, b) => a.data.order - b.data.order)
  return grouped
}

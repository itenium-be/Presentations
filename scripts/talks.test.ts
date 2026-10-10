import { describe, expect, test } from 'bun:test'
import { resolveTalk, SPA_NOT_FOUND_JS, SPA_RESTORE_JS, SPA_ROOT } from './talks'

describe('SPA_ROOT', () => {
  test('talk deep link resolves to the talk root', () => {
    expect('/Presentations/git-worktrees/5'.match(SPA_ROOT)?.[0]).toBe('/Presentations/git-worktrees/')
  })

  test('creators deck deep link resolves to the deck root', () => {
    expect('/Presentations/creators/showcase/cover'.match(SPA_ROOT)?.[0]).toBe('/Presentations/creators/showcase/')
  })

  test('presenter deep link resolves to the talk root', () => {
    expect('/Presentations/git-worktrees/presenter/5'.match(SPA_ROOT)?.[0]).toBe('/Presentations/git-worktrees/')
  })
})

describe('resolveTalk', () => {
  test('repo without entry is the slides.md talk named after the repo', () => {
    expect(resolveTalk({ repo: 'itenium-be/git-worktrees', published: true })).toEqual({
      repo: 'itenium-be/git-worktrees',
      published: true,
      repoName: 'git-worktrees',
      slug: 'git-worktrees',
      entry: 'slides.md',
      distDir: 'dist',
      cover: 'cover-art',
      pptx: 'git-worktrees.pptx',
      elevatorPitch: 'ElevatorPitch.md',
    })
  })

  test('entry is a separate talk in the same repo, named after the entry file', () => {
    expect(resolveTalk({ repo: 'itenium-be/git-worktrees', entry: 'dark-factory.md', published: true })).toEqual({
      repo: 'itenium-be/git-worktrees',
      published: true,
      repoName: 'git-worktrees',
      slug: 'dark-factory',
      entry: 'dark-factory.md',
      distDir: 'dist-dark-factory',
      cover: 'cover-art-dark-factory',
      pptx: 'dark-factory.pptx',
      elevatorPitch: 'ElevatorPitch-dark-factory.md',
    })
  })
})

describe('SPA redirect', () => {
  function fakeLocation(href: string) {
    const url = new URL(href)
    return { href: url.href, pathname: url.pathname, search: url.search, hash: url.hash, replaced: '', replace(u: string) { this.replaced = u } }
  }

  function roundTrip(deepLink: string): string {
    const notFound = fakeLocation(deepLink)
    new Function('location', SPA_NOT_FOUND_JS)(notFound)
    const deckRoot = fakeLocation(new URL(notFound.replaced, deepLink).href)
    let restored = deckRoot.pathname + deckRoot.search + deckRoot.hash
    new Function('location', 'history', SPA_RESTORE_JS)(deckRoot, { replaceState: (_s: unknown, _t: unknown, u: string) => { restored = u } })
    return restored
  }

  test('deep link survives the 404 round trip', () => {
    expect(roundTrip('https://x.be/Presentations/creators/showcase/conf-intro?embedded=true')).toBe('/Presentations/creators/showcase/conf-intro?embedded=true')
  })

  test('concurrent deep links each restore their own slide', () => {
    expect(['cover', 'conf-intro', 'quote'].map(s => roundTrip(`https://x.be/Presentations/creators/showcase/${s}`)))
      .toEqual(['/Presentations/creators/showcase/cover', '/Presentations/creators/showcase/conf-intro', '/Presentations/creators/showcase/quote'])
  })
})

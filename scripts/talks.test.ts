import { describe, expect, test } from 'bun:test'
import { resolveTalk, SPA_ROOT } from './talks'

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

import { describe, expect, test } from 'bun:test'
import { resolveTalk } from './talks'

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

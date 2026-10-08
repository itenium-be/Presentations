import { basename } from 'path'

export interface TalkYaml {
  repo: string
  published: boolean
  /** Extra deck in the repo's presentation/ folder; omitted means slides.md */
  entry?: string
}

export function resolveTalk(talk: TalkYaml) {
  const repoName = talk.repo.split('/').pop()!
  const slug = talk.entry ? basename(talk.entry, '.md') : repoName
  return {
    ...talk,
    repoName,
    slug,
    entry: talk.entry ?? 'slides.md',
    distDir: talk.entry ? `dist-${slug}` : 'dist',
    cover: talk.entry ? `cover-art-${slug}` : 'cover-art',
    pptx: `${slug}.pptx`,
    elevatorPitch: talk.entry ? `ElevatorPitch-${slug}.md` : 'ElevatorPitch.md',
  }
}

export type Talk = ReturnType<typeof resolveTalk>

import { basename } from 'path'

export interface TalkYaml {
  repo: string
  published: boolean
  /** Extra deck in the repo's presentation/ folder; omitted means slides.md */
  entry?: string
}

/** Deck root a deep link belongs to, for the GitHub Pages 404 SPA redirect */
export const SPA_ROOT = /^\/Presentations\/(?:creators\/)?[^/]+\//

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

// The path travels in the query, not sessionStorage: the creators page embeds many deep-linked
// iframes that share one sessionStorage and would race for a single slot.
export const SPA_NOT_FOUND_JS = `var m = location.pathname.match(${SPA_ROOT});
if (m) location.replace(m[0] + '?redirect=' + encodeURIComponent(location.pathname + location.search + location.hash));`

export const SPA_RESTORE_JS = `var r = new URLSearchParams(location.search).get('redirect');
if (r) history.replaceState(null, null, r);`

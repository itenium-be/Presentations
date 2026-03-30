import { defineMonacoSetup } from '@slidev/types'

export default defineMonacoSetup(() => {
  return {
    fontFamily: "'Fira Code', 'IBM Plex Mono', monospace",
    fontLigatures: true,
    fontSize: 16,
    'editor.fontLigatures': true,
    theme: 'vs',
  }
})

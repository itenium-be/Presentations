import { defineMonacoSetup } from '@slidev/types'

export default defineMonacoSetup(() => {
  return {
    fontFamily: "'Fira Code'",
    fontLigatures: true,
    fontSize: 16,
    'editor.fontLigatures': true,
  }
})

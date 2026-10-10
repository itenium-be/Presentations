import { mkdirSync, cpSync } from 'fs'
import { join } from 'path'

/** Theme fonts + assets the Astro site serves from site/public (gitignored there) */
export function copySiteAssets(root: string) {
  const sitePublic = join(root, 'site', 'public')
  mkdirSync(join(sitePublic, 'fonts'), { recursive: true })
  for (const f of ['rubik-400', 'rubik-500', 'rubik-700', 'inter-400', 'inter-600', 'ibm-plex-mono-400']) {
    cpSync(join(root, 'assets', 'fonts', `${f}.woff2`), join(sitePublic, 'fonts', `${f}.woff2`))
  }
  cpSync(join(root, 'assets', 'dots-orange.png'), join(sitePublic, 'dots-orange.png'))
  cpSync(join(root, 'assets', 'logo-itenium.svg'), join(sitePublic, 'logo-itenium.svg'))
}

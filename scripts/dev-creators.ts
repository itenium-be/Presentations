#!/usr/bin/env bun
import { join } from 'path'
import { DECK_PORTS } from '../site/src/creators'
import { copySiteAssets } from './site-assets'

const root = join(import.meta.dir, '..')
copySiteAssets(root)

// Windows drives under WSL send no inotify events, so the watchers would never see an edit
const env = root.startsWith('/mnt/') ? { ...process.env, CHOKIDAR_USEPOLLING: '1' } : process.env

const procs = [
  Bun.spawn(['bunx', 'astro', 'dev'], { cwd: join(root, 'site'), stdio: ['ignore', 'inherit', 'inherit'], env }),
  ...Object.entries(DECK_PORTS).map(([deck, port]) =>
    Bun.spawn(['bunx', 'slidev', `talks/${deck}/slides.md`, '--port', String(port)], { cwd: root, stdio: ['ignore', 'inherit', 'inherit'], env }),
  ),
]

console.log('\nDocs: http://localhost:4321/Presentations/creators/\n')

const stop = () => { procs.forEach(p => p.kill()); process.exit() }
process.on('SIGINT', stop)
process.on('SIGTERM', stop)
await Promise.race(procs.map(p => p.exited))
stop()

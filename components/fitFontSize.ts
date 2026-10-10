const STEP = 0.05
const MIN = 0.5

export function fitFontSize(start: number, fits: (size: number) => boolean): number {
  let size = start
  while (size > MIN && !fits(size)) size = Math.max(MIN, Math.round((size - STEP) * 100) / 100)
  return size
}

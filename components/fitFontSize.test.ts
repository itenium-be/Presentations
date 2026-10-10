import { describe, expect, test } from 'bun:test'
import { fitFontSize } from './fitFontSize'

describe('fitFontSize', () => {
  test('keeps the starting size when it already fits', () => {
    expect(fitFontSize(1.4, () => true)).toBe(1.4)
  })

  test('shrinks until it fits', () => {
    expect(fitFontSize(1, size => size <= 0.8)).toBeCloseTo(0.8)
  })

  test('stops at the minimum when nothing fits', () => {
    expect(fitFontSize(1, () => false)).toBe(0.5)
  })
})

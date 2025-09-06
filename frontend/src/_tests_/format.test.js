import { describe, it, expect } from 'vitest'
import { fmtPct } from '../utils/format'

describe('format helpers', () => {
  it('fmtPct', () => {
    expect(fmtPct(12.345)).toBe('12.3%')
  })
})

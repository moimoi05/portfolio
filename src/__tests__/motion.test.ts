import { describe, expect, it } from 'vitest'
import { getMagnetOffset, getMarqueeOffset } from '../lib/motion'

describe('getMagnetOffset', () => {
  const bounds = { left: 100, top: 200, width: 200, height: 300, padding: 150, strength: 3 }

  it('keeps the portrait centered when the pointer is at its center', () => {
    expect(getMagnetOffset({ ...bounds, x: 200, y: 350 })).toEqual({ x: 0, y: 0, active: true })
  })

  it('scales pointer distance by the configured magnetic strength', () => {
    expect(getMagnetOffset({ ...bounds, x: 260, y: 260 })).toEqual({ x: 20, y: -30, active: true })
  })

  it('activates within padding beyond the portrait edge', () => {
    expect(getMagnetOffset({ ...bounds, x: 400, y: 350 })).toEqual({ x: 200 / 3, y: 0, active: true })
  })

  it.each([0, -3])('disables the effect for invalid strength %i', (strength) => {
    expect(getMagnetOffset({ ...bounds, strength, x: 260, y: 260 })).toEqual({ x: 0, y: 0, active: false })
  })

  it.each([
    { x: -51, y: 350 },
    { x: 451, y: 350 },
    { x: 200, y: 49 },
    { x: 200, y: 651 },
  ])('resets the portrait outside the activation area (%j)', (pointer) => {
    expect(getMagnetOffset({ ...bounds, ...pointer })).toEqual({ x: 0, y: 0, active: false })
  })
})

describe('getMarqueeOffset', () => {
  it('starts at zero when the section reaches the viewport bottom', () => {
    expect(getMarqueeOffset(200, 1000, 800)).toBe(0)
  })

  it('moves thirty pixels per hundred pixels of page scroll', () => {
    expect(getMarqueeOffset(300, 1000, 800) - getMarqueeOffset(200, 1000, 800)).toBe(30)
  })

  it('accounts for section position and viewport height', () => {
    expect(getMarqueeOffset(500, 900, 1000)).toBe(180)
  })
})

import { describe, it, expect } from 'vitest';
import { findSweep } from '../src/sweep.js';
import type { Candle, SwingPoint } from '../src/types.js';

function c(o: number, h: number, l: number, cl: number, i: number): Candle {
  return { openTimeMs: i * 15 * 60 * 1000, open: o, high: h, low: l, close: cl };
}

const highSwing: SwingPoint = { kind: 'HIGH', price: 1.1000, candleIndex: 0, openTimeMs: 0, respected: true };
const lowSwing: SwingPoint = { kind: 'LOW', price: 1.0900, candleIndex: 0, openTimeMs: 0, respected: true };

describe('findSweep', () => {
  it('detects a HIGH sweep: wick above, close back below', () => {
    const candles = [c(1.098, 1.099, 1.097, 1.098, 0), c(1.099, 1.1015, 1.098, 1.0995, 1)];
    const event = findSweep(candles, highSwing, 0);
    expect(event).not.toBeNull();
    expect(event?.sweepCandleIndex).toBe(1);
    expect(event?.sweepExtreme).toBeCloseTo(1.1015);
  });

  it('returns null when price closes cleanly through the HIGH (real breakout, not a sweep)', () => {
    const candles = [c(1.099, 1.1015, 1.098, 1.101, 0)];
    expect(findSweep(candles, highSwing, 0)).toBeNull();
  });

  it('detects a LOW sweep: wick below, close back above', () => {
    const candles = [c(1.091, 1.092, 1.0885, 1.0905, 0)];
    const event = findSweep(candles, lowSwing, 0);
    expect(event).not.toBeNull();
    expect(event?.sweepExtreme).toBeCloseTo(1.0885);
  });
});

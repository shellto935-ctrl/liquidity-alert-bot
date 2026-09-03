import { describe, it, expect } from 'vitest';
import { findReaction } from '../src/reaction.js';
import type { Candle } from '../src/types.js';

function c(o: number, h: number, l: number, cl: number, i: number): Candle {
  return { openTimeMs: i * 15 * 60 * 1000, open: o, high: h, low: l, close: cl };
}

describe('findReaction', () => {
  it('finds a bullish pin bar within the window (UP reaction)', () => {
    const candles = [
      c(1.090, 1.0905, 1.0898, 1.0902, 0), // sweep candle: NOT a pin bar itself (small, balanced wicks)
      { openTimeMs: 1, open: 1.0910, high: 1.0915, low: 1.0870, close: 1.0912 } // long lower wick, small body -> bullish pin bar
    ];
    const idx = findReaction(candles, 0, 'UP', 3);
    expect(idx).toBe(1);
  });

  it('finds a bearish engulfing candle (DOWN reaction)', () => {
    const candles = [
      { openTimeMs: 0, open: 1.0990, high: 1.0997, low: 1.0988, close: 1.0995 }, // small bullish sweep candle, not a pin bar
      { openTimeMs: 1, open: 1.0996, high: 1.1000, low: 1.0970, close: 1.0975 } // bearish candle engulfing the prior body
    ];
    const idx = findReaction(candles, 0, 'DOWN', 3);
    expect(idx).toBe(1);
  });

  it('returns null when no reaction forms in the window', () => {
    const candles = [c(1.09, 1.091, 1.089, 1.0902, 0), c(1.0902, 1.0906, 1.0898, 1.0901, 1), c(1.0901, 1.0905, 1.0897, 1.09, 2)];
    expect(findReaction(candles, 0, 'UP', 2)).toBeNull();
  });
});

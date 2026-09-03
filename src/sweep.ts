import type { Candle, SwingPoint, SweepEvent } from './types.js';

/**
 * A sweep is: price wicks beyond a resting swing level (taking the liquidity)
 * but the candle CLOSES back on the near side — i.e. it's a stop-hunt, not a
 * genuine breakout/close-through. This matches the video's "high taken but
 * the move is a trap" framing.
 */
export function findSweep(entryCandles: Candle[], swing: SwingPoint, fromIndex: number): SweepEvent | null {
  for (let i = fromIndex; i < entryCandles.length; i++) {
    const c = entryCandles[i];
    if (swing.kind === 'HIGH') {
      const wicked = c.high > swing.price;
      const closedBack = c.close < swing.price;
      if (wicked && closedBack) {
        return { swing, sweepCandleIndex: i, sweepExtreme: c.high };
      }
      // A clean close-through invalidates this as a sweep target (real breakout, not a trap).
      if (c.close > swing.price) return null;
    } else {
      const wicked = c.low < swing.price;
      const closedBack = c.close > swing.price;
      if (wicked && closedBack) {
        return { swing, sweepCandleIndex: i, sweepExtreme: c.low };
      }
      if (c.close < swing.price) return null;
    }
  }
  return null;
}

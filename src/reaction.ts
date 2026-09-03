import type { Candle, Direction } from './types.js';

function isBullishEngulfing(prev: Candle, cur: Candle): boolean {
  return cur.close > cur.open && prev.close < prev.open && cur.close >= prev.open && cur.open <= prev.close;
}
function isBearishEngulfing(prev: Candle, cur: Candle): boolean {
  return cur.close < cur.open && prev.close > prev.open && cur.close <= prev.open && cur.open >= prev.close;
}
function isBullishPinBar(c: Candle): boolean {
  const body = Math.abs(c.close - c.open);
  const lowerWick = Math.min(c.open, c.close) - c.low;
  const range = c.high - c.low;
  return range > 0 && lowerWick >= body * 2 && lowerWick / range > 0.6;
}
function isBearishPinBar(c: Candle): boolean {
  const body = Math.abs(c.close - c.open);
  const upperWick = c.high - Math.max(c.open, c.close);
  const range = c.high - c.low;
  return range > 0 && upperWick >= body * 2 && upperWick / range > 0.6;
}

/**
 * Looks for a reversal reaction within `maxBars` candles after a sweep.
 * direction = 'UP' means we're looking for a BULLISH reaction (after a LOW
 * was swept); 'DOWN' means a BEARISH reaction (after a HIGH was swept).
 */
export function findReaction(
  candles: Candle[],
  sweepCandleIndex: number,
  direction: Direction,
  maxBars = 3
): number | null {
  for (let i = sweepCandleIndex; i < Math.min(candles.length, sweepCandleIndex + 1 + maxBars); i++) {
    const cur = candles[i];
    const prev = candles[i - 1];
    if (direction === 'UP') {
      if (isBullishPinBar(cur)) return i;
      if (prev && isBullishEngulfing(prev, cur)) return i;
    } else {
      if (isBearishPinBar(cur)) return i;
      if (prev && isBearishEngulfing(prev, cur)) return i;
    }
  }
  return null;
}

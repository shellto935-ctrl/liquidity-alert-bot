import type { Candle, SwingPoint } from './types.js';

/**
 * Detects structural swing highs/lows on the 4H (or any "structure")
 * timeframe using a simple N-bar fractal: a candle is a swing high if its
 * high is strictly greater than the high of `lookback` candles on each
 * side, and a swing low is the mirror case.
 *
 * This directly encodes the video's "high respected, price moves away"
 * idea: a fractal pivot only forms once price has moved away on both
 * sides, which is the same as saying the level was "respected".
 */
export function detectSwingPoints(candles: Candle[], lookback = 3): SwingPoint[] {
  const points: SwingPoint[] = [];
  for (let i = lookback; i < candles.length - lookback; i++) {
    const window = candles.slice(i - lookback, i + lookback + 1);
    const c = candles[i];

    const isHigh = window.every((w) => w.high <= c.high) && window.some((w) => w !== c && w.high < c.high);
    if (isHigh) {
      points.push({ kind: 'HIGH', price: c.high, candleIndex: i, openTimeMs: c.openTimeMs, respected: true });
      continue;
    }

    const isLow = window.every((w) => w.low >= c.low) && window.some((w) => w !== c && w.low > c.low);
    if (isLow) {
      points.push({ kind: 'LOW', price: c.low, candleIndex: i, openTimeMs: c.openTimeMs, respected: true });
    }
  }
  return points;
}

/** Unswept swing points still holding resting liquidity, most recent first. */
export function unsweptSwings(points: SwingPoint[], sweptOpenTimesMs: Set<number>): SwingPoint[] {
  return points.filter((p) => !sweptOpenTimesMs.has(p.openTimeMs)).slice().reverse();
}

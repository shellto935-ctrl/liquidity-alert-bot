import type { Candle } from '../types.js';

export type Interval = '15min' | '4h';

interface TDResponse {
  status: string;
  message?: string;
  values?: { datetime: string; open: string; high: string; low: string; close: string }[];
}

/**
 * Fetches candles from Twelve Data, oldest-first. `outputsize` maps
 * directly to Twelve Data's own parameter (max ~5000 on the free plan),
 * so callers should keep requested history within that bound or add
 * pagination (not implemented yet — see README).
 */
export async function fetchCandles(
  apiKey: string,
  symbol: string,
  interval: Interval,
  outputsize: number
): Promise<Candle[]> {
  const url = new URL('https://api.twelvedata.com/time_series');
  url.searchParams.set('symbol', symbol);
  url.searchParams.set('interval', interval);
  url.searchParams.set('outputsize', String(outputsize));
  url.searchParams.set('apikey', apiKey);
  url.searchParams.set('order', 'ASC');
  url.searchParams.set('timezone', 'UTC');

  const res = await fetch(url.toString());
  const data = (await res.json()) as TDResponse;

  if (data.status === 'error') {
    throw new Error(`Twelve Data error for ${symbol} ${interval}: ${data.message}`);
  }
  if (!data.values) return [];

  return data.values.map((v) => ({
    openTimeMs: Date.parse(v.datetime + 'Z'),
    open: Number(v.open),
    high: Number(v.high),
    low: Number(v.low),
    close: Number(v.close)
  }));
}

/** Simple delay helper to stay under the free-tier 8-calls/minute limit. */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

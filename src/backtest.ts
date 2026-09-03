import { config } from './config.js';
import { fetchCandles, sleep } from './market/twelvedata.js';
import { runLiquidityStrategy } from './strategy.js';
import type { LiquiditySignal } from './types.js';

const SYMBOLS = ['EUR/USD', 'GBP/USD'];

/**
 * CAVEAT (logged below too, not hidden): this harvests signals from a
 * FULL historical window at once, so 4H structure points are detected
 * using the complete series rather than only data available "as of" each
 * signal's timestamp. That gives structure detection a slight look-ahead
 * advantage the live poller won't have. Treat these counts as an
 * optimistic upper bound on real-world frequency, not a guarantee.
 */
async function backtestSymbol(symbol: string): Promise<LiquiditySignal[]> {
  const tdSymbol = symbol; // Twelve Data accepts "EUR/USD" directly
  const structureCandles = await fetchCandles(config.TWELVEDATA_API_KEY, tdSymbol, '4h', config.BACKTEST_DAYS * 6 + 20);
  await sleep(8000); // stay under 8 calls/min free-tier limit
  const entryCandles = await fetchCandles(config.TWELVEDATA_API_KEY, tdSymbol, '15min', Math.min(config.BACKTEST_DAYS * 96 + 20, 5000));
  await sleep(8000);

  const signals: LiquiditySignal[] = [];
  const swept = new Set<number>();

  while (true) {
    const signal = runLiquidityStrategy({
      symbol,
      structureCandles,
      entryCandles,
      alreadySweptOpenTimesMs: swept,
      nowMs: Date.now()
    });
    if (!signal) break;
    signals.push(signal);
    swept.add(signal.sweptSwing.openTimeMs);
  }
  return signals;
}

export async function runBacktest(): Promise<void> {
  console.log(`[backtest] starting, window=${config.BACKTEST_DAYS} days, symbols=${SYMBOLS.join(',')}`);
  const report: Record<string, { count: number; perDay: string; sample: LiquiditySignal[] }> = {};

  for (const symbol of SYMBOLS) {
    try {
      const signals = await backtestSymbol(symbol);
      report[symbol] = {
        count: signals.length,
        perDay: (signals.length / config.BACKTEST_DAYS).toFixed(2),
        sample: signals.slice(-3)
      };
    } catch (err) {
      console.error(`[backtest] failed for ${symbol}:`, err);
      report[symbol] = { count: -1, perDay: 'ERROR', sample: [] };
    }
  }

  const totalCount = Object.values(report).reduce((sum, r) => sum + Math.max(r.count, 0), 0);
  const totalPerMonth = ((totalCount / config.BACKTEST_DAYS) * 30).toFixed(1);

  console.log('[backtest] CAVEAT: full-window structure detection has slight look-ahead bias vs the live poller — treat as an optimistic estimate.');
  console.log('[backtest] report:', JSON.stringify(report, null, 2));
  console.log(`[backtest] combined estimate: ~${totalPerMonth} signals/month across ${SYMBOLS.length} pairs (window=${config.BACKTEST_DAYS}d)`);
}

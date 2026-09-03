import { describe, it, expect } from 'vitest';
import { formatSignalMessage } from '../src/format.js';
import type { LiquiditySignal } from '../src/types.js';

const signal: LiquiditySignal = {
  type: 'ENTRY_READY',
  symbol: 'EUR/USD',
  direction: 'UP',
  entryPrice: 1.0860,
  stopLoss: 1.0828,
  takeProfit: 1.1000,
  sweptSwing: { kind: 'LOW', price: 1.085, candleIndex: 3, openTimeMs: 0, respected: true },
  reactionCandleIndex: 1,
  createdAtMs: Date.now()
};

describe('formatSignalMessage', () => {
  it('includes symbol, direction, entry, stop, and target price', () => {
    const msg = formatSignalMessage(signal);
    expect(msg).toContain('EUR/USD');
    expect(msg).toContain('BUY');
    expect(msg).toContain('1.08600');
    expect(msg).toContain('1.08280');
    expect(msg).toContain('1.10000');
    expect(msg).toContain('অটোমেটিক ট্রেড হয়নি');
  });
});

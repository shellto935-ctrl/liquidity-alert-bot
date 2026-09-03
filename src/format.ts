import type { LiquiditySignal } from './types.js';

function fmtPrice(p: number): string {
  return p.toFixed(5);
}

/**
 * Formats a LiquiditySignal into a Bengali Telegram alert message.
 * Mirrors the style of the original alert-only system's format.ts.
 */
export function formatSignalMessage(signal: LiquiditySignal): string {
  const dirBn = signal.direction === 'UP' ? 'BUY (উপরে যাওয়ার সম্ভাবনা)' : 'SELL (নিচে যাওয়ার সম্ভাবনা)';
  const sweptBn = signal.sweptSwing.kind === 'LOW' ? 'নিচের লেভেল (LOW)' : 'উপরের লেভেল (HIGH)';
  const riskDistance = Math.abs(signal.entryPrice - signal.stopLoss);
  const rewardDistance = Math.abs(signal.takeProfit - signal.entryPrice);
  const rr = riskDistance > 0 ? (rewardDistance / riskDistance).toFixed(2) : 'N/A';

  return [
    `🔔 *Liquidity Sweep Signal*`,
    ``,
    `📈 *পেয়ার:* ${signal.symbol}`,
    `🧭 *ডিরেকশন:* ${dirBn}`,
    `💧 *যা sweep হয়েছে:* ${sweptBn} (${fmtPrice(signal.sweptSwing.price)})`,
    ``,
    `🎯 *Entry:* ${fmtPrice(signal.entryPrice)}`,
    `🛑 *Stop-loss:* ${fmtPrice(signal.stopLoss)}`,
    `🏁 *Projected/Target price:* ${fmtPrice(signal.takeProfit)}`,
    `⚖️ *Risk:Reward:* 1:${rr}`,
    ``,
    `⚠️ এখনই চার্ট দেখুন! কোনো অটোমেটিক ট্রেড হয়নি — এটা শুধু একটা অ্যালার্ট।`
  ].join('\n');
}

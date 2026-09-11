# Building Your Own Strategy (instead of the default liquidity-sweep one)

This repo is split into two kinds of files:

**Infrastructure (usually don't touch these):**
- `config.ts` — env vars
- `market/twelvedata.ts` — candle fetching
- `telegram.ts` — sending messages/photos
- `chart.ts` — renders the candlestick chart image
- `ai-agent.ts` — sends the chart to Gemini for a review
- `poller.ts` — the loop that runs every 15 minutes
- `backtest.ts` — the one-shot historical frequency report
- `server.ts` — the entry point

**Strategy-specific (this is what defines the actual trading idea):**
- `types.ts` — the `Candle` and `LiquiditySignal` shapes
- `structure.ts`, `sweep.ts`, `reaction.ts`, `strategy.ts` — the actual liquidity-sweep-reversal logic

## How to swap in your own strategy idea

Give your AI assistant this repo's code plus a plain-language description of your strategy (entry rule, stop-loss rule, target rule — be as specific as you can: exact indicators, exact thresholds, exact timeframes). Ask it to:

1. Keep the output shape the same — anything that produces a signal must return an object with at least: `symbol`, `direction` ('UP'|'DOWN'), `entryPrice`, `stopLoss`, `takeProfit`. That's the only contract the rest of the system (chart, Telegram, AI review) depends on.
2. Replace the logic inside `structure.ts` / `sweep.ts` / `reaction.ts` / `strategy.ts` (or delete/rename them and write new files — the names aren't magic, only `poller.ts`'s import of a function that returns a signal-or-null matters).
3. Write unit tests for the new logic the same way the existing `test/*.test.ts` files do — synthetic candle arrays in, expected signal (or null) out. Run `npm test` before deploying.
4. Update `SYMBOLS` in `poller.ts` and `backtest.ts` if the new strategy needs different instruments or a different candle timeframe than 4H/15m (the `fetchCandles` interval parameter accepts Twelve Data's intervals: 1min, 5min, 15min, 30min, 45min, 1h, 2h, 4h, 1day, etc.)

## A ready-to-use prompt

> I want to replace this repo's trading strategy with my own idea:
> [DESCRIBE YOUR ENTRY RULE, STOP-LOSS RULE, AND TARGET RULE HERE — be specific: indicators, thresholds, timeframes].
>
> Keep everything else in the repo (Telegram sending, chart image, Gemini review, the 15-minute poller loop) working as-is. Only change the strategy-detection logic. The signal object your new logic returns must still have: symbol, direction ('UP' or 'DOWN'), entryPrice, stopLoss, takeProfit. Write unit tests for the new logic using synthetic candle data (no real API calls in tests), and show me the test output before you push anything.

## Honesty reminder
Nobody — not an AI assistant, not this repo, not its author — can tell you in advance whether a strategy will be profitable. A backtest only tells you how a rule set would have performed on past data. Always read `npm test` output and, ideally, run the backtest job (`BACKTEST_ENABLED=true`) before trusting any strategy with real decisions.

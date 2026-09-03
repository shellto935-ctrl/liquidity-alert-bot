# Liquidity-Sweep Alert Bot (Twelve Data + Telegram) — Ready to deploy

**Alert-only.** Reads Twelve Data candles (4H structure + 15m entry timeframe),
runs the liquidity-sweep-reversal strategy, sends a Bengali Telegram message
with pair, direction, entry, stop-loss, and projected/target price. There is
no order-placement code anywhere in this repo — it cannot trade for you.

## Status
- Core strategy logic: 12/12 tests passing (`structure`, `sweep`, `reaction`, `strategy`, `format`)
- Twelve Data client, Telegram sender, live poller, one-shot backtest job: written, NOT yet run against real data
- Not yet deployed

## How it works live
Every 15 minutes: fetch recent 4H + 15m candles for EUR/USD and GBP/USD →
run the strategy → if a fresh ENTRY_READY signal appears, send it to Telegram
(unless `DRY_RUN=true`, in which case it only logs).

## Backtest (run automatically on startup if enabled)
Set `BACKTEST_ENABLED=true` to have the server pull the last `BACKTEST_DAYS`
(default 45) of history once at startup and log a signals-per-day / per-month
estimate before starting the live poller. **Caveat, logged by the code
itself**: this harvests all signals from the full historical window at once,
giving structure detection a slight look-ahead advantage the live poller
won't have — treat the reported numbers as an optimistic upper bound, not a
guarantee.

## Required Railway environment variables
- `TWELVEDATA_API_KEY`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `DRY_RUN` — `true` while validating, `false` to actually send Telegram messages
- `BACKTEST_ENABLED` — `true` to run the one-shot backtest on this startup
- `BACKTEST_DAYS` — optional, default 45

## Deploy
1. Create a new GitHub repo, upload this folder's contents (or push via git).
2. In Railway: New Project → Deploy from GitHub repo → select it.
3. Set the environment variables above in the service's Variables tab.
4. Railway will run `npm ci && npm run build` then `npm start` (see `railway.json`).
5. Check the Deploy Logs for the `[backtest]` report if `BACKTEST_ENABLED=true`.

## Local dev
    npm install
    npm run check   # typecheck
    npm test        # 12 unit tests, no network needed
    npm run build && npm start   # needs real env vars to do anything live

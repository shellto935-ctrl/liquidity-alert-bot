# SignalKit — Free, self-hosted Telegram trading-alert bot (bring your own strategy)

**What this repo is, in one sentence:** code that watches market prices,
checks them against a trading strategy you can fully customize, and — when
a valid setup appears — sends you a Telegram message with a chart image and
an AI (Google Gemini, free tier) second-opinion review.

**What this repo is NOT:**
- Not auto-trading software. It never places an order anywhere, on any
  broker, ever. It only sends a Telegram message.
- Not tied to one specific strategy. It ships with one example strategy
  (a "liquidity sweep reversal" pattern) but is built so the strategy logic
  is a swappable module — see `CUSTOM_STRATEGY_GUIDE.md`.
- Not financial advice, and it does not guarantee profit or any win rate.

## The three documents in this repo, and when to read each

| File | Read this if... |
|---|---|
| `SETUP_GUIDE.md` | You just want to run the included example strategy as-is |
| `GPT_SETUP_PROMPT.md` | You want an AI assistant (ChatGPT, Claude, etc. — anything with GitHub + Railway access) to set the whole thing up for you automatically |
| `CUSTOM_STRATEGY_GUIDE.md` | You have your own trading idea and want to replace the example strategy with it |

## Required free accounts (all free-tier, no cost to start)
1. **GitHub** — github.com — holds the code
2. **Railway** — railway.com — runs the code 24/7 (free trial credit, then a
   few dollars/month to keep it running continuously — see Railway's own
   pricing page for current numbers)
3. **Twelve Data** — twelvedata.com — free market-data API key
4. **Telegram** — via the **@BotFather** bot inside Telegram — free bot + token
5. **Google Gemini** — https://aistudio.google.com/apikey — free-tier API key
   for the chart review step (sign in with any Google account, click
   "Create API key")

## Fastest path: let an AI assistant do it
Open `GPT_SETUP_PROMPT.md`, fill in the two blanks at the top (your GitHub
username and a name for your new repo), and paste the whole thing into an AI
assistant that has GitHub and Railway connected. It will copy this repo
under your account, deploy it, and walk you through adding your API keys.

## Manual path
See the numbered steps in `SETUP_GUIDE.md`.

## License / usage
Free to copy, modify, and redistribute for your own use. If you build
something with it, a credit/link back is appreciated but not required.

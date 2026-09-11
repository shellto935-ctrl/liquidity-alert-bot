# Liquidity-Sweep Forex/Gold Telegram Alert Bot — Free Self-Hosted Setup

**What this is:** A free, self-hosted bot that watches EUR/USD, GBP/USD, and Gold (XAU/USD), looks for a "liquidity sweep + reversal" pattern (a Smart-Money-Concepts / ICT style setup: price wicks past a prior swing high/low then closes back and reverses), and sends you a Telegram message with a chart image and an AI (Gemini) second-opinion review whenever one forms.

**What this is NOT:**
- Not auto-trading. It never places an order anywhere. It only sends a message.
- Not financial advice, and not a guaranteed-profitable strategy. In a 45-day backtest across 2 pairs it produced roughly 8–9 signals/month combined — a few per week, not multiple per day. Past signals do not guarantee future ones, and no win-rate claim is made here — you'd need to track your own results over time to know how it performs for you.
- Not affiliated with Twelve Data, Telegram, Google, GitHub, or Railway — you create your own free accounts with each.

## What you need (all free tiers)
1. A **GitHub** account (to hold the code)
2. A **Railway** account (to run the code 24/7) — free trial credit, then ~$5/month to keep it running continuously
3. A **Twelve Data** API key (free) — market data
4. A **Telegram bot** (free, via @BotFather) — where alerts arrive
5. A **Gemini API key** (free tier available) — for the chart review

## The easy way: give this to an AI assistant that can use GitHub + Railway

If you're using an AI assistant (like ChatGPT with GitHub/Railway connected, or Claude with the same), copy the prompt in `GPT_SETUP_PROMPT.md` in this repo, fill in the blanks at the top, and give it to your assistant. It will create the repo, deploy it to Railway, and wire up the variables for you.

## The manual way
1. Fork or copy this repo to your own GitHub account.
2. Get your API keys (steps below).
3. In Railway: New Project → Deploy from GitHub repo → select your fork.
4. In the service's Variables tab, set:
   - `TWELVEDATA_API_KEY`
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`
   - `GEMINI_API_KEY`
   - `AI_AGENT_ENABLED=true`
   - `DRY_RUN=true` at first (test mode — logs instead of sending), then `false` once you've confirmed it deploys cleanly
5. Watch the Deploy Logs. Once you see `liquidity-alert backend listening`, it's live.

### Getting each key
- **Twelve Data**: twelvedata.com → free signup → API key on your dashboard.
- **Telegram bot**: message **@BotFather** on Telegram → `/newbot` → follow the prompts → copy the token. For your chat ID, message your new bot once, then visit `https://api.telegram.org/bot<token>/getUpdates` and read the `chat.id` field in the response.
- **Gemini**: aistudio.google.com/apikey → sign in with a Google account → Create API key.

## Honesty / risk note
This project came out of coding up a publicly-explained liquidity/ICT concept, not a proprietary edge. Treat every signal as a starting point for your own chart review, not an instruction. Nobody — including the authors of this repo — can promise a win rate or guarantee profit from any strategy.

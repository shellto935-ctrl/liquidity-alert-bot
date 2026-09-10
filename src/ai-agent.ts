import { config } from './config.js';
import type { LiquiditySignal } from './types.js';

const PROMPT_PREFIX = `You are reviewing an automated forex "liquidity sweep reversal" trade alert before it is shown to a retail trader. You are given a candlestick chart image and the alert's computed levels. Look at the chart and:
1. Confirm or dispute whether the chart visually shows a genuine liquidity sweep (wick beyond a prior swing level, close back inside) followed by a real reversal reaction — not just noise.
2. Note anything concerning (e.g. the reaction candle looks weak, price is in a strong opposing trend, the target level looks too far/close).
3. Give a one-line verdict: LOOKS VALID, BORDERLINE, or LOOKS WEAK.
Keep your whole reply under 80 words. This is not financial advice and you are not placing any trade — you are only annotating an alert for a human to review themselves.`;

// Uses Google's Interactions API (the current recommended Gemini API as of
// mid-2026 — the older generateContent endpoint still works but this is
// what Google's own docs point new integrations to). See:
// https://ai.google.dev/gemini-api/docs/interactions-overview
// https://ai.google.dev/gemini-api/docs/image-understanding
export async function reviewSignalWithGemini(chartPng: Buffer, signal: LiquiditySignal): Promise<string> {
  const base64Image = chartPng.toString('base64');

  const signalSummary = `Symbol: ${signal.symbol}
Direction: ${signal.direction}
Swept level: ${signal.sweptSwing.kind} at ${signal.sweptSwing.price}
Entry: ${signal.entryPrice}
Stop-loss: ${signal.stopLoss}
Target: ${signal.takeProfit}`;

  const res = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': config.GEMINI_API_KEY
    },
    body: JSON.stringify({
      model: 'gemini-3.8-flash',
      input: [
        { type: 'text', text: PROMPT_PREFIX + '\n\n' + signalSummary },
        { type: 'image', data: base64Image, mime_type: 'image/png' }
      ]
    })
  });

  if (!res.ok) {
    throw new Error(`Gemini API failed: ${res.status} ${await res.text()}`);
  }
  const data = (await res.json()) as Record<string, unknown>;

  // Defensive parsing: the Interactions API's official SDKs expose a
  // convenience `output_text` field. We read it directly from the REST
  // response first; if Google's raw JSON shape differs from the SDK
  // convenience field, fall back to walking the `output` steps array
  // rather than crashing, and log the raw shape once so it can be fixed.
  if (typeof data.output_text === 'string') return data.output_text;

  const output = data.output as { content?: { type: string; text?: string }[] }[] | undefined;
  if (Array.isArray(output)) {
    for (const step of output) {
      const textPart = step.content?.find((c) => c.type === 'text')?.text;
      if (textPart) return textPart;
    }
  }

  console.error('[ai-agent] unrecognized Gemini response shape:', JSON.stringify(data).slice(0, 500));
  return '(Gemini did not return a recognizable text review)';
}

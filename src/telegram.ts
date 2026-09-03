import { config } from './config.js';

export async function sendTelegramMessage(text: string): Promise<void> {
  if (config.DRY_RUN) {
    console.log('[DRY_RUN] would send Telegram message:\n' + text);
    return;
  }
  const url = `https://api.telegram.org/bot${config.TELEGRAM_BOT_TOKEN}/sendMessage`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: config.TELEGRAM_CHAT_ID, text, parse_mode: 'Markdown' })
  });
  if (!res.ok) {
    console.error('Telegram send failed:', res.status, await res.text());
  }
}

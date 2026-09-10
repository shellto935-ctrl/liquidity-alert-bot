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

/** Sends a photo (e.g. the signal chart) with a caption. Falls back to a
 * plain text message if the photo send fails, so a chart problem never
 * silently swallows the alert itself. */
export async function sendTelegramPhoto(photoPng: Buffer, caption: string): Promise<void> {
  if (config.DRY_RUN) {
    console.log('[DRY_RUN] would send Telegram photo, caption:\n' + caption);
    return;
  }
  try {
    const url = `https://api.telegram.org/bot${config.TELEGRAM_BOT_TOKEN}/sendPhoto`;
    const form = new FormData();
    form.append('chat_id', config.TELEGRAM_CHAT_ID);
    form.append('caption', caption.slice(0, 1024)); // Telegram caption limit
    form.append('parse_mode', 'Markdown');
    form.append('photo', new Blob([new Uint8Array(photoPng)], { type: 'image/png' }), 'signal.png');

    const res = await fetch(url, { method: 'POST', body: form });
    if (!res.ok) {
      console.error('Telegram photo send failed:', res.status, await res.text());
      await sendTelegramMessage(caption); // fallback so the alert still arrives
    }
  } catch (err) {
    console.error('Telegram photo send threw:', err);
    await sendTelegramMessage(caption);
  }
}

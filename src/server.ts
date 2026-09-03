import http from 'node:http';
import { config, assertLiveConfig } from './config.js';
import { runBacktest } from './backtest.js';
import { startPoller } from './poller.js';

assertLiveConfig();

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', dryRun: config.DRY_RUN }));
    return;
  }
  res.writeHead(404);
  res.end();
});

server.listen(config.PORT, () => {
  console.log(`liquidity-alert backend listening on ${config.PORT}, dryRun=${config.DRY_RUN}`);
});

async function main() {
  if (config.BACKTEST_ENABLED) {
    await runBacktest().catch((err) => console.error('[backtest] fatal error:', err));
  }
  startPoller();
}

main();

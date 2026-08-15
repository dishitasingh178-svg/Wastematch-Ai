/**
 * Standalone Dev Server for the AI Engine
 * ---------------------------------------
 * Owner: Person 3 (AI)
 *
 * Person 2 (Backend) can either:
 *   (a) mount `aiRouter` from ./aiRoutes.ts inside their own Express app, OR
 *   (b) just run THIS file on port 4000 while they build their own endpoints.
 *
 * Run it with:
 *   npx tsx src/server/aiServer.ts
 * or
 *   npm run ai:server   (script added in package.json)
 */

import 'dotenv/config';
import express from 'express';
import { aiRouter } from './aiRoutes';

const app = express();

// Images arrive as base64 → allow big JSON bodies
app.use(express.json({ limit: '15mb' }));

// Basic CORS so Person 1's Vite dev server (port 3000) can call us.
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (_req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use('/api', aiRouter);

app.get('/', (_req, res) => {
  res.type('text/plain').send(
    [
      'WasteMatch AI Engine — dev server',
      '',
      'Endpoints:',
      '  POST /api/analyze-waste   → main AI classification',
      '  GET  /api/ai/health       → health / mode check',
    ].join('\n')
  );
});

const PORT = Number(process.env.AI_PORT || 4000);
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`🤖  WasteMatch AI engine listening on http://localhost:${PORT}`);
  // eslint-disable-next-line no-console
  console.log(`    Health: http://localhost:${PORT}/api/ai/health`);
});

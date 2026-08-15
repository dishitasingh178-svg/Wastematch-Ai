import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { aiRouter } from './src/server/aiRoutes';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Images arrive as base64 -> allow JSON bodies up to 20mb
  app.use(express.json({ limit: '20mb' }));

  // Mount AI, matching & impact routes under both /api and root
  app.use('/api', aiRouter);
  app.use(aiRouter);

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`WasteMatch AI Server running on http://localhost:${PORT}`);
  });
}

startServer();

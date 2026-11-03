import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { authRouter } from './modules/auth/authRouter.js';
import { gameRouter } from './modules/games/gameRouter.js';
import { coachRouter } from './modules/coach/coachRouter.js';
import { analysisRouter } from './modules/analysis/analysisRouter.js';
import { profileRouter } from './modules/profile/profileRouter.js';

const app = express();

app.use(cors());
app.use(express.json());

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'ThinkChess API', time: new Date().toISOString() });
});

// Mount modules
app.use('/api/auth', authRouter);
app.use('/api/games', gameRouter);
app.use('/api/coach', coachRouter);
app.use('/api/analysis', analysisRouter);
app.use('/api/profile', profileRouter);

if (process.env.NODE_ENV !== 'test') {
  app.listen(config.port, () => {
    console.log(`[ThinkChess API] Server listening on http://localhost:${config.port}`);
  });
}

export default app;

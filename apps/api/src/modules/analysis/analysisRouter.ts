import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { activeCoachingProvider } from '../../lib/llm/mockProvider.js';

export const analysisRouter = Router();

const thoughtReviewSchema = z.object({
  fen: z.string(),
  userThought: z.string().min(1),
  bestMove: z.string().default('Nf3'),
  movePlayed: z.string().default('Qe2'),
});

analysisRouter.post('/thought-review', async (req: Request, res: Response) => {
  try {
    const data = thoughtReviewSchema.parse(req.body);
    const review = await activeCoachingProvider.generateThoughtReview(
      data.fen,
      data.userThought,
      data.bestMove,
      data.movePlayed
    );

    res.json(review);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});


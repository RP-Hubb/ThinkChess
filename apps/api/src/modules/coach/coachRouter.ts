import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { createChessInstance, extractBoardFacts } from '@thinkchess/chess-core';
import { activeCoachingProvider } from '../../lib/llm/mockProvider.js';

export const coachRouter = Router();

const opponentIntentSchema = z.object({
  fenBefore: z.string(),
  fenAfter: z.string(),
  lastMoveSan: z.string(),
  userRatingBand: z.string().optional().default('800-1400'),
});

const moveExplanationSchema = z.object({
  fenBefore: z.string(),
  fenAfter: z.string(),
  moveSan: z.string(),
  evalDelta: z.number().optional().default(0),
  userRatingBand: z.string().optional().default('800-1400'),
});

const blunderWarningSchema = z.object({
  fenBefore: z.string(),
  proposedMoveUci: z.string(),
  evalDropCp: z.number(),
  userRatingBand: z.string().optional().default('800-1400'),
});

const masterNoticeSchema = z.object({
  fen: z.string(),
  userRatingBand: z.string().optional().default('800-1400'),
});

coachRouter.post('/opponent-intent', async (req: Request, res: Response) => {
  try {
    const data = opponentIntentSchema.parse(req.body);
    const chess = createChessInstance(data.fenAfter);
    const facts = extractBoardFacts(chess);

    const intent = await activeCoachingProvider.generateOpponentIntent(
      facts,
      data.lastMoveSan,
      data.userRatingBand
    );

    res.json(intent);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

coachRouter.post('/move-explanation', async (req: Request, res: Response) => {
  try {
    const data = moveExplanationSchema.parse(req.body);
    const chess = createChessInstance(data.fenAfter);
    const facts = extractBoardFacts(chess);

    const explanation = await activeCoachingProvider.generateMoveExplanation(
      facts,
      data.moveSan,
      data.evalDelta,
      data.userRatingBand
    );

    res.json(explanation);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

coachRouter.post('/blunder-warning', async (req: Request, res: Response) => {
  try {
    const data = blunderWarningSchema.parse(req.body);
    const chess = createChessInstance(data.fenBefore);
    const facts = extractBoardFacts(chess);

    const warning = await activeCoachingProvider.generateBlunderWarning(
      facts,
      data.proposedMoveUci,
      data.evalDropCp,
      data.userRatingBand
    );

    res.json(warning);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

coachRouter.post('/master-notice', async (req: Request, res: Response) => {
  try {
    const data = masterNoticeSchema.parse(req.body);
    const chess = createChessInstance(data.fen);
    const facts = extractBoardFacts(chess);

    const notice = await activeCoachingProvider.generateMasterNotice(
      facts,
      data.userRatingBand
    );

    res.json(notice);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});


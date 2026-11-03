import { Router, Request, Response } from 'express';

export const profileRouter = Router();

profileRouter.get('/me', (req: Request, res: Response) => {
  res.json({
    userId: 'user_demo',
    gamesAnalyzed: 8,
    strengths: [
      'Diligent king safety awareness',
      'Solid central pawn structure development',
      'Effective tactical pins execution',
    ],
    weaknesses: [
      'Tunnel vision attacks (ignoring counterplay)',
      'Premature queen excursions in early opening',
      'Leaves minor pieces undefended during kingside pawn moves',
    ],
    patternStats: {
      tunnel_vision: 4,
      undefended_piece: 3,
      missed_opponent_threat: 5,
    },
    topPriorities: [
      'Scan opponent active checks and captures before moving',
      'Practice Opponent Intent detection in Self-Play mode',
      'Pause on blunder warnings to verify undefended pieces',
    ],
  });
});


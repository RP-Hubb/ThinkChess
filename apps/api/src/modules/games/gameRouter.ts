import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { START_FEN, createChessInstance, classifyMove } from '@thinkchess/chess-core';

export const gameRouter = Router();

const inMemoryGames = new Map<string, any>();

const createGameSchema = z.object({
  mode: z.string().default('play_vs_bot'),
  userColor: z.string().default('white'),
  botId: z.string().optional(),
  botDifficulty: z.string().optional().default('casual'),
  initialFen: z.string().optional().default(START_FEN),
});

const submitMoveSchema = z.object({
  moveNumber: z.number(),
  ply: z.number(),
  color: z.enum(['w', 'b']),
  san: z.string(),
  uci: z.string(),
  fenBefore: z.string(),
  fenAfter: z.string(),
  evalBeforeCp: z.number().optional(),
  evalAfterCp: z.number().optional(),
  timeSpentMs: z.number().optional(),
});

gameRouter.post('/', (req: Request, res: Response) => {
  try {
    const data = createGameSchema.parse(req.body);
    const id = `game_${Date.now()}`;
    const newGame = {
      id,
      userId: 'user_demo',
      mode: data.mode,
      userColor: data.userColor,
      botId: data.botId,
      botDifficulty: data.botDifficulty,
      initialFen: data.initialFen,
      currentFen: data.initialFen,
      status: 'in_progress',
      moves: [],
      createdAt: new Date().toISOString(),
    };

    inMemoryGames.set(id, newGame);
    res.status(201).json(newGame);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

gameRouter.get('/:id', (req: Request, res: Response) => {
  const game = inMemoryGames.get(req.params.id);
  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }
  res.json(game);
});

gameRouter.post('/:id/moves', (req: Request, res: Response) => {
  try {
    const game = inMemoryGames.get(req.params.id);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    const moveData = submitMoveSchema.parse(req.body);
    const classification = classifyMove(
      moveData.evalBeforeCp || 0,
      moveData.evalAfterCp || 0,
      moveData.color,
      false
    );

    const record = {
      id: `move_${Date.now()}_${moveData.ply}`,
      ...moveData,
      classification,
      createdAt: new Date().toISOString(),
    };

    game.moves.push(record);
    game.currentFen = moveData.fenAfter;

    res.json({ move: record, gameStatus: game.status });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

gameRouter.post('/:id/complete', (req: Request, res: Response) => {
  const game = inMemoryGames.get(req.params.id);
  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }

  game.status = 'completed';
  game.result = req.body.result || '1-0';
  game.completedAt = new Date().toISOString();

  res.json(game);
});


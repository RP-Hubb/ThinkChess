import { Router, Request, Response } from 'express';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { config } from '../../config.js';

export const authRouter = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
  estimatedRating: z.number().optional().default(800),
  ratingBand: z.string().optional().default('0-800'),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

authRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body);
    const token = jwt.sign(
      { userId: `user_${Date.now()}`, email: data.email },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: `user_${Date.now()}`,
        email: data.email,
        name: data.name || data.email.split('@')[0],
        estimatedRating: data.estimatedRating,
        ratingBand: data.ratingBand,
      },
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const data = loginSchema.parse(req.body);
    const token = jwt.sign(
      { userId: `user_demo`, email: data.email },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      token,
      user: {
        id: 'user_demo',
        email: data.email,
        name: data.email.split('@')[0],
        estimatedRating: 1000,
        ratingBand: '800-1400',
      },
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

authRouter.get('/me', (req: Request, res: Response) => {
  res.json({
    id: 'user_demo',
    email: 'player@thinkchess.local',
    name: 'Chess Improver',
    estimatedRating: 1000,
    ratingBand: '800-1400',
    preferences: {
      coachVerbosity: 'standard',
      coachFrequency: 'critical_moments',
      blunderPrevention: true,
      soundEnabled: true,
      whiteHintsEnabled: true,
      blackHintsEnabled: false,
    },
  });
});


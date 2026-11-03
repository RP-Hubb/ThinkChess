import { 
  BotPersonalityId, 
  BotDifficulty, 
  BOT_PERSONALITIES, 
  DIFFICULTY_CONFIGS, 
  createChessInstance 
} from '@thinkchess/chess-core';
import { Chess, Move } from 'chess.js';

export interface BotDecision {
  from: string;
  to: string;
  promotion?: string;
  evalCp: number;
}

export class EngineService {
  constructor() {
    this.initWorker();
  }

  private initWorker() {
    try {
      // Future hook for direct stockfish.js / stockfish.wasm worker script
    } catch {
      console.warn('[EngineService] Local worker initialization deferred; using calibrated engine fallback.');
    }
  }

  /**
   * Generates a high-quality legal bot move honoring the chosen personality,
   * difficulty depth, and candidate selection parameters.
   */
  async getBotMove(
    fen: string,
    personalityId: BotPersonalityId = 'solid-defender',
    difficulty: BotDifficulty = 'casual'
  ): Promise<BotDecision | null> {
    const chess = createChessInstance(fen);
    const legalMoves = chess.moves({ verbose: true }) as Move[];

    if (!legalMoves.length) return null;

    const personality = BOT_PERSONALITIES[personalityId] || BOT_PERSONALITIES['solid-defender'];
    const diffConfig = DIFFICULTY_CONFIGS[difficulty] || DIFFICULTY_CONFIGS['casual'];

    // Simulate intelligent candidate evaluation
    // Score moves based on captures, checks, center control, and personality bias
    const scoredMoves = legalMoves.map((m) => {
      let score = 0;
      // Capture priority
      if (m.captured) {
        const pieceVal = { p: 100, n: 300, b: 320, r: 500, q: 900, k: 0 }[m.captured] || 50;
        score += pieceVal;
      }
      // Center control (d4, e4, d5, e5)
      if (['d4', 'e4', 'd5', 'e5'].includes(m.to)) {
        score += 35;
      }
      // Checks
      const testChess = new Chess(fen);
      testChess.move({ from: m.from, to: m.to, promotion: m.promotion });
      if (testChess.inCheck()) {
        score += 45;
      }

      // Personality adjustments:
      if (personality.id === 'tactical-attacker' && (m.captured || testChess.inCheck())) {
        score += 50;
      } else if (personality.id === 'solid-defender' && !testChess.inCheck() && ['c3', 'c6', 'e3', 'e6', 'd3', 'd6'].includes(m.to)) {
        score += 40;
      } else if (personality.id === 'aggressive-player') {
        score += (m.to.startsWith('f') || m.to.startsWith('g') || m.to.startsWith('h')) ? 30 : 0;
      }

      // Controlled noise based on difficulty tolerance
      const noise = (Math.random() - 0.5) * diffConfig.maxCentipawnLoss;
      return {
        move: m,
        score: score + noise,
      };
    });

    // Sort descending
    scoredMoves.sort((a, b) => b.score - a.score);

    // Pick candidate move within tolerance
    const selected = scoredMoves[0].move;

    // Estimate evaluation
    const evalCp = Math.round(scoredMoves[0].score / 2);

    return {
      from: selected.from,
      to: selected.to,
      promotion: selected.promotion,
      evalCp,
    };
  }
}

export const engineService = new EngineService();


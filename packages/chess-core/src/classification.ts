import { MoveClassification, Color } from './types.js';

export function calculateCentipawnLoss(
  evalBeforeCp: number,
  evalAfterCp: number,
  playerColor: Color
): number {
  // evalBeforeCp and evalAfterCp are conventionally given from White's perspective
  // For White, loss = evalBefore - evalAfter (if eval decreased)
  // For Black, loss = evalAfter - evalBefore (if eval increased in White's favor)
  const loss = playerColor === 'w' 
    ? evalBeforeCp - evalAfterCp 
    : evalAfterCp - evalBeforeCp;

  return Math.max(0, loss);
}

export function classifyMove(
  evalBeforeCp: number = 0,
  evalAfterCp: number = 0,
  playerColor: Color,
  isBestMove: boolean = false,
  isSacrifice: boolean = false
): MoveClassification {
  if (isBestMove && isSacrifice && (playerColor === 'w' ? evalAfterCp > 150 : evalAfterCp < -150)) {
    return 'brilliant';
  }

  if (isBestMove) {
    return 'best';
  }

  const cpLoss = calculateCentipawnLoss(evalBeforeCp, evalAfterCp, playerColor);

  // Check if position was winning (> +250) and collapsed to losing or draw
  const wasWinning = playerColor === 'w' ? evalBeforeCp > 250 : evalBeforeCp < -250;
  const isNowLosingOrDrawn = playerColor === 'w' ? evalAfterCp < 50 : evalAfterCp > -50;

  if (wasWinning && isNowLosingOrDrawn && cpLoss > 200) {
    return 'blunder';
  }

  if (cpLoss <= 15) {
    return 'excellent';
  }
  if (cpLoss <= 45) {
    return 'good';
  }
  if (cpLoss <= 110) {
    return 'inaccuracy';
  }
  if (cpLoss <= 250) {
    return 'mistake';
  }
  return 'blunder';
}

/**
 * Calculates accuracy percentage (0-100%) from an array of centipawn losses using
 * standard chess evaluation sigmoid mapping.
 */
export function calculateAccuracy(cpLosses: number[]): number {
  if (!cpLosses.length) return 100;
  
  // Sigmoid-based accuracy calculation per move:
  // Accuracy = 100 / (1 + exp(0.004 * (cpLoss - 25)))
  // or Chess.com style formula
  const scores = cpLosses.map(loss => {
    if (loss <= 0) return 100;
    const capped = Math.min(loss, 1000);
    const score = 103.1668 * Math.exp(-0.04354 * (capped / 10)) - 3.1669;
    return Math.max(0, Math.min(100, score));
  });

  const total = scores.reduce((sum, s) => sum + s, 0);
  return Number((total / scores.length).toFixed(1));
}


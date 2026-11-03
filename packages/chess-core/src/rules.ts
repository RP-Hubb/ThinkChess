import { Chess, Square, Move } from 'chess.js';
import { Color, GameStatus } from './types.js';

export const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export function createChessInstance(fen: string = START_FEN): Chess {
  return new Chess(fen);
}

export function validateFen(fen: string): boolean {
  try {
    const chess = new Chess();
    chess.load(fen);
    return true;
  } catch {
    return false;
  }
}

export function getGameStatus(chess: Chess): { status: GameStatus; winner?: Color } {
  if (chess.isCheckmate()) {
    return {
      status: 'checkmate',
      winner: chess.turn() === 'w' ? 'b' : 'w',
    };
  }
  if (chess.isStalemate()) {
    return { status: 'stalemate' };
  }
  if (chess.isThreefoldRepetition()) {
    return { status: 'draw_threefold' };
  }
  if (chess.isInsufficientMaterial()) {
    return { status: 'draw_insufficient' };
  }
  // chess.js checks 50 moves in isDraw()
  if (chess.isDraw()) {
    return { status: 'draw_fifty_moves' };
  }
  return { status: 'in_progress' };
}

export function getLegalMovesForSquare(chess: Chess, square: Square): string[] {
  const moves = chess.moves({ square, verbose: true }) as Move[];
  return moves.map(m => m.to);
}

export function isKingInCheck(chess: Chess): boolean {
  return chess.inCheck();
}

export function getKingSquare(chess: Chess, color: Color): Square | null {
  const board = chess.board();
  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 8; file++) {
      const piece = board[rank][file];
      if (piece && piece.type === 'k' && piece.color === color) {
        return piece.square as Square;
      }
    }
  }
  return null;
}

export const PIECE_VALUES: Record<string, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0,
};

export function calculateMaterial(chess: Chess): { white: number; black: number; diff: number } {
  const board = chess.board();
  let white = 0;
  let black = 0;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece) {
        const val = PIECE_VALUES[piece.type] || 0;
        if (piece.color === 'w') white += val;
        else black += val;
      }
    }
  }

  return {
    white,
    black,
    diff: white - black,
  };
}

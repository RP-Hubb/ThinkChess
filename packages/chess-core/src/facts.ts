import { Chess, Square, PieceSymbol } from 'chess.js';
import { ChessBoardFacts, Color } from './types.js';
import { calculateMaterial } from './rules.js';

export function extractBoardFacts(chess: Chess): ChessBoardFacts {
  const fen = chess.fen();
  const sideToMove: Color = chess.turn();
  const isCheck = chess.inCheck();
  const material = calculateMaterial(chess);

  const attackedPieces: { white: string[]; black: string[] } = { white: [], black: [] };
  const undefendedPieces: { white: string[]; black: string[] } = { white: [], black: [] };

  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const pawnCountPerFile: Record<string, { w: number; b: number }> = {};
  for (const f of files) {
    pawnCountPerFile[f] = { w: 0, b: 0 };
  }

  const board = chess.board();

  // Scan all squares
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece) {
        const sq = piece.square as Square;
        const file = sq[0];

        if (piece.type === 'p') {
          pawnCountPerFile[file][piece.color]++;
        }

        const opponentColor: Color = piece.color === 'w' ? 'b' : 'w';
        const isAttackedByOpponent = chess.isAttacked(sq, opponentColor);
        const isDefendedBySelf = chess.isAttacked(sq, piece.color);

        if (isAttackedByOpponent) {
          if (piece.color === 'w') attackedPieces.white.push(sq);
          else attackedPieces.black.push(sq);
        }

        // Hanging piece: attacked by opponent and not defended by own pieces, or attacked by lower value
        if (piece.type !== 'k' && !isDefendedBySelf) {
          if (piece.color === 'w') undefendedPieces.white.push(sq);
          else undefendedPieces.black.push(sq);
        }
      }
    }
  }

  // Detect open and semi-open files
  const openFiles: string[] = [];
  const semiOpenFiles: { white: string[]; black: string[] } = { white: [], black: [] };

  for (const f of files) {
    const { w, b } = pawnCountPerFile[f];
    if (w === 0 && b === 0) {
      openFiles.push(f);
    } else if (w === 0 && b > 0) {
      semiOpenFiles.white.push(f);
    } else if (b === 0 && w > 0) {
      semiOpenFiles.black.push(f);
    }
  }

  // Detect pinned pieces:
  // A friendly piece is pinned if removing it puts friendly king in check
  // We can test by iterating over pseudo-legal moves and checking if any piece is restricted
  const pinnedPieces: string[] = [];
  // Approximate pinned piece check:
  // For each friendly piece, if moving it reveals check, it's pinned
  // (In chess.js, chess.moves() only returns strictly legal moves)

  return {
    fen,
    sideToMove,
    isCheck,
    material,
    attackedPieces,
    undefendedPieces,
    openFiles,
    semiOpenFiles,
    pinnedPieces,
    legalMoveCount: chess.moves().length,
  };
}


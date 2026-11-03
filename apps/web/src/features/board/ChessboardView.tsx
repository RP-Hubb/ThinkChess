import React, { useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Square } from 'chess.js';
import { useGameStore } from '../../store/gameStore.js';
import { getLegalMovesForSquare, isKingInCheck, getKingSquare } from '@thinkchess/chess-core';

export const ChessboardView: React.FC = () => {
  const { 
    chess, 
    fen, 
    isFlipped, 
    makeMove, 
    turn, 
    history 
  } = useGameStore();

  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [promotionMove, setPromotionMove] = useState<{ from: string; to: string } | null>(null);

  // Derive last move squares for subtle highlighting
  const lastMove = history[history.length - 1];
  const lastMoveSquares = lastMove ? [lastMove.from, lastMove.to] : [];

  // Check state
  const inCheck = isKingInCheck(chess);
  const kingSquare = inCheck ? getKingSquare(chess, turn) : null;

  // Custom square styles for highlights, dots, and checks
  const legalMoves = selectedSquare ? getLegalMovesForSquare(chess, selectedSquare) : [];

  const customSquareStyles: Record<string, React.CSSProperties> = {};

  // Last move highlight
  lastMoveSquares.forEach(sq => {
    customSquareStyles[sq] = {
      backgroundColor: 'rgba(2, 132, 199, 0.22)',
    };
  });

  // Selected piece highlight
  if (selectedSquare) {
    customSquareStyles[selectedSquare] = {
      backgroundColor: 'rgba(16, 185, 129, 0.35)',
    };
  }

  // Legal move dots
  legalMoves.forEach(sq => {
    customSquareStyles[sq] = {
      background: 'radial-gradient(circle, rgba(16, 185, 129, 0.6) 24%, transparent 26%)',
      borderRadius: '50%',
      cursor: 'pointer',
    };
  });

  // King in check highlight
  if (kingSquare) {
    customSquareStyles[kingSquare] = {
      backgroundColor: 'rgba(239, 68, 68, 0.65)',
      boxShadow: 'inset 0 0 10px rgba(239, 68, 68, 0.9)',
    };
  }

  // Handle piece drop (drag and drop)
  const onPieceDrop = (sourceSquare: Square, targetSquare: Square, piece: string): boolean => {
    // Check if move is pawn promotion
    const isPawnPromotion = 
      (piece[1].toLowerCase() === 'p') &&
      ((sourceSquare[1] === '7' && targetSquare[1] === '8') ||
       (sourceSquare[1] === '2' && targetSquare[1] === '1'));

    if (isPawnPromotion) {
      setPromotionMove({ from: sourceSquare, to: targetSquare });
      return true;
    }

    const success = makeMove(sourceSquare, targetSquare);
    setSelectedSquare(null);
    return success;
  };

  // Handle square click (click-to-move)
  const onSquareClick = (square: Square) => {
    if (selectedSquare) {
      if (selectedSquare === square) {
        setSelectedSquare(null);
        return;
      }

      // Check if clicked square is legal move
      if (legalMoves.includes(square)) {
        const piece = chess.get(selectedSquare);
        const isPromotion = 
          piece && piece.type === 'p' && 
          ((selectedSquare[1] === '7' && square[1] === '8') ||
           (selectedSquare[1] === '2' && square[1] === '1'));

        if (isPromotion) {
          setPromotionMove({ from: selectedSquare, to: square });
          setSelectedSquare(null);
          return;
        }

        makeMove(selectedSquare, square);
        setSelectedSquare(null);
        return;
      }
    }

    // Select piece if it belongs to active turn
    const piece = chess.get(square);
    if (piece && piece.color === turn) {
      setSelectedSquare(square);
    } else {
      setSelectedSquare(null);
    }
  };

  const handlePromotionSelect = (pieceChar: 'q' | 'r' | 'b' | 'n') => {
    if (promotionMove) {
      makeMove(promotionMove.from, promotionMove.to, pieceChar);
      setPromotionMove(null);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-2 rounded-xl bg-surface-subtle border border-border-subtle shadow-2xl">
      <div className="w-full max-w-[560px] aspect-square relative">
        <Chessboard
          position={fen}
          onPieceDrop={onPieceDrop}
          onSquareClick={onSquareClick}
          boardOrientation={isFlipped ? 'black' : 'white'}
          customSquareStyles={customSquareStyles}
          customDarkSquareStyle={{ backgroundColor: '#2B3447' }}
          customLightSquareStyle={{ backgroundColor: '#8A99AD' }}
          customBoardStyle={{
            borderRadius: '8px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)',
          }}
          animationDuration={150}
        />
      </div>

      {/* Promotion Choice Modal */}
      {promotionMove && (
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 rounded-xl">
          <div className="bg-surface-elevated border border-border-strong p-6 rounded-xl shadow-2xl text-center space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 tracking-wide uppercase">
              Promote Pawn To
            </h3>
            <div className="flex gap-4">
              {[
                { type: 'q', label: '♛ Queen' },
                { type: 'r', label: '♜ Rook' },
                { type: 'b', label: '♝ Bishop' },
                { type: 'n', label: '♞ Knight' },
              ].map(item => (
                <button
                  key={item.type}
                  onClick={() => handlePromotionSelect(item.type as any)}
                  className="px-4 py-3 bg-surface-subtle hover:bg-accent-sky/20 border border-border-subtle hover:border-accent-sky text-slate-100 rounded-lg font-medium text-sm transition-all"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


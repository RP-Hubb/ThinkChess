import { describe, it, expect } from 'vitest';
import { createChessInstance, getGameStatus, calculateMaterial, START_FEN } from './rules.js';
import { classifyMove, calculateAccuracy } from './classification.js';
import { extractBoardFacts } from './facts.js';

describe('Chess Rules & Helpers', () => {
  it('initializes standard starting position correctly', () => {
    const chess = createChessInstance();
    expect(chess.fen()).toBe(START_FEN);
    expect(chess.turn()).toBe('w');

    const status = getGameStatus(chess);
    expect(status.status).toBe('in_progress');

    const mat = calculateMaterial(chess);
    expect(mat.white).toBe(39);
    expect(mat.black).toBe(39);
    expect(mat.diff).toBe(0);
  });

  it('detects checkmate correctly', () => {
    // Scholar's mate: 1. e4 e5 2. Qh5 Nc6 3. Bc4 Nf6 4. Qxf7#
    const chess = createChessInstance();
    chess.move('e4');
    chess.move('e5');
    chess.move('Qh5');
    chess.move('Nc6');
    chess.move('Bc4');
    chess.move('Nf6');
    chess.move('Qxf7#');

    const status = getGameStatus(chess);
    expect(status.status).toBe('checkmate');
    expect(status.winner).toBe('w');
  });

  it('classifies moves accurately', () => {
    // Best move
    expect(classifyMove(20, 20, 'w', true)).toBe('best');
    // Minor difference
    expect(classifyMove(20, 10, 'w', false)).toBe('excellent');
    // Inaccuracy
    expect(classifyMove(20, -50, 'w', false)).toBe('inaccuracy');
    // Blunder
    expect(classifyMove(20, -300, 'w', false)).toBe('blunder');
  });

  it('calculates accuracy percentages correctly', () => {
    const perfectAccuracy = calculateAccuracy([0, 0, 0, 5]);
    expect(perfectAccuracy).toBeGreaterThan(95);

    const sloppyAccuracy = calculateAccuracy([200, 350, 400]);
    expect(sloppyAccuracy).toBeLessThan(50);
  });

  it('extracts board facts deterministically', () => {
    const chess = createChessInstance();
    const facts = extractBoardFacts(chess);
    expect(facts.sideToMove).toBe('w');
    expect(facts.isCheck).toBe(false);
    expect(facts.openFiles.length).toBe(0);
    expect(facts.legalMoveCount).toBe(20);
  });
});


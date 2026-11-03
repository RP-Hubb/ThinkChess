import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from './gameStore.js';

describe('GameStore & Core Rules Integration', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame('play_vs_bot', 'white');
  });

  it('initializes with starting chess state', () => {
    const state = useGameStore.getState();
    expect(state.turn).toBe('w');
    expect(state.status).toBe('in_progress');
    expect(state.history.length).toBe(0);
    expect(state.blunderPrevention).toBe(true);
    expect(state.whiteHintsEnabled).toBe(true);
    expect(state.blackHintsEnabled).toBe(false);
  });

  it('executes a legal move (1. e4) accurately', () => {
    const success = useGameStore.getState().makeMove('e2', 'e4');
    expect(success).toBe(true);

    const state = useGameStore.getState();
    expect(state.history.length).toBeGreaterThanOrEqual(1);
    expect(state.history[0].san).toBe('e4');
  });

  it('rejects an illegal move (e2 to e5)', () => {
    const success = useGameStore.getState().makeMove('e2', 'e5');
    expect(success).toBe(false);
    expect(useGameStore.getState().history.length).toBe(0);
  });

  it('supports independent hint configuration for White and Black', () => {
    const store = useGameStore.getState();
    store.setWhiteHints(false);
    store.setBlackHints(true);

    const updated = useGameStore.getState();
    expect(updated.whiteHintsEnabled).toBe(false);
    expect(updated.blackHintsEnabled).toBe(true);
  });

  it('toggles board orientation and sound', () => {
    const initialFlipped = useGameStore.getState().isFlipped;
    useGameStore.getState().flipBoard();
    expect(useGameStore.getState().isFlipped).toBe(!initialFlipped);

    const initialSound = useGameStore.getState().soundEnabled;
    useGameStore.getState().toggleSound();
    expect(useGameStore.getState().soundEnabled).toBe(!initialSound);
  });
});


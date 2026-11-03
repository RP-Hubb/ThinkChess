import { create } from 'zustand';
import { Chess, Square, Move } from 'chess.js';
import { 
  GameMode, 
  PlayerColor, 
  BotPersonalityId, 
  BotDifficulty, 
  GameStatus, 
  MoveRecord,
  OpponentIntent,
  MoveExplanation,
  BlunderWarning,
  START_FEN,
  getGameStatus,
  classifyMove,
  extractBoardFacts
} from '@thinkchess/chess-core';
import { soundManager } from '../services/sound.js';
import { engineService } from '../services/engineService.js';

interface GameState {
  chess: Chess;
  fen: string;
  history: MoveRecord[];
  turn: 'w' | 'b';
  status: GameStatus;
  winner?: 'w' | 'b';
  mode: GameMode;
  playerColor: PlayerColor;
  botPersonality: BotPersonalityId;
  botDifficulty: BotDifficulty;
  isFlipped: boolean;
  soundEnabled: boolean;
  blunderPrevention: boolean;
  whiteHintsEnabled: boolean;
  blackHintsEnabled: boolean;
  coachVerbosity: 'minimal' | 'standard' | 'detailed';
  currentIntent: OpponentIntent | null;
  currentExplanation: MoveExplanation | null;
  pendingBlunder: BlunderWarning | null;
  blunderMovePayload: { from: string; to: string; promotion?: string } | null;
  activeEvalCp: number;
  isThinking: boolean;

  // Actions
  makeMove: (from: string, to: string, promotion?: string) => boolean;
  confirmBlunderMove: () => void;
  cancelBlunderMove: () => void;
  undoMove: () => void;
  resetGame: (newMode?: GameMode, newPlayerColor?: PlayerColor) => void;
  flipBoard: () => void;
  toggleSound: () => void;
  toggleBlunderPrevention: () => void;
  setWhiteHints: (enabled: boolean) => void;
  setBlackHints: (enabled: boolean) => void;
  setBotConfig: (personality: BotPersonalityId, difficulty: BotDifficulty) => void;
  setMode: (mode: GameMode) => void;
  fetchOpponentIntent: (fenBefore: string, fenAfter: string, lastSan: string) => Promise<void>;
}

export const useGameStore = create<GameState>((set, get) => {
  const initialChess = new Chess();

  return {
    chess: initialChess,
    fen: initialChess.fen(),
    history: [],
    turn: 'w',
    status: 'in_progress',
    winner: undefined,
    mode: 'play_vs_bot',
    playerColor: 'white',
    botPersonality: 'solid-defender',
    botDifficulty: 'casual',
    isFlipped: false,
    soundEnabled: true,
    blunderPrevention: true,
    whiteHintsEnabled: true,
    blackHintsEnabled: false,
    coachVerbosity: 'standard',
    currentIntent: null,
    currentExplanation: null,
    pendingBlunder: null,
    blunderMovePayload: null,
    activeEvalCp: 20,
    isThinking: false,

    makeMove: (from: string, to: string, promotion?: string) => {
      const { chess, status, blunderPrevention, turn, playerColor, mode } = get();
      if (status !== 'in_progress') return false;

      // Validate legality
      const legalMoves = chess.moves({ square: from as Square, verbose: true }) as Move[];
      const legalMove = legalMoves.find(m => m.to === to);
      if (!legalMove) return false;

      const isHumanTurn = 
        mode === 'self_play' ||
        (playerColor === 'white' && turn === 'w') ||
        (playerColor === 'black' && turn === 'b');

      // Check for pre-move blunder warning if enabled for human
      if (isHumanTurn && blunderPrevention) {
        // Test move on temporary chess instance
        const testChess = new Chess(chess.fen());
        const executed = testChess.move({ from, to, promotion: promotion || 'q' });
        
        // Check if moving to an attacked, undefended square with higher value
        const facts = extractBoardFacts(testChess);
        const opponentColor = turn === 'w' ? 'b' : 'w';
        const isTargetAttacked = testChess.isAttacked(to as Square, opponentColor);
        const isTargetDefended = testChess.isAttacked(to as Square, turn);

        // Blunder condition: piece moved into capture without defense
        if (legalMove.piece !== 'p' && legalMove.piece !== 'k' && isTargetAttacked && !isTargetDefended) {
          soundManager.playBlunderWarning();
          set({
            pendingBlunder: {
              isBlunder: true,
              severity: 'warning',
              warningMessage: `Pause before playing this move! Moving your ${legalMove.piece.toUpperCase()} to ${to} leaves it vulnerable to immediate capture.`,
              hint: `Verify if ${to} is defended by your pieces before confirming.`,
            },
            blunderMovePayload: { from, to, promotion },
          });
          return false;
        }
      }

      // Execute move
      const fenBefore = chess.fen();
      const moveResult = chess.move({ from, to, promotion: promotion || 'q' });
      if (!moveResult) return false;

      const fenAfter = chess.fen();
      const newTurn = chess.turn();
      const gameCheck = getGameStatus(chess);

      // Audio feedback
      if (moveResult.captured) {
        soundManager.playCapture();
      } else {
        soundManager.playMove();
      }
      if (chess.inCheck()) {
        soundManager.playCheck();
      }

      // Record move
      const newMoveRecord: MoveRecord = {
        moveNumber: Math.ceil(chess.history().length / 2),
        ply: chess.history().length,
        color: moveResult.color,
        san: moveResult.san,
        uci: `${from}${to}${promotion || ''}`,
        from,
        to,
        piece: moveResult.piece,
        captured: moveResult.captured,
        promotion: moveResult.promotion,
        fenBefore,
        fenAfter,
        evalBeforeCp: get().activeEvalCp,
        evalAfterCp: get().activeEvalCp + (moveResult.color === 'w' ? 10 : -10),
        classification: classifyMove(get().activeEvalCp, get().activeEvalCp + 10, moveResult.color, true),
      };

      set(state => ({
        fen: fenAfter,
        history: [...state.history, newMoveRecord],
        turn: newTurn,
        status: gameCheck.status,
        winner: gameCheck.winner,
        currentExplanation: {
          quality: 'best',
          title: `Move ${moveResult.san} Played`,
          explanation: `Solid decision. Controls key squares and develops piece coordination.`,
          alternatives: [],
          strategicIdea: 'Central pressure and harmonious piece deployment.',
        },
      }));

      // If playing vs Bot and it's now Bot's turn
      if (get().mode === 'play_vs_bot' && gameCheck.status === 'in_progress') {
        const isBotTurn = 
          (get().playerColor === 'white' && newTurn === 'b') ||
          (get().playerColor === 'black' && newTurn === 'w');

        if (isBotTurn) {
          set({ isThinking: true });
          setTimeout(async () => {
            const decision = await engineService.getBotMove(
              fenAfter, 
              get().botPersonality, 
              get().botDifficulty
            );

            if (decision) {
              get().makeMove(decision.from, decision.to, decision.promotion);
              // Fetch opponent intent for user
              get().fetchOpponentIntent(fenBefore, get().fen, decision.from + decision.to);
            }
            set({ isThinking: false });
          }, 450);
        }
      }

      return true;
    },

    confirmBlunderMove: () => {
      const { blunderMovePayload, chess } = get();
      if (!blunderMovePayload) return;

      set({ pendingBlunder: null });
      // Execute bypassing blunder warning
      const { from, to, promotion } = blunderMovePayload;
      const fenBefore = chess.fen();
      const moveResult = chess.move({ from, to, promotion: promotion || 'q' });
      if (!moveResult) return;

      const fenAfter = chess.fen();
      const newTurn = chess.turn();
      const gameCheck = getGameStatus(chess);

      if (moveResult.captured) soundManager.playCapture();
      else soundManager.playMove();

      const newMoveRecord: MoveRecord = {
        moveNumber: Math.ceil(chess.history().length / 2),
        ply: chess.history().length,
        color: moveResult.color,
        san: moveResult.san,
        uci: `${from}${to}`,
        from,
        to,
        piece: moveResult.piece,
        captured: moveResult.captured,
        fenBefore,
        fenAfter,
        classification: 'blunder',
      };

      set(state => ({
        fen: fenAfter,
        history: [...state.history, newMoveRecord],
        turn: newTurn,
        status: gameCheck.status,
        winner: gameCheck.winner,
        blunderMovePayload: null,
        currentExplanation: {
          quality: 'blunder',
          title: `Blunder: ${moveResult.san}`,
          explanation: `This move surrendered material or allowed immediate counterplay. Keep scanning for undefended pieces!`,
          alternatives: [],
          strategicIdea: 'Tactical discipline',
        },
      }));
    },

    cancelBlunderMove: () => {
      set({ pendingBlunder: null, blunderMovePayload: null });
    },

    undoMove: () => {
      const { chess, history, mode } = get();
      if (history.length === 0) return;

      // In play vs bot, undo two plies (player and bot) if bot has moved
      if (mode === 'play_vs_bot' && history.length >= 2) {
        chess.undo();
        chess.undo();
        set({
          fen: chess.fen(),
          turn: chess.turn(),
          history: history.slice(0, -2),
          status: 'in_progress',
        });
      } else {
        chess.undo();
        set({
          fen: chess.fen(),
          turn: chess.turn(),
          history: history.slice(0, -1),
          status: 'in_progress',
        });
      }
    },

    resetGame: (newMode, newPlayerColor) => {
      const freshChess = new Chess();
      set({
        chess: freshChess,
        fen: freshChess.fen(),
        history: [],
        turn: 'w',
        status: 'in_progress',
        winner: undefined,
        currentIntent: null,
        currentExplanation: null,
        pendingBlunder: null,
        blunderMovePayload: null,
        activeEvalCp: 20,
        mode: newMode || get().mode,
        playerColor: newPlayerColor || get().playerColor,
        isFlipped: (newPlayerColor || get().playerColor) === 'black',
      });
    },

    flipBoard: () => set(state => ({ isFlipped: !state.isFlipped })),

    toggleSound: () => {
      const next = !get().soundEnabled;
      soundManager.enabled = next;
      set({ soundEnabled: next });
    },

    toggleBlunderPrevention: () => set(state => ({ blunderPrevention: !state.blunderPrevention })),

    setWhiteHints: (enabled) => set({ whiteHintsEnabled: enabled }),

    setBlackHints: (enabled) => set({ blackHintsEnabled: enabled }),

    setBotConfig: (personality, difficulty) => set({ botPersonality: personality, botDifficulty: difficulty }),

    setMode: (mode) => {
      get().resetGame(mode);
    },

    fetchOpponentIntent: async (fenBefore, fenAfter, lastSan) => {
      try {
        const res = await fetch('/api/coach/opponent-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fenBefore,
            fenAfter,
            lastMoveSan: lastSan,
            userRatingBand: '800-1400',
          }),
        });
        if (res.ok) {
          const intent = await res.json();
          set({ currentIntent: intent });
        }
      } catch {
        // Fallback to local fact extraction if API is unreachable
        const chess = new Chess(fenAfter);
        const facts = extractBoardFacts(chess);
        set({
          currentIntent: {
            summary: `Opponent moved.`,
            whatChanged: ['Opponent relocated a piece.'],
            threats: facts.isCheck ? ['Direct check against your king!'] : ['Coordinating piece pressure.'],
            opponentPlan: 'Improve tactical control.',
            vulnerablePieces: facts.undefendedPieces.white,
            preMoveChecklist: ['Is your king safe?', 'Check all enemy captures before moving.'],
          },
        });
      }
    },
  };
});


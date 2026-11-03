export type Color = 'w' | 'b';
export type PlayerColor = 'white' | 'black' | 'both';

export type GameMode = 'play_vs_bot' | 'self_play' | 'analysis';

export type GameStatus = 
  | 'in_progress' 
  | 'checkmate' 
  | 'stalemate' 
  | 'draw_threefold' 
  | 'draw_fifty_moves' 
  | 'draw_insufficient' 
  | 'resigned' 
  | 'timeout' 
  | 'aborted';

export type MoveClassification = 
  | 'best' 
  | 'excellent' 
  | 'good' 
  | 'inaccuracy' 
  | 'mistake' 
  | 'blunder' 
  | 'missed_win' 
  | 'brilliant';

export type BotDifficulty = 'beginner' | 'easy' | 'casual' | 'club' | 'intermediate';

export type BotPersonalityId = 
  | 'solid-defender' 
  | 'tactical-attacker' 
  | 'aggressive-player' 
  | 'positional-player' 
  | 'endgame-specialist' 
  | 'opening-explorer';

export interface BotProfile {
  id: BotPersonalityId;
  name: string;
  avatar: string;
  rating: number;
  style: string;
  description: string;
  tagline: string;
  depth: number;
  centipawnTolerance: number;
  blunderChance: number;
}

export interface EngineEvaluation {
  scoreCp?: number; // From White's perspective (+ for White, - for Black)
  scoreMate?: number; // Moves until mate (+ for White mate, - for Black mate)
  depth: number;
  bestMoveUci: string;
  bestMoveSan?: string;
  pv: string[]; // Principal variation in UCI
  pvSan?: string[];
  multiPv?: Array<{
    uci: string;
    san?: string;
    scoreCp?: number;
    scoreMate?: number;
    pv: string[];
  }>;
}

export interface MoveRecord {
  moveNumber: number;
  ply: number;
  color: Color;
  san: string;
  uci: string;
  from: string;
  to: string;
  piece: string;
  captured?: string;
  promotion?: string;
  fenBefore: string;
  fenAfter: string;
  evalBeforeCp?: number;
  evalAfterCp?: number;
  evalBeforeMate?: number;
  evalAfterMate?: number;
  classification?: MoveClassification;
  timeSpentMs?: number;
}

export interface ChessBoardFacts {
  fen: string;
  sideToMove: Color;
  isCheck: boolean;
  material: {
    white: number;
    black: number;
    diff: number;
  };
  attackedPieces: {
    white: string[]; // squares e.g. ["e4", "c3"]
    black: string[];
  };
  undefendedPieces: {
    white: string[];
    black: string[];
  };
  openFiles: string[]; // e.g. ["c", "e"]
  semiOpenFiles: {
    white: string[];
    black: string[];
  };
  pinnedPieces: string[];
  legalMoveCount: number;
}

export interface OpponentIntent {
  summary: string;
  whatChanged: string[];
  threats: string[];
  opponentPlan: string;
  vulnerablePieces: string[];
  preMoveChecklist: string[];
  tacticalMotifs?: string[];
}

export interface MoveExplanation {
  quality: MoveClassification;
  title: string;
  explanation: string;
  alternatives: string[];
  strategicIdea: string;
}

export interface MasterNoticeResponse {
  beginner: string;
  intermediate: string;
  master: string;
  keyTakeaway: string;
}

export interface BlunderWarning {
  isBlunder: boolean;
  severity: 'warning' | 'critical';
  warningMessage: string;
  hint: string;
}

export interface GameSettings {
  boardTheme: string;
  pieceTheme: string;
  soundEnabled: boolean;
  coachVerbosity: 'minimal' | 'standard' | 'detailed';
  coachFrequency: 'every_move' | 'critical_moments' | 'on_demand';
  blunderPrevention: boolean;
  whiteHintsEnabled: boolean;
  blackHintsEnabled: boolean;
  autoQueen: boolean;
}


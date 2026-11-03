import { 
  OpponentIntent, 
  MoveExplanation, 
  MasterNoticeResponse, 
  BlunderWarning, 
  ChessBoardFacts 
} from '@thinkchess/chess-core';

export interface CoachingProvider {
  name: string;
  generateOpponentIntent(facts: ChessBoardFacts, lastMoveSan: string, ratingBand: string): Promise<OpponentIntent>;
  generateMoveExplanation(facts: ChessBoardFacts, moveSan: string, evalDelta: number, ratingBand: string): Promise<MoveExplanation>;
  generateMasterNotice(facts: ChessBoardFacts, ratingBand: string): Promise<MasterNoticeResponse>;
  generateBlunderWarning(facts: ChessBoardFacts, proposedMoveUci: string, evalDropCp: number, ratingBand: string): Promise<BlunderWarning>;
  generateThoughtReview(fen: string, userThought: string, bestMove: string, movePlayed: string): Promise<{
    verdict: string;
    coachFeedback: string;
    taggedHabits: string[];
    actionableTip: string;
  }>;
}

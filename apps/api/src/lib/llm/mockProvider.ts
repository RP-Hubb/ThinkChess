import { CoachingProvider } from './provider.js';
import { 
  OpponentIntent, 
  MoveExplanation, 
  MasterNoticeResponse, 
  BlunderWarning, 
  ChessBoardFacts 
} from '@thinkchess/chess-core';

export class MockCoachingProvider implements CoachingProvider {
  name = 'MockCoachingProvider';

  async generateOpponentIntent(facts: ChessBoardFacts, lastMoveSan: string, ratingBand: string): Promise<OpponentIntent> {
    const changes: string[] = [];
    const threats: string[] = [];
    const checklist: string[] = [];

    // Analyze attacked friendly pieces
    const attackedFriendly = facts.sideToMove === 'w' ? facts.attackedPieces.white : facts.attackedPieces.black;
    const undefendedFriendly = facts.sideToMove === 'w' ? facts.undefendedPieces.white : facts.undefendedPieces.black;

    if (facts.isCheck) {
      changes.push(`Opponent gave check with ${lastMoveSan}!`);
      threats.push(`Direct king attack: you must address this check immediately.`);
      checklist.push('Can you capture the checking piece?', 'Can you block the check?', 'Where can the king safely move?');
    } else {
      changes.push(`Opponent advanced ${lastMoveSan}, shifting the board tension.`);
    }

    if (attackedFriendly.length > 0) {
      threats.push(`Opponent is exerting pressure on square(s): ${attackedFriendly.slice(0, 3).join(', ')}.`);
    } else {
      threats.push('No direct capture is threatened this turn, but opponent is coordinating pieces.');
    }

    if (undefendedFriendly.length > 0) {
      threats.push(`Notice that piece(s) on ${undefendedFriendly.slice(0, 2).join(', ')} are currently undefended.`);
      checklist.push(`Verify if ${undefendedFriendly[0]} is in danger of being tactically trapped.`);
    }

    if (facts.openFiles.length > 0) {
      changes.push(`The ${facts.openFiles.join(', ')}-file is open.`);
      checklist.push(`Consider if opponent plans to contest the open ${facts.openFiles[0]}-file.`);
    }

    checklist.push('Before responding, check: What did their piece stop defending when it moved?');

    return {
      summary: `Opponent played ${lastMoveSan}.`,
      whatChanged: changes,
      threats,
      opponentPlan: 'Improve piece harmony, stake space, and capitalize on any tactical oversights.',
      vulnerablePieces: undefendedFriendly.length > 0 ? undefendedFriendly.slice(0, 3) : ['No critically loose pieces.'],
      preMoveChecklist: checklist,
      tacticalMotifs: facts.isCheck ? ['Check', 'Forcing Move'] : ['Piece Coordination', 'Positional Regrouping'],
    };
  }

  async generateMoveExplanation(facts: ChessBoardFacts, moveSan: string, evalDelta: number, ratingBand: string): Promise<MoveExplanation> {
    return {
      quality: evalDelta <= 15 ? 'best' : evalDelta <= 45 ? 'good' : evalDelta <= 110 ? 'inaccuracy' : 'mistake',
      title: `Tactical & Strategic Overview: ${moveSan}`,
      explanation: `By playing ${moveSan}, you influence the central squares and initiate tactical development. Maintaining piece harmony is critical.`,
      alternatives: ['Developing another minor piece was also a strong positional candidate.'],
      strategicIdea: 'Piece activity and central territory control.',
    };
  }

  async generateMasterNotice(facts: ChessBoardFacts, ratingBand: string): Promise<MasterNoticeResponse> {
    const undefended = facts.sideToMove === 'w' ? facts.undefendedPieces.white : facts.undefendedPieces.black;
    const enemyUndefended = facts.sideToMove === 'w' ? facts.undefendedPieces.black : facts.undefendedPieces.white;

    return {
      beginner: `Material balance: White ${facts.material.white} pts vs Black ${facts.material.black} pts. Check: ${facts.isCheck ? 'Yes' : 'No'}.`,
      intermediate: undefended.length > 0 
        ? `Undefended piece alert on square(s) ${undefended.join(', ')}. Keep an eye on tactical forks.`
        : `Pieces are solidly defended. Look for candidate moves that challenge the opponent's center.`,
      master: enemyUndefended.length > 0
        ? `Opponent has loose pieces on ${enemyUndefended.join(', ')}. Tactical leverage and pawn levers can pry open lines to exploit them.`
        : `Examine the pawn structure and open files (${facts.openFiles.length ? facts.openFiles.join(', ') : 'none yet'}). Seek permanent outpost squares for your knights.`,
      keyTakeaway: 'Always identify undefended pieces on both sides before formulating a multi-move plan.',
    };
  }

  async generateBlunderWarning(facts: ChessBoardFacts, proposedMoveUci: string, evalDropCp: number, ratingBand: string): Promise<BlunderWarning> {
    return {
      isBlunder: evalDropCp > 200,
      severity: evalDropCp > 400 ? 'critical' : 'warning',
      warningMessage: `Pause before playing this move. Moving here leads to a significant evaluation swing (-${(evalDropCp / 100).toFixed(1)} pawns).`,
      hint: 'Check if this move leaves any piece undefended or exposes your king to a tactical fork.',
    };
  }

  async generateThoughtReview(fen: string, userThought: string, bestMove: string, movePlayed: string): Promise<{
    verdict: string;
    coachFeedback: string;
    taggedHabits: string[];
    actionableTip: string;
  }> {
    return {
      verdict: 'Cognitive Review Complete',
      coachFeedback: `You stated: "${userThought}". While attacking or pushing forward is a natural impulse, the engine points out that ${bestMove} was more precise because it solidifies king safety and prevents counterplay. Strong players always verify their defenses before attacking.`,
      taggedHabits: ['Tunnel Vision Attack', 'Overvaluing Immediate Initiative'],
      actionableTip: 'Before committing to an aggressive piece attack, scan your own back ranks for loose pieces.',
    };
  }
}

export const activeCoachingProvider: CoachingProvider = new MockCoachingProvider();

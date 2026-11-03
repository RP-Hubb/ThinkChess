import { BotPersonalityId, BotProfile, BotDifficulty } from './types.js';

export const BOT_PERSONALITIES: Record<BotPersonalityId, BotProfile> = {
  'solid-defender': {
    id: 'solid-defender',
    name: 'Gareth the Shield',
    avatar: '🛡️',
    rating: 1200,
    style: 'Prophylactic & Solid',
    description: 'Patient and unyielding. Gareth prioritizes piece safety, eliminates opponent tactical threats, and waits for overextended attacks.',
    tagline: 'Defend first, strike when the opponent overreaches.',
    depth: 10,
    centipawnTolerance: 30,
    blunderChance: 0.05,
  },
  'tactical-attacker': {
    id: 'tactical-attacker',
    name: 'Vanya the Striker',
    avatar: '⚔️',
    rating: 1400,
    style: 'Tactical & Dynamic',
    description: 'Sharp, relentless calculator. Hunts down forks, pins, and discovered attacks. Will sacrifice small material for active piece coordination.',
    tagline: 'Always look for the forcing tactical sequence.',
    depth: 12,
    centipawnTolerance: 40,
    blunderChance: 0.08,
  },
  'aggressive-player': {
    id: 'aggressive-player',
    name: 'Roxie the Tempest',
    avatar: '🔥',
    rating: 1300,
    style: 'Aggressive & Initiative-Driven',
    description: 'Relentless forward momentum. Pushes kingside pawns, opens diagonal levers, and forces chaotic positions.',
    tagline: 'Seize the initiative and never step backwards.',
    depth: 10,
    centipawnTolerance: 60,
    blunderChance: 0.12,
  },
  'positional-player': {
    id: 'positional-player',
    name: 'Karpovian Magnus',
    avatar: '♟️',
    rating: 1600,
    style: 'Positional & Strategic',
    description: 'Squeezes tiny advantages. Fixates on weak squares, color complexes, outposts, and backward enemy pawns.',
    tagline: 'A weak square is a permanent home for a knight.',
    depth: 14,
    centipawnTolerance: 20,
    blunderChance: 0.03,
  },
  'endgame-specialist': {
    id: 'endgame-specialist',
    name: 'Elena the Finisher',
    avatar: '⏳',
    rating: 1500,
    style: 'Endgame Mastery',
    description: 'Welcomes piece simplifications. Elena navigates rook and pawn endgames with precision and active king centralization.',
    tagline: 'Simplification into a winning endgame is pure chess art.',
    depth: 13,
    centipawnTolerance: 25,
    blunderChance: 0.04,
  },
  'opening-explorer': {
    id: 'opening-explorer',
    name: 'Dante the Scholar',
    avatar: '📜',
    rating: 1100,
    style: 'Theoretical & Unorthodox',
    description: 'Plays rich and diverse opening lines from the Vienna to the King’s Indian, introducing unconventional ideas.',
    tagline: 'Every opening tells a different strategic story.',
    depth: 9,
    centipawnTolerance: 50,
    blunderChance: 0.10,
  },
};

export const DIFFICULTY_CONFIGS: Record<BotDifficulty, {
  depth: number;
  maxCentipawnLoss: number;
  blunderProbability: number;
  ratingEstimate: number;
}> = {
  beginner: {
    depth: 3,
    maxCentipawnLoss: 120,
    blunderProbability: 0.25,
    ratingEstimate: 600,
  },
  easy: {
    depth: 5,
    maxCentipawnLoss: 75,
    blunderProbability: 0.15,
    ratingEstimate: 900,
  },
  casual: {
    depth: 8,
    maxCentipawnLoss: 45,
    blunderProbability: 0.08,
    ratingEstimate: 1200,
  },
  club: {
    depth: 12,
    maxCentipawnLoss: 25,
    blunderProbability: 0.03,
    ratingEstimate: 1500,
  },
  intermediate: {
    depth: 15,
    maxCentipawnLoss: 10,
    blunderProbability: 0.01,
    ratingEstimate: 1800,
  },
};


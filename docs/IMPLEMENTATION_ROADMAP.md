# ThinkChess — Implementation Roadmap

This roadmap governs the milestone-based development of ThinkChess from initial foundation to production release.

---

## Milestone 0: Foundation & Environment Setup
- **Objective**: Establish the monorepo architecture, build pipeline, shared packages, database foundation, design tokens, and documentation.
- **Key Tasks**:
  - [x] Create project documentation suite in `docs/`.
  - [ ] Initialize monorepo structure with npm workspaces (`apps/web`, `apps/api`, `packages/chess-core`).
  - [ ] Configure Vite, React 18/19, TypeScript, Tailwind CSS, Lucide React in `apps/web`.
  - [ ] Configure Express, TypeScript, Zod, and Prisma in `apps/api`.
  - [ ] Create shared types and chess utilities in `packages/chess-core`.
  - [ ] Set up design system tokens and theme provider.
- **Acceptance Criteria**:
  - Web client builds and runs without errors.
  - Backend API server initializes and responds to `/api/health`.
- **Status**: **IN PROGRESS**

---

## Milestone 1: Playable Chess Core
- **Objective**: Provide an interactive, 100% rule-compliant chess board with game controls, move history, and audio feedback.
- **Key Tasks**:
  - [ ] Integrate `react-chessboard` with `chess.js` game state machine.
  - [ ] Implement legal move highlights, check indicators, and last move highlights.
  - [ ] Add pawn promotion modal (Queen, Rook, Bishop, Knight).
  - [ ] Add sound effects for move, capture, check, castle, and game over.
  - [ ] Build move history list with clickable navigation (jump to any prior ply).
  - [ ] Add game controls: Flip Board, Resign, Restart, Undo (practice mode).
  - [ ] Implement FEN / PGN import and export modals.
  - [ ] Add game clock support with configurable time controls.
- **Acceptance Criteria**:
  - All standard chess rules work accurately (en passant, castling, promotion, draws).
  - Board is responsive, accessible, and renders at 60fps.
- **Status**: Pending (Starts immediately after M0)

---

## Milestone 2: Stockfish Engine & AI Bots
- **Objective**: Integrate client-side Stockfish WASM Web Worker to provide instantaneous, offline-capable AI play with distinct personalities and difficulty levels.
- **Key Tasks**:
  - [ ] Set up Stockfish WASM Web Worker with standard UCI communication.
  - [ ] Implement dynamic evaluation stream (centipawns and mate-in-N).
  - [ ] Calibrate 5 difficulty levels (Beginner to Intermediate) via search depth, candidate pool, and controlled noise.
  - [ ] Implement 6 bot personalities (Solid Defender, Tactical Attacker, Aggressive Player, Positional Player, Endgame Specialist, Opening Explorer).
  - [ ] Build bot selection screen with avatar, style description, and rating preview.
- **Acceptance Criteria**:
  - Bot always plays valid legal moves without freezing UI thread.
  - Bot personalities visibly exhibit distinct tactical/positional tendencies.
- **Status**: Pending

---

## Milestone 3: Live AI Coaching & Opponent Intent
- **Objective**: Create the real-time pedagogical coach panel that breaks down opponent moves, highlights strategic ideas, and catches catastrophic blunders.
- **Key Tasks**:
  - [ ] Build docked coach panel with expandable verbosity controls.
  - [ ] Build Opponent Intent Detection card (What changed? Threats? Likely plan? Checklist).
  - [ ] Implement Blunder Prevention interceptor modal with threshold sensitivity.
  - [ ] Implement modular AI Coaching service layer with structured JSON schema.
  - [ ] Connect deterministic `Chess Fact Extractor` to prompt templates.
- **Acceptance Criteria**:
  - Coach explanations provide concrete board coordinates and accurate facts.
  - Blunder prevention warns the user on critical errors before committing.
- **Status**: Pending

---

## Milestone 4: Post-Game Analysis & Evaluation Replay
- **Objective**: Provide a comprehensive post-game report detailing accuracy, move classifications, turning points, and interactive graph navigation.
- **Key Tasks**:
  - [ ] Implement batch engine analysis of all game plies.
  - [ ] Calculate accuracy percentage for White and Black using centipawn loss mapping.
  - [ ] Classify each move (Best, Excellent, Good, Inaccuracy, Mistake, Blunder, Missed Win, Brilliant).
  - [ ] Render interactive SVG evaluation graph synchronized with board navigation.
  - [ ] Generate game phase summary (Opening, Middlegame, Endgame).
- **Acceptance Criteria**:
  - Clicking any move on the timeline or eval graph updates the board instantly.
  - Accuracy scores are realistic, reproducible, and mathematically grounded.
- **Status**: Pending

---

## Milestone 5: Learning Features (Self-Play, Thought Replay, Master Notice)
- **Objective**: Implement the signature differentiators of ThinkChess.
- **Key Tasks**:
  - [ ] Build Self-Play Learning Mode with **independent hint settings** (White hints ON / Black hints OFF, etc.).
  - [ ] Implement "What Would a Master Notice?" 3-tier cognitive lens.
  - [ ] Implement Thought Replay: automatic selection of 3–8 critical moments, intention prompt, and cognitive reasoning evaluation.
  - [ ] Build Thinking Profile dashboard tracking recurring strengths and weaknesses.
- **Acceptance Criteria**:
  - Self-play operates smoothly with distinct hint configurations per side.
  - Thought Replay captures user thought before AI review and updates profile tags.
- **Status**: Pending

---

## Milestone 6: Phase 2 Trainers (Architecture Preserved)
- **Features**: Candidate Move Trainer, Think Ahead Trainer, Tactical Pattern Trainer, Opening Memory Trainer.
- **Status**: Deferred to Phase 2 (Data models and schemas preserved).

---

## Milestone 7: Hardening, Polish & Production Verification
- **Objective**: Comprehensive test coverage, accessibility audit, performance tuning, and end-to-end verification.
- **Status**: Pending

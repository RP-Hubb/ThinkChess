# ThinkChess — Master Project Task & Living Specification

## 1. Product Vision & Core Objectives
**ThinkChess** is a next-generation web application designed to teach chess players **how to think** during games rather than merely showing them engine-calculated best moves. 

Most chess platforms focus on playing games, memorizing opening books, or reviewing opaque centipawn engine evaluations. ThinkChess addresses the cognitive gap: understanding opponent threats, uncovering strategic plans, candidate move selection, tactical blunder awareness, structured calculation, and post-game introspection through **Thought Replay**.

### Core Product Philosophy
> *"Don't just tell me what move to play. Teach me why I should play it and how to find it myself."*

Every UX decision, coaching prompt, and engine integration in ThinkChess is guided by this philosophy.

---

## 2. Complete Feature Matrix

### V1 MVP Scope
1. **Full Chess Game Engine**:
   - Complete FIDE chess rules via `chess.js` (validation, en passant, castling, promotion, check/checkmate, stalemate, 50-move rule, threefold repetition, insufficient material).
   - High-fidelity interactive board using `react-chessboard` with custom square styles, move indicators, arrows, and sound effects.
   - Move history navigation, FEN / PGN import and export, board flipping, resignation, restart, and state persistence.
2. **Stockfish AI Opponents**:
   - Integrated Stockfish WASM Web Worker.
   - 5 Difficulty levels: Beginner (400-800), Easy (800-1100), Casual (1100-1400), Club (1400-1700), Intermediate (1700-2000).
   - 6 Bot Personalities: Solid Defender, Tactical Attacker, Aggressive Player, Positional Player, Endgame Specialist, Opening Explorer.
   - Controlled engine noise, candidate move weighting, and deliberate inaccuracies (no random blunders).
3. **Live AI Coach**:
   - Side-by-side coaching panel explaining moves in plain, instructive language.
   - Coaching frequency modes: Every move, Critical moments only, On demand.
   - Verbosity tiers: Minimal, Standard, Detailed.
   - Structured explanation of tactical threats, positional ideas, piece coordination, and evaluation impact.
4. **Opponent Intent Detection**:
   - Automated breakdown of what the opponent's move changed, what they threaten, their strategic plan, vulnerable friendly pieces, and what to verify before moving.
5. **Blunder Prevention Mode**:
   - Configurable pre-move warning when a player's proposed move triggers a catastrophic evaluation drop or hangs material, prompting them to reconsider without immediately giving away the solution.
6. **Self-Play Learning Mode**:
   - Control White only, Black only, or both White & Black.
   - **Independent hint and coaching controls** for White and Black.
7. **Post-Game Analysis & Report**:
   - Full game evaluation graph, accuracy scores (White/Black), move classification (Best, Excellent, Good, Inaccuracy, Mistake, Blunder, Missed Win, Brilliant).
   - Turning point identification and phase breakdown (Opening, Middlegame, Endgame).
8. **Thought Replay & Decision Review**:
   - Post-game review of 3–8 critical moments.
   - Asks the user what they were thinking, captures their response, and compares their cognitive reasoning with verified board facts and engine truths.
9. **"What Would a Master Notice?"**:
   - On-demand 3-tier cognitive lens for any position: Beginner, Intermediate, and Master perspectives.
10. **Thinking Profile**:
    - Long-term dashboard tracking cognitive strengths (tactical alertness, king safety) and weaknesses (tunnel vision, ignoring threats, premature attacks).

### Phase 2 Scope (Preserved in Architecture)
- **Candidate Move Trainer**: Interactive candidate selection before moving, scored against engine top lines.
- **Think Ahead Trainer**: Structured deep calculation visualization (2 plies up to 7 moves).
- **Tactical Pattern Trainer**: Personalized puzzle queue generated from user blunders.
- **Opening Memory Trainer**: Spaced-repetition opening repertoire rehearsal.
- **Advanced Personalization**: Longitudinal thinking trends and weekly coaching reports.

### Excluded from V1
- Online multiplayer.
- Voice coaching & speech-to-text.
- Public social networks and tournaments.

---

## 3. Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18/19, TypeScript, Vite, Tailwind CSS, React Router, Zustand, React Chessboard, Lucide React |
| **Chess Engine** | Stockfish 16/17 WASM running in dedicated Web Worker; chess.js for rule validation & FEN/PGN handling |
| **Backend API** | Node.js, Express, TypeScript, Zod validation |
| **Database & ORM** | PostgreSQL, Prisma ORM |
| **AI Coaching Layer** | Modular LLM abstraction (OpenAI / Anthropic / Gemini / Mock service) with strict JSON schema validation |
| **Testing** | Vitest, React Testing Library, Playwright, Supertest |

---

## 4. Architectural Principles & Inviolable Rules
1. **Engine as Sole Source of Truth**:
   - Large Language Models **NEVER** generate moves, validate legality, or fabricate centipawn evaluations.
   - Stockfish WASM and `chess.js` compute all facts. The LLM acts purely as a translator and teacher.
2. **Zero Unverified Claims**:
   - No tactical assertion is shown to the user unless mathematically supported by the engine principal variations.
3. **Independent Hints in Self-Play**:
   - Self-play must support independent hint toggles and coaching configurations for White and Black.
4. **Thought Capture Before Assessment**:
   - In Thought Replay, the app never guesses the user's intent—the user must write their reasoning before receiving AI evaluation.
5. **Anti-UI Slop**:
   - Dark-first, minimalist, premium aesthetic. No gratuitous glowing gradients, glassmorphism slop, or decorative non-functional buttons.

---

## 5. Implementation Milestones & Status

| Milestone | Title | Focus Area | Status |
|---|---|---|---|
| **Milestone 0** | Foundation | Monorepo, tooling, database schema, design system, docs | **IN PROGRESS** |
| **Milestone 1** | Chess Core | Board, chess.js rules, move history, FEN/PGN, sound, clocks | Pending |
| **Milestone 2** | Stockfish & AI Bots | Web Worker engine, bot difficulty levels, personalities | Pending |
| **Milestone 3** | Live Coaching | Intent detection, move explanations, blunder warnings | Pending |
| **Milestone 4** | Post-Game Analysis | Accuracy, move classifications, evaluation graph, reports | Pending |
| **Milestone 5** | Learning Features | Self-play independent hints, Thought Replay, Master Notice | Pending |
| **Milestone 6** | Phase 2 Trainers | Candidate Move, Think Ahead, Puzzles, Opening Memory | Phase 2 |
| **Milestone 7** | Quality & Release | E2E tests, accessibility, security, deployment | Pending |

---

## 6. Current Implementation Focus
- Setting up the monorepo workspace (`apps/web`, `apps/api`, `packages/chess-core`).
- Establishing the complete documentation suite in `docs/`.
- Building and running Milestone 0 and launching Milestone 1 with an interactive, verified chessboard.

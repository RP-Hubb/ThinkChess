# ThinkChess — Product Requirements Document (PRD)

**Product Name:** ThinkChess  
**Document Status:** Approved Living Specification  
**Platforms:** Web (Desktop-first, fully responsive mobile)  
**V1 Target Release:** Web MVP  
**Target Audience:** Chess beginners (0–800), casual improvers (800–1400), and intermediate club players (1400–2000)

---

## 1. Executive Summary & Vision
ThinkChess is an intelligent chess learning platform built around a single paradigm shift: **teaching players how to think during a game, rather than simply presenting the engine's best move.**

While existing chess platforms offer raw engine evaluations, tactic puzzle rush, or generic game play, they leave a wide cognitive gap between numeric evaluations and human thought processes. ThinkChess fills this gap with an active, text-based chess coach that breaks down opponent intent, highlights hidden threats, explains strategic master concepts, prevents game-ending blunders before they happen, and guides post-game reflection via **Thought Replay**.

### Core Product Philosophy
> *"Don't just tell me what move to play. Teach me why I should play it and how to find it myself."*

---

## 2. Personas & Core Problem Statements

### Persona 1: The Frustrated Beginner (Rating: 0–800)
- **Pain Points:** Frequently leaves pieces undefended (hanging); suffers one-move blunders; finds Stockfish +3.2 or -4.1 evaluations completely opaque; plays without considering what the opponent is planning.
- **Jobs to be Done:**
  - Build the habit of board scanning before moving.
  - Understand why an opponent's move is dangerous.
  - Receive real-time blunder warnings when hanging high-value pieces.

### Persona 2: The Plateaued Casual (Rating: 800–1400)
- **Pain Points:** Solves tactical puzzles in isolation but misses them during real games; launches premature single-piece attacks that fail; overlooks opponent counter-threats.
- **Jobs to be Done:**
  - Practice structured candidate move selection.
  - Discern between direct tactical threats and long-term strategic plans.
  - Review critical turning points in post-game analysis through Thought Replay.

### Persona 3: The Intermediate Club Competitor (Rating: 1400–2000)
- **Pain Points:** Calculates shallowly; misevaluates complex piece trades and pawn structures; suffers from recurring cognitive habits (e.g., tunnel vision on initiative).
- **Jobs to be Done:**
  - Understand deep positional ideas via "What Would a Master Notice?".
  - Calculate multi-ply variations accurately without guessing.
  - Track cognitive thinking patterns in a personalized Thinking Profile.

---

## 3. Product Scope & Constraints

### In V1 Scope
1. **Full-Fidelity FIDE Chess Engine & Board**: Complete legal move validation, checks, checkmates, stalemates, castling, en passant, promotions, 50-move rule, threefold repetition, draw by insufficient material, timers, sound effects, move history, PGN/FEN import/export.
2. **Play vs AI Bots**: Stockfish WASM driven with 5 difficulty tiers and 6 distinct playing personalities with calibrated candidate selection and humanized mistakes.
3. **Live AI Coach**: Real-time contextual explanations for moves made by both the player and the AI, explaining strategic rationale, tactical repercussions, and positional shifts.
4. **Opponent Intent Detection**: Systematic breakdown of what the opponent's move changed, active threats, strategic plans, vulnerable pieces, and checklist before responding.
5. **Blunder Prevention System**: Configurable pre-move sanity check that alerts players when a move drops critical evaluation or hangs material.
6. **Self-Play Learning Mode**: Dual-board control with **independent hint and coaching configurations** for White and Black.
7. **Post-Game Analysis & Report**: Full accuracy score calculation, move quality classifications, evaluation chart, phase-by-phase breakdown, and turning point identification.
8. **Thought Replay**: Post-game interactive retrospective where players input their thoughts on critical positions and receive feedback on their decision-making process.
9. **"What Would a Master Notice?"**: Multi-tier cognitive breakdown (Beginner, Intermediate, Master) for any position on the board.
10. **Thinking Profile**: Longitudinal dashboard identifying cognitive habits, recurring blind spots, strengths, and targeted training recommendations.

### Explicitly Excluded from V1
- Online multiplayer (P2P or server-relayed human-vs-human).
- Voice recognition or text-to-speech coaching.
- Social networks, friend lists, and public leaderboards.
- Live tournament systems.

---

## 4. Functional Specifications

### FR1: Chess Gameplay Engine
- **Legal Validation**: 100% compliant with FIDE chess rules via `chess.js`.
- **Board UI**: Powered by `react-chessboard` with smooth piece dragging, click-to-move, highlighted legal moves, last move highlights, check indicators, and board flip capability.
- **Promotion Handling**: Interactive modal allowing selection between Queen, Rook, Bishop, Knight.
- **Game Clock**: Configurable time controls (Untimed, 3 min Blitz, 5 min Blitz, 10 min Rapid, 15+10 Rapid) with flag drop detection.
- **State Management**: Resilient state storing FEN history, PGN, move timestamps, and evaluation snapshots.

### FR2: Stockfish WASM Bot Engine
- Running locally in a Web Worker to ensure sub-millisecond responsiveness without incurring unnecessary API server bills for basic moves.
- **Difficulty Settings**:
  - *Beginner* (~600 Elo): Depth 2–3, large blunder allowance, simple tactical oversights.
  - *Easy* (~900 Elo): Depth 4–5, moderate candidate selection noise.
  - *Casual* (~1200 Elo): Depth 6–8, solid basic play with occasional positional inaccuracies.
  - *Club* (~1500 Elo): Depth 10–12, tactical awareness, fewer tactical mistakes.
  - *Intermediate* (~1800 Elo): Depth 14–16, positional consistency and endgame technique.
- **Bot Personalities**:
  - *Solid Defender*: Favors prophylactic moves, piece trades, and pawn chain solidification.
  - *Tactical Attacker*: Prioritizes lines with high tactical complexity and piece activity toward the enemy king.
  - *Aggressive Player*: Sacrifices pawn structure for initiative and open lines.
  - *Positional Player*: Focuses on weak squares, outposts, pawn levers, and open files.
  - *Endgame Specialist*: Seeks simplified structures transitioning to favorable endgames.
  - *Opening Explorer*: Plays rare, unorthodox, and diverse opening variations.

### FR3: Live AI Coach
- Docked beside the board with minimal, standard, or detailed verbosity.
- Explains:
  - Purpose of the played move.
  - Evaluation change and impact on position.
  - Tactical threats created or overlooked.
  - Strategic concepts (e.g., outpost creation, pawn lever, open file control).

### FR4: Opponent Intent Detection
- Executed on every opponent move:
  - **What changed?** (e.g., "The opponent's queen stepped onto the d-file").
  - **What is threatened?** (e.g., "Direct threat against your d4 pawn").
  - **What is the opponent's likely plan?** (e.g., "Piling up on the isolated queen pawn").
  - **Which pieces are vulnerable?** (e.g., "Your knight on c3 is pinned and cannot defend d4").
  - **Pre-move checklist:** (e.g., "1. Can you reinforce d4? 2. Can you break the pin?").

### FR5: Blunder Prevention Mode
- Intercepts player moves before committing them to the board.
- If evaluation drops by more than the threshold (e.g. >200 centipawns or turns winning to losing/drawing):
  - Triggers a pause modal: *"Pause before making this move. Your knight on f3 becomes undefended after ...Bxc3. Would you like to reconsider?"*
  - Options: "Reconsider Move" (cancels move), "View Hint", or "Play Anyway".

### FR6: Self-Play Learning Mode
- Allows single-player study controlling White, Black, or both sides.
- **Crucial Requirement**: Independent hint and coach toggles.
  - e.g., White hints ON, Black hints OFF (to test defenses against engine-suggested attacks).

### FR7: Post-Game Analysis & Report
- Automated analysis calculating White & Black accuracy percentages (0–100%).
- Categorization of every move:
  - *Best*: Engine #1 move.
  - *Excellent*: Marginal difference (<15 cp loss).
  - *Good*: Solid move (<40 cp loss).
  - *Inaccuracy*: 40–100 cp loss.
  - *Mistake*: 100–250 cp loss.
  - *Blunder*: >250 cp loss or lost winning advantage.
  - *Missed Win*: Overlooked mate or decisive tactic.
  - *Brilliant*: Deep piece sacrifice that yields winning advantage.
- Interactive evaluation graph synchronized with board position.

### FR8: Thought Replay
- Automatically detects 3–8 turning points per completed game.
- Presents the board and prompts: *"At move 14, you played Be3. What was your main idea?"*
- Player writes their reasoning in their own words.
- AI coach assesses the reasoning against engine facts and classifies cognitive patterns.

### FR9: "What Would a Master Notice?"
- Single-click feature on any board state providing 3 perspectives:
  - *Beginner*: Basic piece count, obvious captures, direct checks.
  - *Intermediate*: Undefended pieces, basic forks/pins, open files.
  - *Master*: Pawn weaknesses, outposts, piece harmony, long-term pawn majority plans.

### FR10: Thinking Profile
- Aggregates insights over games into a cognitive dashboard:
  - *Identified Strengths*: e.g., "Vigilant king safety", "Finds tactical forks".
  - *Identified Weaknesses*: e.g., "Tunnel vision attacks", "Misses opponent counter-threats".
  - *Recommended Training*: Actionable practice paths.

---

## 5. Non-Functional Requirements
- **Performance**: Move validation < 10ms. Board drag/drop 60fps.
- **Reliability**: Safe fallback if LLM service is delayed or offline (engine evaluation remains accessible).
- **Security**: Environment variable encapsulation for all LLM API keys. JWT authentication for user session management.
- **Design Standard**: Deep charcoal dark mode, high contrast, clean typography, zero UI clutter.

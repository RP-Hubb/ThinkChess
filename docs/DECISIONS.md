# ThinkChess — Architectural Decision Records (ADRs)

---

## ADR 001: Dual-Tier Stockfish Architecture (Client Web Worker + Server Worker)
- **Status**: Accepted
- **Context**: ThinkChess requires real-time bot move generation, continuous evaluation bar feedback, pre-move blunder warnings, and deep post-game game analysis. Running all engine calculations through remote API servers introduces network latency (100–300ms) and prohibitive cloud compute expenses. Conversely, running deep 30-ply full-game batch analysis in the browser can drain mobile batteries and lock memory.
- **Decision**: 
  - Deploy **Tier 1: Client-Side Stockfish WASM Web Worker** for live gameplay, interactive bot turns, blunder checks, and live evaluation bars.
  - Deploy **Tier 2: Server-Side Engine Worker** in Node.js for batch post-game analysis, persistent move classification caching, and background puzzle generation.
- **Consequences**:
  - Offline play capability for client vs bot games.
  - Sub-10ms UI responsiveness during gameplay.
  - Server compute is reserved exclusively for completed games requiring persistent reports.

---

## ADR 002: Inviolable Boundary: LLMs Never Calculate Moves or Evaluations
- **Status**: Accepted
- **Context**: General-purpose LLMs hallucinate illegal moves, miscalculate tactical tactics, and produce incorrect centipawn numbers if asked to reason directly on chess boards without verification.
- **Decision**: Stockfish and `chess.js` are the sole sources of truth for:
  - Move legality
  - Best moves and candidate lines
  - Centipawn and mate evaluations
  - Tactical motifs and blunder triggers
  The LLM receives structured, deterministic JSON fact sheets produced by the `Chess Fact Extractor` and acts strictly as a pedagogical teacher and translator.
- **Consequences**: Zero chess hallucinations in coaching text. The application never teaches false tactical assertions.

---

## ADR 003: Monorepo Architecture with npm Workspaces
- **Status**: Accepted
- **Context**: Frontend and backend share chess types, evaluation data structures, bot configuration parameters, and classification thresholds. Duplicating these across separate repos risks drift.
- **Decision**: Use native npm workspaces:
  - `apps/web`: Vite + React + Tailwind + React Chessboard
  - `apps/api`: Node.js + Express + TypeScript + Prisma
  - `packages/chess-core`: Shared types, evaluation math, chess fact extractors, bot personalities.
- **Consequences**: Single repository setup, shared type safety, atomic commits across full-stack features.

---

## ADR 004: Phase 2 Scope Boundaries vs V1 MVP Focus
- **Context**: The product PRD includes extensive training modules (Candidate Move Trainer, Think Ahead Trainer, Tactical Pattern Trainer, Opening Memory Trainer). Trying to ship all trainers concurrently risks shipping an incomplete or superficial core game.
- **Decision**: As defined in the master project instructions, V1 prioritizes:
  1. Complete rule-compliant chess engine & board
  2. Stockfish bots with 5 difficulties & 6 personalities
  3. Live AI Coach with Opponent Intent Detection
  4. Pre-move Blunder Prevention
  5. Self-Play Learning Mode with **independent White/Black hints**
  6. Post-Game Analysis with accuracy & move classifications
  7. Thought Replay with intention capture
  8. "What Would a Master Notice?"
  9. Thinking Profile dashboard
  The database schema and API contracts preserve full models for Phase 2 trainers so they can be unlocked seamlessly without structural rewrites.
- **Consequences**: Deep, polished MVP release without technical debt.

---

## ADR 005: Independent Hint Controls for Self-Play
- **Status**: Accepted
- **Context**: Players frequently use self-play to study specific defensive setups or opening rebuttals against engine attacks. If hints are all-or-nothing, players cannot test their unassisted defense against an engine-assisted attack or vice-versa.
- **Decision**: Provide separate boolean controls in Zustand and user preferences: `whiteHintsEnabled` and `blackHintsEnabled`.
- **Consequences**: Unlocks flexible pedagogical training modes (e.g. testing human defense against Stockfish master lines).

---

## ADR 006: User Intention Must Precede AI Evaluation in Thought Replay
- **Status**: Accepted
- **Context**: Many AI applications guess what a user was trying to do. In chess, guessing often misdiagnoses cognitive errors (e.g. assuming a player saw a tactic and blundered a piece, when in reality they simply didn't see the piece was defended).
- **Decision**: Thought Replay requires the user to input a short explanation of their idea before the AI coach responds.
- **Consequences**: Authentic cognitive feedback; identifies genuine user thinking habits (e.g., "tunnel vision attack" vs "forgot piece was pinned").

---

## ADR 007: Provider-Agnostic LLM Layer with Resilient Mock Fallback
- **Status**: Accepted
- **Context**: Users and development environments may not immediately have active OpenAI, Anthropic, or Gemini API keys configured, or external APIs may experience rate limits.
- **Decision**: Implement a provider interface with support for:
  - External providers (OpenAI, Gemini, Anthropic)
  - Built-in `MockCoachProvider` that generates rich, context-aware chess coaching based directly on the deterministic `Chess Fact Extractor`.
- **Consequences**: The application runs completely and accurately out of the box with zero external credential dependencies, while upgrading to live LLMs seamlessly via `.env`.


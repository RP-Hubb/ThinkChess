# ThinkChess — System Architecture Specification

## 1. High-Level Architectural Overview
ThinkChess is engineered around a strict separation of concerns that ensures chess validity, engine accuracy, and pedagogical clarity.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                 CLIENT                                  │
│                      (React + Vite + Tailwind CSS)                      │
│                                                                         │
│   ┌────────────────────┐    ┌─────────────────┐    ┌────────────────┐   │
│   │  React Chessboard  │    │  Coach Panel UI │    │  Zustand Store │   │
│   └─────────┬──────────┘    └────────┬────────┘    └────────┬───────┘   │
│             │                        │                      │           │
│             ▼                        ▼                      │           │
│   ┌────────────────────┐    ┌─────────────────┐             │           │
│   │      chess.js      │    │  Web Worker     │◄────────────┘           │
│   │  (Rules & State)   │    │  Stockfish WASM │                         │
│   └─────────┬──────────┘    └────────┬────────┘                         │
└─────────────┼────────────────────────┼──────────────────────────────────┘
              │                        │
              │ HTTPS API / JSON       │ Client Analysis Payloads
              ▼                        ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           BACKEND API (Node.js)                         │
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                 Express HTTP Application Router                 │   │
│   │         /api/auth | /api/games | /api/coach | /api/analysis     │   │
│   └────────────────────────────────┬────────────────────────────────┘   │
│                                    │                                    │
│             ┌──────────────────────┴──────────────────────┐             │
│             ▼                                             ▼             │
│   ┌───────────────────────────┐                 ┌───────────────────┐   │
│   │   Chess Fact Extractor    │                 │ Stockfish Worker  │   │
│   │   (Material, Tactics,     │                 │ (Server batch job │   │
│   │    Open Files, Threats)   │                 │  for post-game)   │   │
│   └─────────┬─────────────────┘                 └─────────┬─────────┘   │
│             │                                             │             │
│             ▼                                             │             │
│   ┌───────────────────────────┐                           │             │
│   │    AI Coaching Service    │                           │             │
│   │  - Structured Prompts     │                           │             │
│   │  - JSON Schema Validator  │                           │             │
│   │  - LLM Provider Interface │                           │             │
│   └─────────┬─────────────────┘                           │             │
│             │                                             │             │
└─────────────┼─────────────────────────────────────────────┼─────────────┘
              ▼                                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          PERSISTENCE LAYER                              │
│                      (PostgreSQL + Prisma ORM)                          │
│                                                                         │
│   Users · Games · Moves · EngineLines · CoachMessages · Profiles        │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Inviolable Architectural Boundaries
1. **The LLM Is Not a Chess Engine**:
   - The LLM never receives a raw FEN with the prompt "find the best move".
   - The LLM never invents evaluations, coordinates, or candidate moves.
   - All legal moves, best moves, and centipawn values are produced by `chess.js` and Stockfish.
2. **Deterministic Fact Pipeline**:
   - Before any prompt is dispatched to an AI model, the `Chess Fact Extractor` generates a strictly formatted fact sheet containing:
     - Verified material count.
     - Attacked and undefended friendly/enemy pieces.
     - Pinned pieces and discoverable threats.
     - Stockfish top 3 candidate moves with evaluation delta.
     - King safety status.
   - The LLM is instructed via JSON schema to translate these facts into pedagogical coaching language.
3. **Dual-Tier Stockfish Deployment**:
   - **Tier 1 (Client Web Worker)**: Runs Stockfish 16/17 WASM directly in the user's browser. Used for instantaneous bot moves, live player evaluation bar, and pre-move blunder detection. Zero server latency.
   - **Tier 2 (Server Engine Worker)**: Runs on the Node.js backend for deep post-game batch analysis, asynchronous full-game evaluation graphs, and puzzle extraction.

---

## 3. Frontend Architecture (`apps/web`)

### Directory Layout
```
apps/web/
├── index.html
├── src/
│   ├── assets/              # Piece sets, sound effects, icons
│   ├── components/          # Reusable UI primitives (Button, Modal, Card, Tabs, Badge)
│   ├── features/
│   │   ├── board/           # React Chessboard integration, sound effects, legal highlights
│   │   ├── coach/           # Live coach panel, intent cards, master notice modal
│   │   ├── game/            # Game controls, clocks, bot selectors, move list
│   │   ├── analysis/        # Post-game evaluation graph, accuracy cards, move timeline
│   │   ├── thought-replay/  # Intention prompt, retrospective review UI
│   │   └── profile/         # Thinking Profile charts and weakness list
│   ├── hooks/               # useChessGame, useStockfishWorker, useSound
│   ├── store/               # Zustand slices: gameStore, coachStore, settingsStore
│   ├── services/            # API client (Axios/Fetch), local Stockfish worker bridge
│   ├── types/               # TypeScript interfaces
│   └── App.tsx
```

### State Management Strategy (Zustand)
- `gameStore`: Current FEN, move history (SAN, UCI, FEN before/after), active turn, game status (in_progress, checkmate, draw, resign), clocks, player color.
- `coachStore`: Real-time coach explanations, opponent intent data, blunder warnings, master notice data.
- `settingsStore`: Board theme, piece theme, sound enabled, coach verbosity (minimal/standard/detailed), blunder prevention threshold, independent hint toggles (White / Black).

---

## 4. Backend Architecture (`apps/api`)

### Directory Layout
```
apps/api/
├── src/
│   ├── config/              # Environment variables, constants
│   ├── modules/
│   │   ├── auth/            # JWT auth, user registration, login
│   │   ├── games/           # Game persistence, move logging, game completion
│   │   ├── coach/           # Fact extraction, LLM coaching generation, prompt versions
│   │   ├── analysis/        # Post-game engine worker, accuracy calculator, critical moments
│   │   ├── profile/         # Thinking Profile aggregations and recommendations
│   │   └── engine/          # Server-side Stockfish runner
│   ├── lib/
│   │   ├── prisma.ts        # Prisma client singleton
│   │   ├── chessFacts.ts    # Deterministic board analysis
│   │   └── llm/             # LLM provider abstraction (OpenAI, Gemini, Anthropic, Mock)
│   ├── middleware/          # Auth guard, error handling, rate limiting, request validation
│   └── index.ts             # Express server entry point
```

### AI Coaching Service Layer
The coaching service supports hot-swappable providers:
- `OpenAIProvider`
- `GeminiProvider`
- `AnthropicProvider`
- `MockProvider` (Provides deterministic, intelligent chess advice without needing external API keys during testing/offline use).

All responses are validated against Zod schemas matching the contract in `docs/PRD.md`. If a provider times out or produces invalid JSON, the system falls back to a deterministic rule-based template without crashing the UI.

---

## 5. Shared Package (`packages/chess-core`)
Shared between web and API to prevent code duplication:
- Move classification rules (eval delta thresholds for Best, Good, Inaccuracy, Mistake, Blunder).
- Accuracy calculation algorithms (FIDE-standard centipawn loss sigmoid mapping).
- Board fact extraction utilities.
- Bot personality configurations and candidate selection heuristics.
- Shared TypeScript types for API contracts and chess structures.


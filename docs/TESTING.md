# ThinkChess — Testing Strategy & Specification

## 1. Testing Philosophy
ThinkChess cannot tolerate chess rule errors, incorrect engine evaluations, or broken move validation. Testing is stratified across four layers:
1. **Chess Engine & Math Unit Tests (`packages/chess-core`)**: Legal move invariants, FEN transitions, move classification thresholds, and accuracy calculation.
2. **API & Coaching Integration Tests (`apps/api`)**: Route validation, Prisma mock integration, deterministic fact extraction, and LLM schema compliance.
3. **Frontend Component & Store Tests (`apps/web`)**: Zustand state transitions, board interaction handlers, clock countdowns, and sound hooks.
4. **End-to-End Browser Tests (Playwright)**: Full gameplay loop (pawn moves, checkmate detection, blunder warning modal, Thought Replay submission).

---

## 2. Test Execution Commands

| Scope | Command | Description |
|---|---|---|
| **All Tests** | `npm test` | Runs unit and integration test suites across all workspaces |
| **Chess Core** | `npm --workspace=packages/chess-core test` | Tests rule validation, classification, and fact extractor |
| **API Integration** | `npm --workspace=apps/api test` | Tests Express endpoints, auth guards, and coach pipeline |
| **Web Components** | `npm --workspace=apps/web test` | Tests React components and Zustand stores with Vitest |
| **Playwright E2E**| `npm run test:e2e` | Runs headless browser test suite against live dev server |

---

## 3. Critical Chess Test Scenarios

### Invariant Tests (`packages/chess-core`)
- [ ] **En Passant**: Verify capture executes correctly only on the immediate next ply and updates FEN.
- [ ] **Castling Rights**: Verify castling is prohibited if king is in check, moves through check, or if rook/king previously moved.
- [ ] **Pawn Promotion**: Verify piece upgrades (Q, R, B, N) update the board and generate legal SAN (e.g. `e8=Q#`).
- [ ] **Checkmate vs Stalemate**: Verify distinction when king has no legal moves (Checkmate if in check; Stalemate if not in check).
- [ ] **Threefold Repetition & 50-Move Rule**: Verify automatic draw condition flag.

### Move Classification Accuracy Tests
- [ ] Ensure moves with 0 to 10 cp loss are classified as `best` or `excellent`.
- [ ] Ensure moves dropping > 250 centipawns or converting a winning advantage into a losing state are classified as `blunder`.
- [ ] Verify brilliant sacrifices are only assigned when a piece is intentionally sacrificed for decisive engine evaluation.

### Coaching Schema & Fact Extraction Tests
- [ ] Verify `Chess Fact Extractor` accurately identifies pinned pieces, hanging minor/major pieces, and open files for known positions.
- [ ] Verify that mock and live LLM providers return valid JSON adhering to the Zod schema.

---

## 4. End-to-End Regression Test Suite
1. **Game Start**: User selects Play vs AI -> Selects Casual -> Plays `1. e4` -> Board updates -> AI bot replies within 2 seconds.
2. **Blunder Prevention Trigger**: User in blunder mode makes an intentional hanging move -> Blunder modal interrupts move -> User clicks "Reconsider" -> Board restores position.
3. **Self-Play Hints**: User sets White Hints ON and Black Hints OFF -> Coach suggestions appear only on White's turn.
4. **Thought Replay**: Completed game triggers review -> Critical moment 1 presented -> User submits thought -> AI feedback displayed and tags updated.

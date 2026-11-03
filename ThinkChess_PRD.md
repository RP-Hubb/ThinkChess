# ThinkChess Product Requirements Document

Temporary product name: ThinkChess  
Document status: Draft for implementation planning  
Primary platform: Web  
Future platform: Mobile  
V1 exclusions: Online multiplayer, voice coaching

---

## 1. Executive Summary

ThinkChess is a chess learning platform designed to teach players how to think during a game, not merely what move to play. It combines full chess gameplay, Stockfish-powered analysis, and AI-generated coaching explanations to help beginners, casual players, and intermediate players build stronger decision-making habits.

Most chess apps optimize for playing games, solving puzzles, or reviewing engine lines. ThinkChess focuses on the missing layer between raw engine output and human improvement: understanding plans, threats, candidate moves, calculations, tactical patterns, strategic concepts, and recurring thinking mistakes.

In V1, users will play against configurable AI bots, receive text-based coaching, train candidate moves and calculation, review critical decisions after games, and track personalized improvement areas. The application will use Stockfish for all move generation and evaluation. Large language models will only explain, summarize, classify, and coach based on validated chess engine data and board state.

The product should feel like a personal chess coach sitting beside the user: direct, instructive, encouraging, and focused on building independent thinking.

---

## 2. Product Vision

### Vision Statement

ThinkChess helps chess learners develop the thinking process of stronger players by turning every move, mistake, tactic, and plan into a clear coaching moment.

### Product Principles

1. Teach thinking, not dependency.
   The product should help users ask better chess questions: What changed? What is threatened? What are my candidate moves? What is the opponent planning?

2. Engine first, explanation second.
   All legal moves, best moves, evaluations, blunder detection, and tactical validation must come from chess.js and Stockfish. The LLM converts verified analysis into useful human language.

3. Coach the user at the right moment.
   Live coaching should support active learning without overwhelming the user. Deeper reflection belongs in post-game review.

4. Personalization matters.
   Users should feel the app understands their recurring weaknesses, such as tunnel vision, missed threats, poor candidate move selection, or weak endgame planning.

5. V1 should be deep, not broad.
   ThinkChess V1 should not chase every chess platform feature. It should prove the core coaching loop.

---

## 3. User Personas

### Persona 1: Beginner Learner

Rating range: 0-800  
Motivation: Learn basic chess thinking and stop making obvious mistakes  
Pain points:
- Does not know what to look for in a position
- Misses hanging pieces and direct threats
- Finds engine lines confusing
- Needs simple explanations and repetition

Primary jobs:
- Learn how to scan the board
- Avoid one-move blunders
- Recognize basic tactics
- Understand why a move is good or bad

### Persona 2: Casual Improver

Rating range: 800-1400  
Motivation: Improve online results and understand mistakes  
Pain points:
- Plays too quickly
- Attacks without checking opponent threats
- Knows tactics in puzzles but misses them in games
- Struggles to form plans after the opening

Primary jobs:
- Build candidate move discipline
- Improve tactical pattern recognition
- Understand opponent intent
- Review critical moments after games

### Persona 3: Intermediate Club Player

Rating range: 1400-2000  
Motivation: Improve structured calculation, planning, and consistency  
Pain points:
- Calculates shallowly or inaccurately
- Misjudges strategic positions
- Has opening memory gaps
- Needs targeted training from real game mistakes

Primary jobs:
- Train multi-move calculation
- Compare plans against engine-backed recommendations
- Identify recurring thinking patterns
- Improve opening, endgame, and strategic weaknesses

---

## 4. User Stories

### Gameplay and Coaching

- As a learner, I want to play against AI bots at my level so I can practice without pressure.
- As a learner, I want the coach to explain my move so I understand whether my idea made sense.
- As a learner, I want the coach to explain the opponent's move so I can learn to detect threats.
- As a learner, I want to ask what stronger players would notice so I can improve pattern recognition.
- As a learner, I want the app to warn me before major blunders so I can learn to pause and scan.

### Thinking Process Training

- As a learner, I want to enter candidate moves before moving so I can practice structured decision-making.
- As a learner, I want to calculate 2, 3, 5, and 7 move sequences so I can improve visualization.
- As a learner, I want my calculation compared against engine lines so I can see where my thinking failed.
- As a learner, I want to review what I was thinking at critical moments so I can identify bad habits.

### Review and Improvement

- As a learner, I want a post-game report with accuracy, mistakes, blunders, best moves, and recommendations.
- As a learner, I want puzzles generated from my own games so training feels relevant.
- As a learner, I want an improvement dashboard showing recurring weaknesses.
- As a learner, I want opening memory training so I can remember important lines over time.

### Account and Progress

- As a learner, I want to sign in with Google or email so my progress is saved.
- As a learner, I want my training history tracked across games.
- As a learner, I want difficulty and hint settings to match my current strength.

---

## 5. Functional Requirements

### FR1: Authentication

- Support Google login.
- Support email login.
- Maintain user profile, estimated rating range, preferences, and training history.
- Allow anonymous local trial mode only if it does not compromise persistence requirements. Anonymous accounts may be added after authenticated V1 if needed.

### FR2: Chess Gameplay

- Render a playable chessboard using React Chessboard.
- Enforce legal moves using chess.js.
- Maintain full game state as FEN, PGN, move list, clocks if enabled, and side-to-move metadata.
- Support resign, restart, undo if allowed by mode, and save game.
- Support game modes:
  - Play vs AI Bot
  - Self Play Learning Mode
  - Analysis Review Mode

### FR3: AI Bot Play

- Use Stockfish WASM for engine move generation.
- Provide multiple difficulty levels.
- Provide human-style bot personalities using controlled engine parameters, move selection noise, opening preferences, and explanation tone.
- Never use LLMs to generate moves.
- Bot response time should feel natural and configurable.

### FR4: Live Coach Mode

- Provide optional text coaching during gameplay.
- Explain:
  - User moves
  - Opponent moves
  - Threats
  - Plans
  - Tactical ideas
  - Strategic concepts
  - Evaluation changes
- Allow coaching verbosity settings:
  - Minimal
  - Standard
  - Detailed
- Allow coaching frequency settings:
  - Every move
  - Critical moments only
  - On demand

### FR5: Opponent Intent Detection

After each opponent move, analyze and explain:
- What changed on the board
- What the opponent is threatening
- The opponent's likely plan
- Which pieces became vulnerable
- Which squares or files became important
- What the user should check before moving

Example format:

```text
Opponent played: Rc8

What changed?
- The rook moved to an open file.

What is the opponent threatening?
- Pressure on c2.

What is the opponent's likely plan?
- Double rooks on the c-file.

What should you check?
- Is c2 defended?
- Can the file be contested?
```

### FR6: Candidate Move Trainer

Before the user moves, the app may ask the user to enter candidate moves.

Required behavior:
- User selects 1-5 candidate moves.
- App validates legal moves with chess.js.
- Stockfish evaluates selected candidates.
- App compares selected candidates against top engine moves.
- App scores decision quality.
- App explains:
  - Best candidate
  - Missed candidate moves
  - Tactical or strategic reason for each important candidate
  - Whether the user's final move matched their candidate list

Decision quality factors:
- Inclusion of strong moves
- Avoidance of blunders
- Awareness of opponent threats
- Evaluation difference from best move
- Consistency between stated candidates and final move

### FR7: Think Ahead Trainer

Support calculation practice at depths of:
- 2 plies or moves, depending on UI label chosen during implementation
- 3 moves
- 5 moves
- 7 moves

The product should be precise in UI copy:
- "Ply" means one side's move.
- "Move sequence" means a line containing both sides' moves.

Required behavior:
- User enters a predicted line.
- App validates legal sequence.
- Stockfish compares line against top engine continuation.
- App identifies the first meaningful divergence.
- App explains missed tactics, forced moves, and visualization errors.
- App stores calculation accuracy over time.

### FR8: Self Play Learning Mode

Support:
- User controls white only.
- User controls black only.
- User controls both sides.
- Hints configurable independently for each side.

Use cases:
- Opening rehearsal.
- Endgame practice.
- Strategy exploration.
- Coach-guided analysis without bot pressure.

### FR9: Explain Every Move Mode

For every move, provide:
- Tactical explanation
- Strategic explanation
- Engine evaluation impact
- Threat changes
- Key candidate alternatives where relevant

This mode should be intentionally verbose and may be best used in analysis or slow training games.

### FR10: Blunder Prevention Mode

Before confirming a move, if Stockfish detects a major evaluation drop, warn the user.

Required behavior:
- Configurable thresholds by skill level.
- Beginner default: warn on hanging queen, mate threats, and major material loss.
- Intermediate default: warn on significant evaluation drops and missed forced tactics.
- User may still play the move after warning.
- Warnings should teach the scan habit rather than simply reveal the best move.

Example:

```text
Pause before playing this.
Your bishop on c4 would become undefended, and Black has Nxe4.
Check opponent captures before confirming.
```

### FR11: Tactical Pattern Trainer

Teach and train:
- Forks
- Pins
- Skewers
- Discovered attacks
- Deflections
- Mating patterns

Required behavior:
- Provide curated starter puzzles.
- Generate personalized puzzles from user games.
- Classify puzzle themes.
- Track success rate, time to solve, and recurrence.
- Explain why the pattern works after completion.

### FR12: Opening Memory Trainer

Required behavior:
- Allow users to build or select opening repertoires.
- Use spaced repetition for move recall.
- Track remembered, weak, and forgotten moves.
- Detect forgotten moves during games and reviews.
- Explain opening ideas, not only move order.

### FR13: Post-Game Analysis

After each completed game, provide:
- Accuracy
- Best moves
- Brilliant moves
- Good moves
- Inaccuracies
- Mistakes
- Blunders
- Engine lines
- Opening summary
- Middlegame themes
- Endgame summary if applicable
- Improvement recommendations

Move classifications should be derived from Stockfish evaluation changes, tactical significance, and position context. Labels such as "brilliant" must be conservative in V1 to avoid misleading users.

### FR14: Personalized Improvement System

Track:
- Tactical weaknesses
- Opening weaknesses
- Endgame weaknesses
- Time-management mistakes
- Common blunders
- Calculation errors
- Candidate move quality
- Threat awareness
- Strategic planning quality
- Thinking profile changes over time

Output:
- Improvement dashboard
- Weekly or session-based recommendations
- Personalized puzzle queue
- Suggested training modules

### FR15: Thought Replay and Decision Review System

Purpose:
Teach users how strong players think and improve decision-making quality, not just move accuracy.

The system must not interrupt gameplay by asking for written explanations after every move. Instead, after the game, it automatically identifies critical moments:
- Blunders
- Missed tactics
- Missed checkmates
- Brilliant moves
- Turning points
- Major evaluation swings
- Endgame transitions

For each critical position:
- Show board position.
- Show move number and user move.
- Ask the user what they were thinking.
- Compare user intention against board reality, engine evaluation, and strong-player reasoning.
- Classify thinking mistake or strength.

Example:

```text
Position: Move 17
User move: Nf3

AI asks:
What was your main idea?

User response:
I wanted to attack the queen.

AI review:
The queen was already safe. The critical issue was your undefended bishop.
Strong players first scan for loose pieces before launching attacks.
```

Thinking weaknesses to detect:
- Ignoring opponent threats
- Tunnel vision attacks
- Missing tactical opportunities
- Poor candidate move selection
- Weak strategic planning
- Inaccurate calculations
- Overvaluing initiative
- Moving without identifying opponent intent
- Failing to notice loose pieces
- Poor king safety evaluation

Thinking strengths to detect:
- Finds tactical opportunities
- Good king safety awareness
- Strong defensive awareness
- Considers multiple candidate moves
- Identifies opponent plans
- Good conversion technique

### FR16: Thinking Profile

Generate a profile for each user based on games, candidate move training, puzzle performance, and Thought Replay responses.

Profile sections:
- Thinking strengths
- Thinking weaknesses
- Most common decision errors
- Best phase of game
- Weakest phase of game
- Tactical pattern strengths and weaknesses
- Current training priorities

Example:

```text
Thinking Strengths
- Finds tactical opportunities
- Good king safety awareness

Thinking Weaknesses
- Misses opponent threats
- Overvalues attacks
- Weak endgame planning
```

### FR17: What Would a Master Notice?

For any position, the user can press a button and receive an explanation of what stronger players would notice.

The explanation should be tiered:
- Beginner notices
- Intermediate notices
- Master notices

Example:

```text
Beginner notices:
White can attack the king.

Intermediate notices:
The bishop on c4 is undefended.

Master notices:
The weak d6 square can become a permanent outpost.
```

The feature should focus on:
- Pattern recognition
- Strategic understanding
- Threat awareness
- Piece coordination
- Weak squares
- Pawn structure
- King safety
- Endgame transitions

### FR18: Puzzle Generator

Generate puzzles from:
- User mistakes
- Previous games
- Weakness categories
- Missed tactics
- Missed checkmates
- Blunders
- Opening traps
- Endgame mistakes

Required behavior:
- Store source game and move reference.
- Validate puzzle solution with Stockfish.
- Classify theme.
- Provide explanation after solve attempt.
- Add generated puzzles to personalized training queue.

---

## 6. Non-Functional Requirements

### Performance

- Chessboard interactions should feel immediate, targeting under 100 ms UI response for legal move validation.
- Stockfish analysis should stream or progressively update when possible.
- Live coaching should return within 2-5 seconds for normal positions.
- Post-game analysis may run asynchronously and notify the user when ready.

### Reliability

- Engine evaluations must be reproducible for a given FEN, depth, engine version, and configuration.
- Game state must be recoverable after refresh.
- The system must never apply illegal moves.
- If LLM coaching fails, engine analysis should still be available.

### Scalability

- Web app should support single-player engine analysis workloads.
- Backend should queue expensive post-game analysis jobs.
- Use caching for repeated FEN evaluations, opening positions, and generated explanations where appropriate.

### Security

- Use secure authentication flows for Google and email login.
- Store passwords only through trusted auth provider or properly hashed credentials if self-managed.
- Protect user game history and profile data.
- Rate-limit expensive AI and engine analysis endpoints.

### Privacy

- User games, explanations, and thinking profiles are private by default.
- Provide clear data deletion and export options in future account settings.

### Accessibility

- Keyboard-accessible board controls.
- Screen-reader labels for moves and coaching content.
- Color-safe move highlights.
- Adjustable text size for coaching panels.

### Maintainability

- Separate chess rules, engine analysis, coaching generation, and UI components.
- Avoid coupling LLM prompts directly to React components.
- Store prompt templates versioned on the backend.

---

## 7. Feature Specifications

### 7.1 Play vs AI Bots

Bot configuration:
- Difficulty: Beginner, Easy, Casual, Club, Intermediate
- Estimated rating bands: 400, 800, 1200, 1600, 2000
- Personality examples:
  - Solid Defender
  - Tactical Attacker
  - Opening Explorer
  - Endgame Grinder
  - Risk Taker

Implementation notes:
- Use Stockfish multipv and evaluation.
- Simulate weaker play using depth limits, move noise, centipawn loss targets, and occasional human-like inaccuracies.
- Personality should influence move selection from valid engine-ranked candidates, not bypass the engine.

Acceptance criteria:
- User can start a bot game within 3 clicks from dashboard.
- Bot always plays legal moves.
- Bot difficulty meaningfully changes move quality.
- Bot personality changes style in a noticeable but controlled way.

### 7.2 Live Coach Panel

Panel sections:
- Current position summary
- Opponent intent
- Candidate move suggestions if enabled
- Tactical ideas
- Strategic ideas
- Evaluation trend

States:
- Waiting for move
- Analyzing
- Coach explanation ready
- Engine unavailable fallback
- Coach unavailable fallback

Acceptance criteria:
- User can toggle coach visibility.
- Coach output is tied to a specific FEN and move.
- Coach never recommends illegal moves.
- Coach distinguishes engine-backed fact from instructional interpretation.

### 7.3 Candidate Move Trainer

Flow:
1. User reaches position.
2. Coach asks user to select candidate moves.
3. User enters moves on board or via notation.
4. System evaluates candidates.
5. User chooses final move.
6. Coach scores and explains decision quality.

Scoring dimensions:
- Candidate coverage
- Final move quality
- Threat response
- Tactical awareness
- Strategic consistency

Acceptance criteria:
- User can submit legal candidate moves.
- Illegal notation receives clear correction.
- Score is saved to user profile.
- Explanation references concrete board details.

### 7.4 Thought Replay

Flow:
1. User completes game.
2. System analyzes game.
3. System selects 3-8 critical moments.
4. User writes short explanation for selected moments.
5. AI reviews intention versus board reality.
6. System updates Thinking Profile.

Critical moment selection ranking:
- Checkmate missed or allowed
- Blunder
- Major evaluation swing
- Missed tactic
- Turning point
- Conversion failure
- Strong move played by user
- Endgame transition

Acceptance criteria:
- System does not ask for explanations during normal gameplay.
- Each review item includes board, move, prompt, user response, AI review, and classification.
- Thinking Profile is updated only from completed review items or high-confidence gameplay signals.

### 7.5 What Would a Master Notice?

Input:
- FEN
- Last move
- User rating band
- Engine top lines
- Tactical motifs
- Material balance
- King safety data
- Pawn structure summary

Output:
- Beginner notice
- Intermediate notice
- Master notice
- Practical takeaway

Acceptance criteria:
- User can request this from game, analysis, and review modes.
- Output is concise and position-specific.
- The system avoids vague advice such as "improve your pieces" unless tied to concrete moves or squares.

---

## 8. User Flows

### Flow 1: First-Time User Onboarding

1. User opens web app.
2. User chooses sign in with Google or email.
3. User selects estimated rating range:
   - New to chess
   - 0-800
   - 800-1400
   - 1400-2000
4. User chooses learning goal:
   - Stop blundering
   - Learn tactics
   - Improve calculation
   - Understand plans
   - Prepare openings
5. App recommends starting mode and bot level.
6. User starts first coached game.

### Flow 2: Play vs AI with Live Coach

1. User selects bot and difficulty.
2. User enables Live Coach Mode.
3. User plays a move.
4. Engine evaluates move.
5. Coach explains move quality and key idea.
6. Bot plays legal engine-derived move.
7. Coach explains opponent intent.
8. User continues game.
9. Game ends.
10. User enters post-game analysis.

### Flow 3: Candidate Move Training

1. User starts training game or toggles Candidate Move Trainer.
2. Before each important move, app prompts for candidate moves.
3. User selects candidate moves.
4. App evaluates candidates.
5. User chooses final move.
6. Coach provides decision quality score.
7. Score is saved.

### Flow 4: Thought Replay

1. User completes game.
2. App runs post-game analysis.
3. App identifies critical moments.
4. User reviews one critical position at a time.
5. User enters what they were thinking.
6. AI compares intention against board reality and engine analysis.
7. System updates Thinking Profile.
8. App recommends training.

### Flow 5: Personalized Puzzle Training

1. User opens training dashboard.
2. App shows recommended puzzles from user's games.
3. User solves puzzle.
4. App validates answer with chess.js and Stockfish.
5. App explains pattern and missed idea.
6. System updates weakness profile.

---

## 9. Wireframe Descriptions

### 9.1 Main Gameplay Screen

Layout:
- Left or center: chessboard.
- Right: coaching panel.
- Bottom: move list and evaluation trend.
- Top: mode controls, bot info, resign/restart, settings.

Key UI elements:
- Chessboard with last move highlight, legal move hints, threat highlights.
- Coach panel tabs:
  - Coach
  - Candidates
  - Threats
  - Lines
- Evaluation bar adjacent to board.
- Move list with classifications after analysis.
- "What Would a Master Notice?" button near coach panel.

Behavior:
- On user's turn, coach may show checks to consider.
- After opponent move, coach prioritizes opponent intent.
- In Blunder Prevention Mode, risky moves trigger confirmation modal.

### 9.2 Post-Game Analysis Screen

Layout:
- Board replay area.
- Move timeline with color-coded classifications.
- Summary cards for accuracy, mistakes, blunders, best moves.
- Recommendations panel.
- Thought Replay callout.

Key interactions:
- Click any move to see engine line and explanation.
- Filter moves by blunders, mistakes, missed tactics, turning points.
- Start Thought Replay from selected critical moments.
- Generate puzzles from selected positions.

### 9.3 Thought Replay Screen

Layout:
- Board position on left.
- Move context and prompt on right.
- User text box for intention.
- AI review panel after submission.
- Thinking pattern tags.

Key interactions:
- User writes short explanation.
- App shows review comparing intention, board reality, engine evaluation, and strong-player reasoning.
- User can save insight.
- System updates profile.

### 9.4 Training Dashboard

Layout:
- Current Thinking Profile summary.
- Recommended training modules.
- Weakness categories.
- Progress charts.
- Puzzle queue.

Key cards:
- Tactical weaknesses
- Opening memory
- Calculation accuracy
- Threat awareness
- Endgame planning

### 9.5 Opening Memory Trainer

Layout:
- Board.
- Repertoire tree.
- Prompt area.
- Recall result indicator.
- Opening idea explanation.

Behavior:
- App asks user to play next repertoire move.
- Mistakes are marked as forgotten or weak.
- Correct repeated moves graduate in spaced repetition schedule.

---

## 10. Database Schema

Recommended database: PostgreSQL  
ORM: Prisma

### Core Models

```prisma
model User {
  id                String   @id @default(cuid())
  email             String   @unique
  name              String?
  imageUrl          String?
  authProvider      String
  estimatedRating   Int?
  ratingBand        String?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  preferences       UserPreference?
  games             Game[]
  thinkingProfile   ThinkingProfile?
  trainingSessions  TrainingSession[]
  repertoires        OpeningRepertoire[]
}

model UserPreference {
  id                    String   @id @default(cuid())
  userId                String   @unique
  coachVerbosity         String   @default("standard")
  coachFrequency         String   @default("critical_moments")
  blunderPrevention      Boolean  @default(true)
  candidateTrainer       Boolean  @default(false)
  boardTheme             String?
  pieceTheme             String?
  createdAt              DateTime @default(now())
  updatedAt              DateTime @updatedAt

  user                  User     @relation(fields: [userId], references: [id])
}

model Game {
  id              String   @id @default(cuid())
  userId          String
  mode            String
  result          String?
  userColor       String?
  botId           String?
  initialFen      String   @default("startpos")
  finalFen        String?
  pgn             String?
  moveCount       Int      @default(0)
  accuracyWhite   Float?
  accuracyBlack   Float?
  status          String   @default("in_progress")
  startedAt       DateTime @default(now())
  completedAt     DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  user            User     @relation(fields: [userId], references: [id])
  moves           Move[]
  analysis        GameAnalysis?
  criticalMoments CriticalMoment[]
  puzzles         Puzzle[]
}

model Move {
  id              String   @id @default(cuid())
  gameId          String
  moveNumber      Int
  ply             Int
  color           String
  san             String
  uci             String
  fenBefore       String
  fenAfter        String
  evalBeforeCp    Int?
  evalAfterCp     Int?
  evalBeforeMate  Int?
  evalAfterMate   Int?
  classification  String?
  createdAt       DateTime @default(now())

  game            Game     @relation(fields: [gameId], references: [id])
  engineLines     EngineLine[]
  coachMessages   CoachMessage[]
}

model EngineLine {
  id              String   @id @default(cuid())
  moveId          String?
  fen             String
  depth           Int
  multipv         Int
  scoreCp         Int?
  scoreMate       Int?
  lineUci         String
  lineSan         String?
  engineVersion   String
  createdAt       DateTime @default(now())

  move            Move?    @relation(fields: [moveId], references: [id])
}

model CoachMessage {
  id              String   @id @default(cuid())
  moveId          String?
  userId          String
  fen             String
  type            String
  promptVersion   String?
  content         Json
  createdAt       DateTime @default(now())

  move            Move?    @relation(fields: [moveId], references: [id])
}

model GameAnalysis {
  id                String   @id @default(cuid())
  gameId            String   @unique
  summary           Json
  recommendations   Json
  analyzedAt        DateTime @default(now())

  game              Game     @relation(fields: [gameId], references: [id])
}

model CriticalMoment {
  id                  String   @id @default(cuid())
  gameId              String
  moveId              String?
  type                String
  severity            String
  fen                 String
  engineSummary       Json
  userThought         String?
  aiReview            Json?
  thinkingTags        String[]
  reviewedAt          DateTime?
  createdAt           DateTime @default(now())

  game                Game     @relation(fields: [gameId], references: [id])
}

model ThinkingProfile {
  id                    String   @id @default(cuid())
  userId                String   @unique
  strengths             Json
  weaknesses            Json
  patternStats          Json
  currentPriorities     Json
  updatedAt             DateTime @updatedAt

  user                  User     @relation(fields: [userId], references: [id])
}

model Puzzle {
  id              String   @id @default(cuid())
  userId          String?
  sourceGameId    String?
  sourceMoveId    String?
  fen             String
  solutionUci     String[]
  solutionSan     String[]
  theme           String
  difficulty      Int?
  explanation     Json?
  createdAt       DateTime @default(now())

  sourceGame      Game?    @relation(fields: [sourceGameId], references: [id])
  attempts        PuzzleAttempt[]
}

model PuzzleAttempt {
  id              String   @id @default(cuid())
  puzzleId        String
  userId          String
  solved          Boolean
  movesPlayed     String[]
  timeMs          Int?
  createdAt       DateTime @default(now())

  puzzle          Puzzle   @relation(fields: [puzzleId], references: [id])
}

model TrainingSession {
  id              String   @id @default(cuid())
  userId          String
  type            String
  summary         Json?
  startedAt       DateTime @default(now())
  completedAt     DateTime?

  user            User     @relation(fields: [userId], references: [id])
}

model CandidateMoveAttempt {
  id                String   @id @default(cuid())
  userId            String
  gameId            String?
  fen               String
  candidatesUci     String[]
  finalMoveUci      String?
  engineTopMoves    Json
  score             Float
  feedback          Json
  createdAt         DateTime @default(now())
}

model CalculationAttempt {
  id                String   @id @default(cuid())
  userId            String
  fen               String
  targetDepth       Int
  userLineUci       String[]
  engineLineUci     String[]
  firstDivergence   Int?
  score             Float
  feedback          Json
  createdAt         DateTime @default(now())
}

model OpeningRepertoire {
  id              String   @id @default(cuid())
  userId          String
  name            String
  color           String
  lines           OpeningLine[]
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  user            User     @relation(fields: [userId], references: [id])
}

model OpeningLine {
  id              String   @id @default(cuid())
  repertoireId    String
  eco             String?
  name            String?
  movesUci        String[]
  movesSan        String[]
  ideas           Json?

  repertoire      OpeningRepertoire @relation(fields: [repertoireId], references: [id])
}

model OpeningMemoryItem {
  id              String   @id @default(cuid())
  userId          String
  fen             String
  expectedMoveUci String
  status          String   @default("new")
  easeFactor      Float    @default(2.5)
  intervalDays    Int      @default(0)
  dueAt           DateTime @default(now())
  lastReviewedAt  DateTime?
}
```

---

## 11. API Design

Base path: `/api`

### Auth

```http
POST /api/auth/google
POST /api/auth/email/login
POST /api/auth/email/register
POST /api/auth/logout
GET  /api/me
PATCH /api/me/preferences
```

### Games

```http
POST /api/games
GET  /api/games
GET  /api/games/:gameId
PATCH /api/games/:gameId
POST /api/games/:gameId/moves
POST /api/games/:gameId/resign
POST /api/games/:gameId/complete
```

Create game request:

```json
{
  "mode": "play_vs_bot",
  "userColor": "white",
  "botId": "solid-defender-800",
  "coachSettings": {
    "liveCoach": true,
    "verbosity": "standard",
    "blunderPrevention": true
  }
}
```

Submit move request:

```json
{
  "from": "e2",
  "to": "e4",
  "promotion": null,
  "fenBefore": "..."
}
```

### Engine

```http
POST /api/engine/evaluate
POST /api/engine/top-lines
POST /api/engine/classify-move
POST /api/engine/bot-move
```

Engine evaluate request:

```json
{
  "fen": "...",
  "depth": 14,
  "multiPv": 3
}
```

### Coaching

```http
POST /api/coach/move-explanation
POST /api/coach/opponent-intent
POST /api/coach/master-notice
POST /api/coach/blunder-warning
POST /api/coach/post-game-summary
```

Opponent intent request:

```json
{
  "gameId": "game_123",
  "moveId": "move_456",
  "fenBefore": "...",
  "fenAfter": "...",
  "lastMoveSan": "Rc8",
  "engineLines": [],
  "userRatingBand": "800-1400"
}
```

### Training

```http
POST /api/training/candidate-moves/attempt
POST /api/training/calculation/attempt
GET  /api/training/recommendations
GET  /api/training/dashboard
```

### Analysis

```http
POST /api/games/:gameId/analyze
GET  /api/games/:gameId/analysis
GET  /api/games/:gameId/critical-moments
POST /api/critical-moments/:momentId/thought-review
```

Thought review request:

```json
{
  "userThought": "I wanted to attack the queen."
}
```

### Puzzles

```http
POST /api/puzzles/generate-from-game
GET  /api/puzzles/recommended
GET  /api/puzzles/:puzzleId
POST /api/puzzles/:puzzleId/attempt
```

### Openings

```http
GET  /api/openings/repertoires
POST /api/openings/repertoires
GET  /api/openings/memory/due
POST /api/openings/memory/review
```

---

## 12. AI Coaching Architecture

### Core Rule

LLMs must never generate chess moves, choose bot moves, validate tactics, or determine engine evaluations. They only explain verified chess data.

### Inputs to LLM

The coaching service should provide structured inputs:
- FEN before and after move
- Legal move list when needed
- Last move SAN and UCI
- Engine evaluation before and after
- Top engine lines
- Move classification
- Tactical motif tags from deterministic or engine-assisted analysis
- Material balance
- King safety indicators
- User rating band
- Coaching verbosity
- User's historical weaknesses where relevant

### LLM Output Schema

Use structured JSON outputs where possible:

```json
{
  "summary": "Black moved the rook to the open c-file.",
  "whatChanged": ["The rook now pressures c2."],
  "threats": ["Black may double rooks on the c-file."],
  "plan": ["Increase pressure on c2 and restrict White's pieces."],
  "userChecks": ["Is c2 defended?", "Can White contest the c-file?"],
  "concepts": ["Open file control", "Back-rank pressure"],
  "tone": "instructional"
}
```

### Prompt Strategy

Prompt templates should be versioned by coaching task:
- `move_explanation_v1`
- `opponent_intent_v1`
- `blunder_warning_v1`
- `master_notice_v1`
- `thought_review_v1`
- `post_game_summary_v1`

Each prompt should:
- Forbid move invention outside supplied engine/legal move data.
- Require concrete board references.
- Match explanation complexity to user rating band.
- Prefer concise coaching during gameplay.
- Allow deeper explanation during review.

### AI Coaching Pipeline

1. Frontend requests coaching for position or move.
2. Backend validates game and move state.
3. Engine service generates evaluation and top lines.
4. Chess analysis service derives structured facts.
5. Coaching service calls LLM with structured facts.
6. Response is validated against schema.
7. Coach message is stored with prompt version and FEN.
8. Frontend renders explanation.

### Failure Modes

- If LLM times out: show engine summary and retry option.
- If LLM returns illegal or unsupported claims: discard and regenerate once.
- If engine unavailable: do not generate confident coaching; show "analysis unavailable."
- If user requests "best move": show engine best move with explanation, not LLM-created move.

---

## 13. Engine Integration Architecture

### Engine

Use Stockfish WASM.

### Responsibilities

Stockfish provides:
- Best move
- Top lines
- Evaluation
- Mate detection
- Move quality classification inputs
- Bot move selection candidates
- Puzzle validation
- Calculation line comparison

chess.js provides:
- Legal move validation
- Game state transitions
- PGN generation
- FEN parsing
- Check, checkmate, stalemate, draw state

### Client vs Server Engine Placement

V1 recommendation:
- Use client-side Stockfish WASM for live lightweight analysis and bot play where feasible.
- Use backend analysis workers for post-game analysis, persisted evaluations, puzzle generation, and critical moment detection.

Rationale:
- Client-side engine reduces server compute for live play.
- Backend analysis ensures consistency for saved reports and personalization.

### Engine Service Design

Engine service inputs:
- FEN
- Depth or time limit
- MultiPV count
- Skill level or difficulty config for bot

Engine service outputs:
- Best move UCI
- Evaluation centipawns or mate
- Principal variation
- MultiPV lines
- Depth reached
- Engine version

### Move Classification

Classification should combine:
- Evaluation delta
- Mate changes
- Best move comparison
- Tactical motif detection
- User rating band

Initial labels:
- Best
- Excellent
- Good
- Inaccuracy
- Mistake
- Blunder
- Missed win
- Missed mate
- Brilliant candidate, conservative use only

### Bot Difficulty

Bot behavior controls:
- Search depth
- Move time
- Candidate pool size
- Randomness within centipawn threshold
- Intentional inaccuracies by difficulty
- Personality weighting

Example:
- Beginner bot: low depth, larger centipawn tolerance, occasional missed tactics.
- Intermediate bot: higher depth, smaller centipawn tolerance, coherent plans.

---

## 14. System Architecture Diagram

```text
┌─────────────────────────────────────────────────────────────┐
│                         Web Client                          │
│ React + TypeScript + Tailwind + React Chessboard             │
│                                                             │
│ - Chessboard UI                                              │
│ - Coach Panel                                                │
│ - Training UI                                                │
│ - Local game state                                           │
│ - Client Stockfish WASM for live analysis where appropriate  │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / JSON
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Node.js + Express API                     │
│                                                             │
│ - Auth routes                                                │
│ - Game routes                                                │
│ - Coaching routes                                            │
│ - Training routes                                            │
│ - Analysis routes                                            │
│ - Rate limiting                                              │
└───────────────┬───────────────────────┬─────────────────────┘
                │                       │
                ▼                       ▼
┌──────────────────────────┐   ┌──────────────────────────────┐
│ Chess Analysis Service   │   │ AI Coaching Service           │
│                          │   │                              │
│ - chess.js validation    │   │ - Prompt templates            │
│ - Move classification    │   │ - Structured LLM calls        │
│ - Threat extraction      │   │ - JSON schema validation      │
│ - Critical moments       │   │ - Explanation persistence     │
└──────────────┬───────────┘   └───────────────┬──────────────┘
               │                               │
               ▼                               ▼
┌──────────────────────────┐   ┌──────────────────────────────┐
│ Stockfish Worker Layer   │   │ LLM Provider                  │
│                          │   │                              │
│ - WASM engine workers    │   │ - Explanations only           │
│ - Top lines              │   │ - Thought review              │
│ - Evaluation             │   │ - Summaries                   │
│ - Puzzle validation      │   │ - Coaching text               │
└──────────────┬───────────┘   └──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────────┐
│                      PostgreSQL Database                     │
│ Prisma ORM                                                   │
│                                                             │
│ Users, games, moves, engine lines, coach messages,           │
│ critical moments, puzzles, training attempts, profiles        │
└─────────────────────────────────────────────────────────────┘
```

---

## 15. Development Roadmap

### Milestone 0: Technical Foundation

Duration: 1-2 weeks

Deliverables:
- React + TypeScript + Tailwind app shell
- Node + Express backend
- PostgreSQL + Prisma setup
- Authentication foundation
- chess.js integration
- React Chessboard integration
- Stockfish WASM proof of concept

### Milestone 1: Playable Chess Core

Duration: 2-3 weeks

Deliverables:
- Legal move gameplay
- Move history
- FEN/PGN persistence
- Basic bot play
- Game start/end flows
- Basic evaluation display

### Milestone 2: Live Coach V1

Duration: 3-4 weeks

Deliverables:
- Move explanation
- Opponent intent detection
- Evaluation impact explanation
- Coach panel UI
- LLM prompt templates
- Coach message persistence
- Blunder prevention V1

### Milestone 3: Post-Game Analysis

Duration: 3-4 weeks

Deliverables:
- Full game engine analysis
- Move classification
- Accuracy score
- Critical moment detection
- Recommendations
- Analysis replay UI

### Milestone 4: Thinking Trainers

Duration: 4-5 weeks

Deliverables:
- Candidate Move Trainer
- Think Ahead Trainer
- Calculation attempt scoring
- Training dashboard foundation
- Personalized weakness tracking V1

### Milestone 5: Thought Replay

Duration: 3-4 weeks

Deliverables:
- Critical moment prompts
- User thought capture
- AI review
- Thinking tags
- Thinking Profile V1
- Personalized training recommendations

### Milestone 6: Puzzle and Opening Training

Duration: 4-5 weeks

Deliverables:
- Tactical Pattern Trainer
- Puzzle generation from games
- Opening Memory Trainer
- Spaced repetition logic
- Weakness-based puzzle queue

### Milestone 7: Beta Hardening

Duration: 2-4 weeks

Deliverables:
- Performance optimization
- Prompt quality testing
- Engine consistency testing
- UX polish
- Analytics
- Error handling
- Security review

---

## 16. MVP Scope

MVP objective:
Prove that users can play a complete AI game and receive useful coaching that improves their thinking process.

### Included in MVP

- Web app only.
- Authentication with Google and email.
- Play vs AI Bot.
- Basic bot difficulty levels.
- React Chessboard gameplay.
- chess.js legal move validation.
- Stockfish WASM analysis.
- Live Coach Mode, standard verbosity.
- Opponent Intent Detection.
- Blunder Prevention Mode.
- Post-Game Analysis V1.
- Critical moment detection.
- Thought Replay V1.
- Thinking Profile V1.
- "What Would a Master Notice?" for current position.
- Basic personalized recommendations.

### Excluded from MVP

- Online multiplayer.
- Voice coaching.
- Mobile app.
- Full opening repertoire builder.
- Advanced spaced repetition.
- Full puzzle marketplace or community puzzle system.
- Tournament mode.
- Social features.
- Coach marketplace.

### MVP Acceptance Criteria

- User can sign in and complete a game vs AI.
- Every move is legal and persisted.
- Bot move generation is Stockfish-derived.
- Coach can explain user and opponent moves.
- Opponent intent explanations are concrete and useful.
- App warns before clear major blunders.
- Post-game analysis identifies mistakes and blunders.
- Thought Replay captures user intention for critical moments.
- Thinking Profile updates after review.

---

## 17. Phase 2 Scope

Phase 2 should expand depth after MVP validation.

### Phase 2 Features

- Mobile web optimization or native mobile planning.
- Full Opening Memory Trainer.
- Advanced Tactical Pattern Trainer.
- Puzzle Generator from all historical games.
- Richer Think Ahead Trainer.
- Endgame-specific training.
- More bot personalities.
- Adaptive coach tone and lesson plans.
- Training streaks and weekly review.
- Import PGN from external games.
- Export annotated PGN.
- More sophisticated time-management analysis.
- Coach-guided lesson paths.
- Team/classroom mode exploration.

### Still Excluded Unless Strategy Changes

- Online multiplayer.
- Voice coaching.
- Public social network features.

---

## 18. Risks and Challenges

### Risk 1: Coaching Hallucinations

LLMs may explain nonexistent tactics or recommend illegal moves.

Mitigation:
- Provide only structured engine-backed facts.
- Validate all move mentions against legal move list where possible.
- Use JSON schemas.
- Store prompt versions.
- Add automated prompt regression tests.

### Risk 2: Engine Performance in Browser

Stockfish WASM may be resource-intensive on low-end devices.

Mitigation:
- Use configurable depth and time limits.
- Move expensive analysis to backend workers.
- Show progressive analysis states.
- Cache repeated evaluations.

### Risk 3: Overwhelming Beginners

Too much coaching can make the app feel noisy.

Mitigation:
- Default to simple explanations for lower rating bands.
- Use coach verbosity settings.
- Separate live coaching from post-game deep analysis.

### Risk 4: Weak Bot Realism

Artificially weak bots may feel random rather than human.

Mitigation:
- Use engine-ranked candidate pools.
- Add personality constraints.
- Tune inaccuracies by theme, not pure randomness.

### Risk 5: Move Classification Quality

Users may distrust labels like "brilliant" or "blunder" if inconsistent.

Mitigation:
- Start conservative.
- Explain why a move received a label.
- Tie classification to evaluation and tactical context.

### Risk 6: Personalization Without Enough Data

Early Thinking Profiles may be shallow.

Mitigation:
- Mark early insights as preliminary.
- Use confidence scores internally.
- Ask for more games before making strong claims.

### Risk 7: Cost of AI Explanations

Live coaching may become expensive at scale.

Mitigation:
- Cache common opening explanations.
- Use shorter prompts during live play.
- Generate detailed analysis asynchronously.
- Rate-limit free tier usage if monetization is added.

---

## 19. Success Metrics

### Activation Metrics

- Percentage of new users who complete first game.
- Percentage who enable Live Coach Mode.
- Time from signup to first coached move.
- First-session completion rate.

### Engagement Metrics

- Games played per active user per week.
- Post-game analysis completion rate.
- Thought Replay completion rate.
- Candidate Move Trainer usage.
- Puzzle training sessions per week.

### Learning Metrics

- Reduction in blunders per game over time.
- Improvement in candidate move score.
- Improvement in calculation accuracy.
- Reduction in missed opponent threats.
- Improvement in puzzle solve rate by theme.
- Opening recall improvement.

### Retention Metrics

- Day 1 retention.
- Day 7 retention.
- Day 30 retention.
- Weekly active learners.
- Repeat Thought Replay usage.

### Quality Metrics

- Coach explanation helpfulness rating.
- Percentage of explanations flagged as incorrect.
- Engine analysis completion success rate.
- LLM response schema validation pass rate.
- Average coaching latency.

### Business Metrics

- Free-to-paid conversion if subscription is introduced.
- Cost per active coached game.
- AI cost per retained user.
- Churn by rating segment.

---

## 20. Future Expansion Opportunities

### Mobile App

Native or high-quality mobile web experience with touch-optimized board interaction and shorter coaching cards.

### Voice Coaching

Add optional voice explanations after text coaching quality is proven.

### Online Multiplayer

Potentially add human games later, but only if coaching and review remain the product center. Multiplayer should not dilute the learning mission.

### PGN Import and External Game Review

Allow users to import games from chess platforms and receive ThinkChess-style coaching and Thought Replay.

### Coach-Guided Courses

Build adaptive courses based on Thinking Profile:
- Stop hanging pieces
- Learn candidate moves
- Master pins and forks
- Improve rook endgames
- Build an opening repertoire

### Classroom and Coach Tools

Allow chess coaches, schools, and clubs to assign training, review student thinking profiles, and create custom lesson plans.

### Advanced Analytics

Provide deeper longitudinal analysis:
- Rating estimate trends
- Phase-of-game performance
- Time pressure patterns
- Tactical motif heatmaps
- Opening tree weakness maps

### Community Puzzle Sharing

Allow users to share anonymized puzzles generated from their games after privacy controls are mature.

### Subscription Model

Potential tiers:
- Free: limited coached games and basic analysis
- Plus: unlimited post-game analysis and training
- Pro: advanced Thought Replay, opening trainer, deep engine analysis

---

## Implementation Notes for Development Team

### Recommended Initial Repository Structure

```text
thinkchess/
  apps/
    web/
      src/
        components/
        features/
          board/
          coach/
          game/
          training/
          analysis/
        lib/
        routes/
    api/
      src/
        modules/
          auth/
          games/
          engine/
          coach/
          training/
          analysis/
          puzzles/
        services/
        prisma/
  packages/
    chess-core/
    engine-client/
    coaching-schemas/
```

### Key Technical Boundaries

- UI components should not directly call LLM providers.
- Engine service should not contain coaching prose.
- Coaching service should not invent chess facts.
- Game persistence should store enough FEN and move metadata to re-analyze later.
- Post-game analysis should be asynchronous once game lengths and user volume increase.

### V1 Build Priority

The most important V1 loop is:

```text
Play move → Engine evaluates → Coach explains thinking → Opponent moves →
Coach explains opponent intent → Game ends → Critical moments reviewed →
Thinking Profile improves → Personalized training recommended
```

If this loop feels excellent, ThinkChess has a differentiated product foundation.


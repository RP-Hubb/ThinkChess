# ThinkChess — Database Schema Specification

## 1. Overview & Principles
- **Database Engine**: PostgreSQL
- **ORM**: Prisma ORM
- **Migration Strategy**: Version-controlled migrations via `prisma migrate dev`
- **Core Design Rule**: Structured, queryable relational tables for all game-critical facts (moves, evaluations, turns, classifications, timestamps), with specialized `Json` fields reserved for variable-structure LLM outputs and prompt payloads.

---

## 2. Complete Prisma Schema (`schema.prisma`)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// --------------------------------------------------------
// USER & PREFERENCES
// --------------------------------------------------------

model User {
  id              String           @id @default(cuid())
  email           String           @unique
  name            String?
  imageUrl        String?
  authProvider    String           @default("email") // email | google | anonymous
  passwordHash    String?
  estimatedRating Int              @default(800)
  ratingBand      String           @default("0-800") // 0-800 | 800-1400 | 1400-2000
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt

  preferences      UserPreference?
  games            Game[]
  thinkingProfile  ThinkingProfile?
  trainingSessions TrainingSession[]
  repertoires      OpeningRepertoire[]

  @@index([email])
}

model UserPreference {
  id                String   @id @default(cuid())
  userId            String   @unique
  coachVerbosity    String   @default("standard") // minimal | standard | detailed
  coachFrequency    String   @default("critical_moments") // every_move | critical_moments | on_demand
  blunderPrevention Boolean  @default(true)
  boardTheme        String   @default("dark_slate")
  pieceTheme        String   @default("neo")
  soundEnabled      Boolean  @default(true)
  whiteHintsEnabled Boolean  @default(true)
  blackHintsEnabled Boolean  @default(true)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// --------------------------------------------------------
// GAMES & MOVES
// --------------------------------------------------------

model Game {
  id            String    @id @default(cuid())
  userId        String
  mode          String    @default("play_vs_bot") // play_vs_bot | self_play | analysis
  result        String?   // 1-0 | 0-1 | 1/2-1/2 | in_progress | aborted
  userColor     String    @default("white") // white | black | both
  botId         String?   // solid-defender | tactical-attacker | etc.
  botDifficulty String?   // beginner | easy | casual | club | intermediate
  initialFen    String    @default("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")
  finalFen      String?
  pgn           String?   @db.Text
  moveCount     Int       @default(0)
  accuracyWhite Float?
  accuracyBlack Float?
  status        String    @default("in_progress") // in_progress | completed | resigned | drawn
  startedAt     DateTime  @default(now())
  completedAt   DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  user            User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  moves           Move[]
  analysis        GameAnalysis?
  criticalMoments CriticalMoment[]
  puzzles         Puzzle[]

  @@index([userId, status])
  @@index([createdAt])
}

model Move {
  id             String   @id @default(cuid())
  gameId         String
  moveNumber     Int
  ply            Int
  color          String   // w | b
  san            String   // e.g. "Nf3"
  uci            String   // e.g. "g1f3"
  fenBefore      String
  fenAfter       String
  evalBeforeCp   Int?     // Centipawns from White perspective
  evalAfterCp    Int?
  evalBeforeMate Int?     // Moves to mate (+ for white, - for black)
  evalAfterMate  Int?
  classification String?  // best | excellent | good | inaccuracy | mistake | blunder | missed_win | brilliant
  timeSpentMs    Int?
  createdAt      DateTime @default(now())

  game          Game           @relation(fields: [gameId], references: [id], onDelete: Cascade)
  engineLines   EngineLine[]
  coachMessages CoachMessage[]

  @@index([gameId, ply])
  @@index([classification])
}

model EngineLine {
  id            String   @id @default(cuid())
  moveId        String?
  fen           String
  depth         Int
  multipv       Int
  scoreCp       Int?
  scoreMate     Int?
  lineUci       String   @db.Text
  lineSan       String?  @db.Text
  engineVersion String   @default("Stockfish 16 WASM")
  createdAt     DateTime @default(now())

  move Move? @relation(fields: [moveId], references: [id], onDelete: Cascade)

  @@index([fen])
  @@index([moveId])
}

model CoachMessage {
  id            String   @id @default(cuid())
  moveId        String?
  userId        String
  fen           String
  type          String   // move_explanation | opponent_intent | blunder_warning | master_notice
  promptVersion String   @default("v1.0")
  content       Json     // Structured explanation output
  createdAt     DateTime @default(now())

  move Move? @relation(fields: [moveId], references: [id], onDelete: Cascade)

  @@index([moveId])
  @@index([userId, type])
}

// --------------------------------------------------------
// ANALYSIS & THOUGHT REPLAY
// --------------------------------------------------------

model GameAnalysis {
  id              String   @id @default(cuid())
  gameId          String   @unique
  summary         Json     // Phase overview, turning points, accuracy details
  recommendations Json     // Actionable coaching recommendations
  analyzedAt      DateTime @default(now())

  game Game @relation(fields: [gameId], references: [id], onDelete: Cascade)
}

model CriticalMoment {
  id            String    @id @default(cuid())
  gameId        String
  moveId        String?
  type          String    // blunder | missed_tactic | turning_point | major_eval_swing
  severity      String    // high | medium | low
  fen           String
  engineSummary Json      // Best engine line and evaluation impact
  userThought   String?   @db.Text // User's self-reported intention in Thought Replay
  aiReview      Json?     // AI coach's pedagogical assessment of user's intention
  thinkingTags  String[]  // e.g. ["tunnel_vision", "missed_threat", "hanging_piece"]
  reviewedAt    DateTime?
  createdAt     DateTime  @default(now())

  game Game @relation(fields: [gameId], references: [id], onDelete: Cascade)

  @@index([gameId])
  @@index([type])
}

model ThinkingProfile {
  id                String   @id @default(cuid())
  userId            String   @unique
  strengths         Json     // Aggregated cognitive strengths
  weaknesses        Json     // Aggregated blind spots
  patternStats      Json     // Frequency of tagged thinking errors
  currentPriorities Json     // Top 3 practice recommendations
  gamesAnalyzed     Int      @default(0)
  updatedAt         DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// --------------------------------------------------------
// TRAINING & PHASE 2 MODELS
// --------------------------------------------------------

model Puzzle {
  id           String   @id @default(cuid())
  userId       String?
  sourceGameId String?
  sourceMoveId String?
  fen          String
  solutionUci  String[]
  solutionSan  String[]
  theme        String   // fork | pin | skewer | deflection | mate
  difficulty   Int      @default(1000)
  explanation  Json?
  createdAt    DateTime @default(now())

  sourceGame Game?           @relation(fields: [sourceGameId], references: [id], onDelete: SetNull)
  attempts   PuzzleAttempt[]

  @@index([userId])
  @@index([theme])
}

model PuzzleAttempt {
  id          String   @id @default(cuid())
  puzzleId    String
  userId      String
  solved      Boolean
  movesPlayed String[]
  timeMs      Int?
  createdAt   DateTime @default(now())

  puzzle Puzzle @relation(fields: [puzzleId], references: [id], onDelete: Cascade)

  @@index([userId, solved])
}

model TrainingSession {
  id          String    @id @default(cuid())
  userId      String
  type        String    // candidate_moves | calculation | tactical_patterns | opening_memory
  summary     Json?
  startedAt   DateTime  @default(now())
  completedAt DateTime?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model CandidateMoveAttempt {
  id             String   @id @default(cuid())
  userId         String
  gameId         String?
  fen            String
  candidatesUci  String[]
  finalMoveUci   String?
  engineTopMoves Json
  score          Float
  feedback       Json
  createdAt      DateTime @default(now())

  @@index([userId])
}

model CalculationAttempt {
  id              String   @id @default(cuid())
  userId          String
  fen             String
  targetDepth     Int
  userLineUci     String[]
  engineLineUci   String[]
  firstDivergence Int?
  score           Float
  feedback        Json
  createdAt       DateTime @default(now())

  @@index([userId])
}

model OpeningRepertoire {
  id        String        @id @default(cuid())
  userId    String
  name      String
  color     String        // white | black
  lines     OpeningLine[]
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model OpeningLine {
  id           String            @id @default(cuid())
  repertoireId String
  eco          String?
  name         String?
  movesUci     String[]
  movesSan     String[]
  ideas        Json?

  repertoire OpeningRepertoire @relation(fields: [repertoireId], references: [id], onDelete: Cascade)
}

model OpeningMemoryItem {
  id              String    @id @default(cuid())
  userId          String
  fen             String
  expectedMoveUci String
  status          String    @default("new")
  easeFactor      Float     @default(2.5)
  intervalDays    Int       @default(0)
  dueAt           DateTime  @default(now())
  lastReviewedAt  DateTime?

  @@index([userId, dueAt])
}
```


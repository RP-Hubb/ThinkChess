# ThinkChess — REST API Specification

**Base URL**: `/api`  
**Authentication**: Bearer JWT in `Authorization` header (`Authorization: Bearer <token>`).  
**Content-Type**: `application/json`

---

## 1. Authentication & User Profile

### `POST /api/auth/register`
Register a new user account with email and password.
- **Request Body**:
  ```json
  {
    "email": "player@example.com",
    "password": "SecurePassword123!",
    "name": "Alex",
    "estimatedRating": 1000,
    "ratingBand": "800-1400"
  }
  ```
- **Response** (`201 Created`):
  ```json
  {
    "token": "eyJhbGciOi...",
    "user": {
      "id": "cuid_user123",
      "email": "player@example.com",
      "name": "Alex",
      "ratingBand": "800-1400"
    }
  }
  ```

### `POST /api/auth/login`
- **Request Body**:
  ```json
  {
    "email": "player@example.com",
    "password": "SecurePassword123!"
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "token": "eyJhbGciOi...",
    "user": {
      "id": "cuid_user123",
      "email": "player@example.com",
      "name": "Alex"
    }
  }
  ```

### `GET /api/auth/me`
Retrieve currently authenticated user profile and preferences.
- **Response** (`200 OK`):
  ```json
  {
    "id": "cuid_user123",
    "email": "player@example.com",
    "name": "Alex",
    "estimatedRating": 1000,
    "ratingBand": "800-1400",
    "preferences": {
      "coachVerbosity": "standard",
      "coachFrequency": "critical_moments",
      "blunderPrevention": true,
      "soundEnabled": true,
      "whiteHintsEnabled": true,
      "blackHintsEnabled": false
    }
  }
  ```

### `PATCH /api/auth/preferences`
Update user preferences (verbosity, blunder prevention, hint toggles).
- **Request Body**:
  ```json
  {
    "coachVerbosity": "detailed",
    "whiteHintsEnabled": true,
    "blackHintsEnabled": false
  }
  ```

---

## 2. Game Management

### `POST /api/games`
Create and start a new game session.
- **Request Body**:
  ```json
  {
    "mode": "play_vs_bot",
    "userColor": "white",
    "botId": "solid-defender",
    "botDifficulty": "casual",
    "initialFen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  }
  ```
- **Response** (`201 Created`):
  ```json
  {
    "id": "game_xyz789",
    "status": "in_progress",
    "userColor": "white",
    "currentFen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    "moveCount": 0
  }
  ```

### `POST /api/games/:id/moves`
Log a move played in a game.
- **Request Body**:
  ```json
  {
    "moveNumber": 1,
    "ply": 1,
    "color": "w",
    "san": "e4",
    "uci": "e2e4",
    "fenBefore": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    "fenAfter": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",
    "evalBeforeCp": 20,
    "evalAfterCp": 25,
    "timeSpentMs": 1450
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "moveId": "move_abc123",
    "classification": "best",
    "ply": 1
  }
  ```

### `POST /api/games/:id/complete`
Mark game as completed (by checkmate, resignation, or draw).
- **Request Body**:
  ```json
  {
    "result": "1-0",
    "finalFen": "...",
    "pgn": "1. e4 e5 2. Nf3 Nc6..."
  }
  ```

---

## 3. Live AI Coaching & Intent Detection

### `POST /api/coach/opponent-intent`
Analyze opponent's move and generate structured cognitive breakdown.
- **Request Body**:
  ```json
  {
    "fenBefore": "...",
    "fenAfter": "...",
    "lastMoveSan": "Rc8",
    "lastMoveUci": "c8",
    "userRatingBand": "800-1400",
    "engineTopLines": [
      { "san": "Nf3", "scoreCp": 30 }
    ]
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "summary": "Black moved their rook to contest the open c-file.",
    "whatChanged": [
      "The rook now occupies the open c-file.",
      "Pressure is exerted on your c2 square."
    ],
    "threats": [
      "Potential infiltration or doubling rooks along the c-file."
    ],
    "opponentPlan": "Establish full control over the c-file and target your queenside pawns.",
    "vulnerablePieces": ["Pawn on c2 is currently an anchor square."],
    "preMoveChecklist": [
      "Is c2 adequately defended?",
      "Can you contest or block the c-file?"
    ],
    "tacticalMotifs": ["Open File", "Rook Activity"]
  }
  ```

### `POST /api/coach/move-explanation`
Explain the strategic and tactical purpose of a played move.
- **Request Body**:
  ```json
  {
    "fenBefore": "...",
    "fenAfter": "...",
    "moveSan": "d4",
    "color": "w",
    "evalDelta": 5,
    "userRatingBand": "800-1400"
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "quality": "good",
    "title": "Central Stake & Diagonal Liberation",
    "explanation": "Pushes into the center, establishes space, and opens the c1-h6 diagonal for your dark-squared bishop.",
    "alternatives": ["Nf3 was equally strong developing a minor piece."],
    "strategicIdea": "Center control"
  }
  ```

### `POST /api/coach/blunder-warning`
Pre-move blunder check before committing a move.
- **Request Body**:
  ```json
  {
    "fenBefore": "...",
    "proposedMoveUci": "c4d5",
    "evalDropCp": 350,
    "userRatingBand": "800-1400"
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "isBlunder": true,
    "severity": "critical",
    "warningMessage": "Pause before playing this move. Moving the piece here leaves your knight on f3 vulnerable to a tactical tactic.",
    "hint": "Check opponent captures and undefended pieces first."
  }
  ```

### `POST /api/coach/master-notice`
Multi-tier perspective for any position.
- **Request Body**:
  ```json
  {
    "fen": "...",
    "userRatingBand": "800-1400"
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "beginner": "White has a pawn attacking the black knight on e5.",
    "intermediate": "Black's bishop on b7 is currently bite-on-granite against White's d5 pawn pawn chain.",
    "master": "The d6 square is an irremediable hole in Black's pawn structure; White should maneuver the knight via d2-c4-e3 to permanently outpost on d6.",
    "keyTakeaway": "Look beyond direct piece attacks to permanent structural outposts."
  }
  ```

---

## 4. Post-Game Analysis & Thought Replay

### `POST /api/games/:id/analyze`
Trigger post-game analysis on a completed game.
- **Response** (`200 OK`):
  ```json
  {
    "accuracyWhite": 84.2,
    "accuracyBlack": 71.5,
    "moveCounts": {
      "best": 18,
      "excellent": 5,
      "good": 6,
      "inaccuracies": 3,
      "mistakes": 2,
      "blunders": 1
    },
    "criticalMoments": [
      {
        "id": "moment_1",
        "ply": 27,
        "fen": "...",
        "type": "blunder",
        "userMove": "Qe2",
        "bestMove": "Rd1"
      }
    ],
    "summary": "You controlled the opening smoothly but slipped into tunnel vision around move 14 by ignoring Black's counterplay on the c-file."
  }
  ```

### `POST /api/critical-moments/:id/thought-review`
Submit user's self-reported intention during Thought Replay.
- **Request Body**:
  ```json
  {
    "userThought": "I wanted to attack the queen and force it to retreat."
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "verdict": "Cognitive Blind Spot Detected",
    "coachFeedback": "While your desire to gain tempo on the queen is understandable, the queen had a safe escape square on a5 that simultaneously attacked your undefended bishop. Strong players verify that enemy pieces have no counter-attacking escape squares before initiating an attack.",
    "taggedHabits": ["Tunnel Vision Attack", "Overvaluing Initiative"],
    "actionableTip": "Always ask: 'If my opponent moves the attacked piece, where can it go and what does it attack?'"
  }
  ```

---

## 5. Thinking Profile & Training

### `GET /api/profile/me`
Retrieve user's cognitive thinking profile.
- **Response** (`200 OK`):
  ```json
  {
    "gamesAnalyzed": 12,
    "strengths": [
      "Consistent king safety awareness",
      "Solves tactical pins with 82% accuracy"
    ],
    "weaknesses": [
      "Ignores opponent counter-threats after launching attacks (occurred in 4 of last 5 games)",
      "Leaves minor pieces undefended during kingside pawn storms"
    ],
    "topPriorities": [
      "Practice Opponent Intent scanning",
      "Candidate move discipline before tactical checks"
    ]
  }
  ```


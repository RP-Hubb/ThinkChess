# ThinkChess — UI/UX Design System Guidelines

## 1. Visual Direction & Anti-UI Slop Philosophy
ThinkChess is built to evoke the serene, focused intensity of a grandmaster's study room. It is intentionally free from generic AI interface clichés:
- **No** gratuitous glowing neon gradients.
- **No** unusable glassmorphism with unreadable contrast.
- **No** decorative floating cards or placeholder mock buttons.
- **Yes** to razor-sharp typography, purposeful spatial hierarchy, tactile feedback, and board-first ergonomics.

---

## 2. Color Palette & Surface Tokens

### Background & Surface Hierarchy
| Token | Hex | Role |
|---|---|---|
| `bg-canvas` | `#0B0D13` | Deep space canvas background |
| `bg-surface-subtle` | `#131722` | Cards, panels, board perimeter frame |
| `bg-surface-elevated`| `#1A1F2E` | Modals, active tabs, floating tooltips |
| `border-subtle` | `#242B3D` | Default dividing borders (1px) |
| `border-strong` | `#36415D` | Focused inputs, active board square highlights |

### Text & Icon Contrast
| Token | Hex | Role |
|---|---|---|
| `text-primary` | `#F1F5F9` | Primary headings, move notation, board coordinates |
| `text-secondary` | `#94A3B8` | Body text, coach explanations, player ratings |
| `text-muted` | `#64748B` | Subtle captions, timestamps, inactive states |

### Semantic Chess Accents
| Accent | Hex | Semantic Meaning |
|---|---|---|
| `accent-emerald` | `#10B981` | Best move, winning evaluation advantage, positive thinking habit |
| `accent-sky` | `#0284C7` | Neutral coach insight, Master notice, active piece selection |
| `accent-amber` | `#F59E0B` | Inaccuracy, cautionary threat alert, candidate move suggestion |
| `accent-rose` | `#EF4444` | Blunder, check alert, critical turning point, hanging piece |
| `accent-violet` | `#8B5CF6` | Thought Replay highlight, cognitive pattern tag |

---

## 3. Typography
- **Primary Interface**: Inter or Plus Jakarta Sans (`font-sans`), tracking `-0.01em` for titles, regular `400` / medium `500` for body.
- **Chess Notation & Clocks**: JetBrains Mono or Fira Code (`font-mono`, `font-feature-settings: 'tnum' 1`) to ensure numerical alignment during countdowns and PGN notation scrubbing.

---

## 4. Gameplay Board Layout (Desktop & Mobile)

### Desktop (Viewport >= 1024px)
```
┌────────────────────────────────────────────────────────────────────────┐
│ ThinkChess Navbar (Logo, Mode Selector, Bot Level, Sound, Profile)     │
├─────────┬───────────────────────────────┬──────────────────────────────┤
│  Eval   │                               │       Live Coach Dock        │
│  Bar    │        Chessboard UI          ├──────────────────────────────┤
│  (32px) │    (Max 640px, Square 1:1)    │      Opponent Intent Card    │
│         │                               ├──────────────────────────────┤
│         │                               │ Move Notation & Game Actions │
│         │                               │   (Resign, Draw, Flip, Undo) │
└─────────┴───────────────────────────────┴──────────────────────────────┘
```

### Mobile (Viewport < 1024px)
- Board occupies the top viewport width (touch optimized, minimum 44px tap targets per square).
- Tabbed bottom drawer with swipe gestures:
  - Tab 1: Coach & Opponent Intent
  - Tab 2: Move Notation & Clocks
  - Tab 3: "What Would a Master Notice?"

---

## 5. Interaction Standards
1. **Move Input**:
   - Drag and drop (native HTML5 / touch events handled cleanly by `react-chessboard`).
   - Click-to-move (click piece -> legal move target dots appear -> click target square).
2. **Move Confirmation & Blunder Interception**:
   - In Blunder Prevention Mode, a non-obtrusive, elegant warning overlay appears with clear CTAs:
     - `Reconsider (ESC)`
     - `View Hint`
     - `Play Anyway`
3. **Sound Effects**:
   - Crisp, organic audio tokens:
     - `move.mp3`: Subtle piece placement on wood/felt.
     - `capture.mp3`: Deeper tactile wooden click.
     - `check.mp3`: Crisp bell chime.
     - `blunder_warning.mp3`: Gentle low double-frequency tone (never harsh buzzer).
   - Global mute toggle accessible from top-level controls.

---

## 6. Accessibility & Keyboard Navigation (WCAG 2.2 AA)
- Board coordinates (`a`–`h`, `1`–`8`) always legible.
- High-contrast square palette (Dark: `#53677A`, Light: `#B8C5D6`).
- Full keyboard navigation for move history replay (Left arrow = previous ply, Right arrow = next ply).
- Screen-reader friendly aria-labels for every square (e.g. `aria-label="e4 white pawn"`).

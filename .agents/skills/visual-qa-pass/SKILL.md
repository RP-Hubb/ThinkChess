---
name: visual-qa-pass
description: Comprehensive QA verification procedure for animated DSA modules, covering layout shifts, token compliance, 60fps pacing, and responsiveness.
---

# Visual QA Pass Skill

Before any visualizer module is considered complete, it must pass this end-to-end verification protocol.

## QA Verification Checklist

### 1. Motion & Layout Stability
- [ ] **No Layout Shift (CLS = 0)**: Elements must not cause parent container resize or sudden jumps when states transition.
- [ ] **Fluid FLIP Animations**: When array items swap or shift, verify elements glide smoothly across their path rather than teleporting or snapping.
- [ ] **Scrubber Responsiveness**: Scrubbing back and forth with step forward/backward buttons renders every intermediate state predictably with 0 artifacts.

### 2. Design Token & Color Verification
- [ ] **Cyber Dark Palette**:
  - Backgrounds: `--bg-primary` (`#0a0a0f`), `--bg-card` (`#16161f`)
  - Comparing / Active State: Amber `--accent-amber` (`#ffb300`)
  - Swapping / Mutating State: Magenta `--accent-magenta` (`#ff00aa`)
  - Sorted / Completed State: Emerald `--accent-green` (`#00ff88`)
  - Pivot / Key / Head: Purple `--accent-purple` (`#7c3aed`)
  - Brand Glow: Cyan `--accent-cyan` (`#00e5ff`)
- [ ] **Light Theme Legibility**: Contrast ratios must remain WCAG AA compliant on `--bg-primary: #f0f4ff` and `--bg-card: #ffffff`.

### 3. Playback & State Synchronization
- [ ] **Single Source of Truth**: Active algorithm matches across Sidebar, top tabs, and canvas header.
- [ ] **Pseudocode Sync**: Highlighted line in the `CodePanel` matches the active step's logical line.
- [ ] **Metrics & Narrator**: Step narration sentence updates synchronously with each frame.

### 4. Responsive Viewport Check
- [ ] **Desktop (>= 1280px)**: Two-column layout with visualization canvas + code panel comfortably side-by-side or stacked without vertical scroll traps.
- [ ] **Tablet (768px - 1024px)**: Responsive controls and scrollable canvas where necessary.
- [ ] **Mobile (< 768px)**: Collapsible sidebar, compact controls toolbar, touch-friendly tap targets (minimum 44x44px).

### 5. Performance & Audio Check
- [ ] Maintained 60fps frame rate with datasets up to 100 elements.
- [ ] Audio toggle: Audio stays muted by default; when enabled, pitches track element values cleanly without audio distortion or clicks.

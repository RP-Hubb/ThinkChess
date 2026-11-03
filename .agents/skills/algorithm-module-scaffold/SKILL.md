---
name: algorithm-module-scaffold
description: Scaffold a new DSA visualizer module with a pure step-generator function, React rendering component, and router/sidebar registration.
---

# Algorithm Module Scaffold Skill

This skill standardizes how new algorithms and data structures are added to the DSA Visualizer. Every module in this project follows a strict separation between **step calculation** and **rendering**.

## Architectural Contract

Every algorithm module consists of 3 synchronized layers:

1. **Pure Step-Generator Function** (`src/algorithms/<category>.ts`):
   - Accepts input parameters (e.g. array, target value, graph adjacency matrix).
   - Returns an array of immutable step snapshots:
     ```ts
     interface AlgorithmStep<TState = any> {
       state: TState;                  // Array, tree root, graph state, or DP matrix snapshot
       activeIndices?: number[];       // Indices currently evaluated/compared (amber)
       swapIndices?: number[];         // Indices being swapped/modified (magenta)
       sortedIndices?: number[];       // Elements finalized/settled (green)
       pivotIndex?: number | null;     // Current pivot/root (purple)
       explanation: string;            // Plain-English narration of what occurred in this step
       codeLine: number;               // 0-indexed line number in the pseudocode to highlight
       metrics?: Record<string, number | string>; // e.g. comparisons, swaps, time elapsed
     }
     ```
   - **Must be pure**: No DOM access, no React hooks, no timers.
   - **Thoroughly tested**: Backed by a Vitest test in `tests/<category>.test.ts`.

2. **React Visualizer Component** (`src/components/<category>/<Name>Visualizer.tsx`):
   - Subscribes to global Zustand state for `currentStep`, `isPlaying`, `speed`, and settings.
   - Uses Framer Motion spring physics and `layoutId` / `layout` for FLIP transitions.
   - Renders:
     - Header info (Algorithm title, Big-O badges).
     - Live visualization viewport (bars, SVG tree/graph, grid, stack/queue pipe).
     - Synced `CodePanel` with active line highlight.
     - `PlaybackControls` toolbar with step scrubber and speed controls.

3. **Registry & Router Entry** (`src/store/index.ts` & `src/App.tsx` & `src/components/shared/Sidebar.tsx`):
   - Register the category in `SectionType` and the algorithm ID in `AlgorithmId`.
   - Add sidebar navigation item with icon and category badge.
   - Mount in `App.tsx` router switch.

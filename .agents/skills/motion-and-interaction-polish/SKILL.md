---
name: motion-and-interaction-polish
description: House style and standards for high-fidelity animations, spring physics, layoutId transitions, and reduced motion in DSA Visualizer 2.0.
---

# Motion & Interaction Polish Skill

Animation in DSA Visualizer 2.0 is not decorative styling; it is an intuitive cognitive bridge that makes abstract algorithmic mechanics tangible.

## House Style Principles

1. **Spring-Based Physics Over Linear Easing**:
   - Never use `ease-in-out` or linear timing for physical elements (bars, tree nodes, graph nodes, stack items).
   - Use Framer Motion spring presets:
     - **Snappy / Tight** (Default for swaps and shifts):
       `transition={{ type: "spring", stiffness: 350, damping: 28, mass: 0.8 }}`
     - **Gentle / Floating** (For cards, overlays, dialogs):
       `transition={{ type: "spring", stiffness: 220, damping: 24 }}`
     - **Bouncy / Impact** (For stack drops, hash insertions):
       `transition={{ type: "spring", stiffness: 450, damping: 20, mass: 0.6 }}`

2. **Shared Layout Transitions (`layout` & `layoutId`)**:
   - For items changing indices (e.g. array bars swapping, queue items advancing), use `layout` on the moving items:
     `<motion.div layout transition={{ type: "spring", stiffness: 300, damping: 25 }} />`
   - For moving indicators (active tab pill in sidebar/header, current pointer):
     `<motion.div layoutId="activePill" className="absolute inset-0 bg-accent-cyan/15 rounded-lg" />`

3. **Micro-Interactions on Interactive Elements**:
   - Every button, tab, and slider knob must have responsive tactile feedback:
     ```tsx
     <motion.button
       whileHover={{ scale: 1.03, y: -1 }}
       whileTap={{ scale: 0.97, y: 1 }}
       transition={{ type: "spring", stiffness: 400, damping: 17 }}
     >
     ```

4. **Staggered Entrance Sequences**:
   - When mounting new lists or datasets, stagger children:
     ```tsx
     const containerVariants = {
       hidden: { opacity: 0 },
       show: {
         opacity: 1,
         transition: { staggerChildren: 0.03 }
       }
     };
     ```

5. **Reduced Motion Accessibility**:
   - Always honor the user's OS reduced motion preference:
     ```tsx
     import { useReducedMotion } from 'framer-motion';
     const shouldReduceMotion = useReducedMotion();
     const transition = shouldReduceMotion
       ? { duration: 0 }
       : { type: "spring", stiffness: 300, damping: 25 };
     ```

6. **Ambient UI Aliveness**:
   - Subtle background grid pulse or gentle glowing particle/gradient shift in the viewport background to ensure the app feels dynamic even when paused.
   - Live frame narration caption synced at 60fps with clear typography.

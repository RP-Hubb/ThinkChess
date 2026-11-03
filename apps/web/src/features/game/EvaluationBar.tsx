import React from 'react';
import { useGameStore } from '../../store/gameStore.js';

export const EvaluationBar: React.FC = () => {
  const { activeEvalCp, isFlipped } = useGameStore();

  // Convert centipawns to percentage (capped between -1000 and +1000 cp)
  const capped = Math.max(-800, Math.min(800, activeEvalCp));
  // At 0 cp, white % is 50%. At +400 cp, white % is ~80%.
  // Sigmoid percentage:
  const whitePercent = 50 + (capped / 800) * 45;
  const blackPercent = 100 - whitePercent;

  const topPercent = isFlipped ? whitePercent : blackPercent;
  const bottomPercent = isFlipped ? blackPercent : whitePercent;

  const topColor = isFlipped ? '#F1F5F9' : '#1E2433';
  const bottomColor = isFlipped ? '#1E2433' : '#F1F5F9';

  const evalFormatted = activeEvalCp >= 0 
    ? `+${(activeEvalCp / 100).toFixed(1)}` 
    : `${(activeEvalCp / 100).toFixed(1)}`;

  return (
    <div className="flex flex-col items-center h-full w-6 bg-surface-subtle border border-border-subtle rounded-lg overflow-hidden shadow-md select-none py-1">
      <div 
        className="w-full transition-all duration-300 ease-out flex items-start justify-center text-[10px] font-mono font-bold pt-1"
        style={{ height: `${topPercent}%`, backgroundColor: topColor, color: isFlipped ? '#0B0D13' : '#94A3B8' }}
      >
        {!isFlipped && activeEvalCp < -50 ? evalFormatted : null}
      </div>

      <div 
        className="w-full transition-all duration-300 ease-out flex items-end justify-center text-[10px] font-mono font-bold pb-1"
        style={{ height: `${bottomPercent}%`, backgroundColor: bottomColor, color: isFlipped ? '#94A3B8' : '#0B0D13' }}
      >
        {!isFlipped && activeEvalCp >= -50 ? evalFormatted : null}
      </div>
    </div>
  );
};


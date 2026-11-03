import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { MoveClassification } from '@thinkchess/chess-core';

export const MoveHistory: React.FC = () => {
  const { history, status, winner } = useGameStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history.length]);

  // Group moves into pairs (White & Black)
  const rows: Array<{
    moveNum: number;
    white?: typeof history[0];
    black?: typeof history[0];
  }> = [];

  for (let i = 0; i < history.length; i += 2) {
    rows.push({
      moveNum: Math.floor(i / 2) + 1,
      white: history[i],
      black: history[i + 1],
    });
  }

  const getBadgeClass = (classification?: MoveClassification) => {
    switch (classification) {
      case 'best': return 'text-accent-emerald bg-accent-emerald/10';
      case 'excellent': return 'text-emerald-400 bg-emerald-500/10';
      case 'good': return 'text-slate-300 bg-slate-700/30';
      case 'inaccuracy': return 'text-accent-amber bg-accent-amber/10';
      case 'mistake': return 'text-orange-400 bg-orange-500/10';
      case 'blunder': return 'text-accent-rose bg-accent-rose/15 font-semibold';
      case 'brilliant': return 'text-cyan-400 bg-cyan-500/20 font-bold';
      default: return 'text-slate-200';
    }
  };

  return (
    <div className="flex flex-col h-full bg-surface-subtle border border-border-subtle rounded-xl overflow-hidden shadow-lg">
      <div className="px-3.5 py-2.5 bg-surface-elevated border-b border-border-subtle flex items-center justify-between">
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Move Notation
        </h4>
        <span className="text-[11px] font-mono text-slate-400">
          Plies: {history.length}
        </span>
      </div>

      <div className="flex-1 p-2 overflow-y-auto font-mono text-xs space-y-1">
        {rows.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            Moves will appear here as you play.
          </div>
        ) : (
          rows.map(r => (
            <div key={r.moveNum} className="flex items-center px-2 py-1 rounded hover:bg-surface-elevated/40">
              <span className="w-8 text-slate-500 select-none">{r.moveNum}.</span>
              
              {/* White Move */}
              <div className="flex-1 flex items-center justify-between pr-2">
                <span className="font-medium text-slate-200">{r.white?.san}</span>
                {r.white?.classification && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${getBadgeClass(r.white.classification)}`}>
                    {r.white.classification}
                  </span>
                )}
              </div>

              {/* Black Move */}
              <div className="flex-1 flex items-center justify-between pl-2 border-l border-border-subtle/40">
                <span className="font-medium text-slate-200">{r.black?.san || ''}</span>
                {r.black?.classification && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${getBadgeClass(r.black.classification)}`}>
                    {r.black.classification}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {status !== 'in_progress' && (
        <div className="p-3 bg-surface-elevated border-t border-border-strong text-center text-xs space-y-1">
          <span className="font-bold uppercase tracking-wider text-accent-emerald">
            Game Over: {status.replace('_', ' ')}
          </span>
          {winner && (
            <p className="text-slate-300">
              Winner: {winner === 'w' ? 'White' : 'Black'}
            </p>
          )}
        </div>
      )}
    </div>
  );
};


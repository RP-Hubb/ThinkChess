import React, { useState } from 'react';
import { ShieldAlert, ArrowLeft, Play } from 'lucide-react';
import { useGameStore } from '../../store/gameStore.js';

export const BlunderWarningModal: React.FC = () => {
  const { pendingBlunder, confirmBlunderMove, cancelBlunderMove } = useGameStore();
  const [showHint, setShowHint] = useState(false);

  if (!pendingBlunder) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface-elevated border border-accent-rose/50 max-w-md w-full p-6 rounded-2xl shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center gap-3 text-accent-rose">
          <div className="p-2.5 bg-accent-rose/10 rounded-xl border border-accent-rose/20">
            <ShieldAlert className="w-6 h-6 text-accent-rose" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">Blunder Prevention Alert</h2>
            <p className="text-xs text-accent-rose/90 font-medium">Pause & verify before committing</p>
          </div>
        </div>

        <div className="p-4 bg-surface-subtle/80 border border-border-subtle rounded-xl text-sm text-slate-200 leading-relaxed">
          {pendingBlunder.warningMessage}
        </div>

        {showHint ? (
          <div className="p-3 bg-accent-amber/10 border border-accent-amber/30 rounded-lg text-xs text-accent-amber leading-normal">
            💡 <span className="font-semibold">Hint:</span> {pendingBlunder.hint}
          </div>
        ) : (
          <button
            onClick={() => setShowHint(true)}
            className="text-xs text-accent-sky hover:underline font-medium inline-block"
          >
            Show Tactical Hint →
          </button>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={() => {
              setShowHint(false);
              cancelBlunderMove();
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-accent-emerald hover:bg-emerald-600 text-slate-950 font-semibold text-xs rounded-lg transition-all shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            Reconsider Move (Recommended)
          </button>
          <button
            onClick={() => {
              setShowHint(false);
              confirmBlunderMove();
            }}
            className="flex items-center gap-1.5 px-3 py-2.5 bg-surface-subtle hover:bg-surface-card border border-border-subtle text-slate-400 hover:text-slate-200 text-xs rounded-lg transition-all"
          >
            <Play className="w-3.5 h-3.5" />
            Play Anyway
          </button>
        </div>
      </div>
    </div>
  );
};


import React, { useState } from 'react';
import { X, Award, BarChart3, Brain, ArrowRight, RefreshCw } from 'lucide-react';
import { useGameStore } from '../../store/gameStore.js';
import { calculateAccuracy, calculateCentipawnLoss } from '@thinkchess/chess-core';
import { ThoughtReplayModal } from '../thought-replay/ThoughtReplayModal.js';
import { ThinkingProfileModal } from '../profile/ThinkingProfileModal.js';

interface Props {
  onClose: () => void;
}

export const PostGameModal: React.FC<Props> = ({ onClose }) => {
  const { history, status, winner, resetGame } = useGameStore();
  const [showThoughtReplay, setShowThoughtReplay] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Calculate accuracies
  const whiteLosses = history
    .filter(m => m.color === 'w')
    .map(m => calculateCentipawnLoss(m.evalBeforeCp || 0, m.evalAfterCp || 0, 'w'));

  const blackLosses = history
    .filter(m => m.color === 'b')
    .map(m => calculateCentipawnLoss(m.evalBeforeCp || 0, m.evalAfterCp || 0, 'b'));

  const whiteAccuracy = calculateAccuracy(whiteLosses);
  const blackAccuracy = calculateAccuracy(blackLosses);

  // Tally move classifications
  const counts = {
    best: history.filter(m => m.classification === 'best').length,
    excellent: history.filter(m => m.classification === 'excellent').length,
    good: history.filter(m => m.classification === 'good').length,
    inaccuracy: history.filter(m => m.classification === 'inaccuracy').length,
    mistake: history.filter(m => m.classification === 'mistake').length,
    blunder: history.filter(m => m.classification === 'blunder').length,
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface-elevated border border-border-strong max-w-lg w-full p-6 rounded-2xl shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-border-subtle pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-accent-emerald" />
            <div>
              <h2 className="text-base font-bold text-slate-100">Post-Game Report</h2>
              <span className="text-[11px] text-slate-400 capitalize">
                Outcome: {status.replace('_', ' ')}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Accuracies */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 bg-surface-subtle border border-border-subtle rounded-xl text-center space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              White Accuracy
            </span>
            <div className="text-2xl font-bold font-mono text-accent-emerald">
              {whiteAccuracy}%
            </div>
          </div>

          <div className="p-4 bg-surface-subtle border border-border-subtle rounded-xl text-center space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Black Accuracy
            </span>
            <div className="text-2xl font-bold font-mono text-accent-sky">
              {blackAccuracy}%
            </div>
          </div>
        </div>

        {/* Move Classification Breakdown */}
        <div className="p-3.5 bg-surface-subtle border border-border-subtle rounded-xl space-y-2">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Move Quality Breakdown
          </span>
          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            <div className="p-2 bg-surface-card rounded border border-border-subtle flex justify-between">
              <span className="text-accent-emerald">Best:</span>
              <span className="font-bold">{counts.best}</span>
            </div>
            <div className="p-2 bg-surface-card rounded border border-border-subtle flex justify-between">
              <span className="text-emerald-400">Excellent:</span>
              <span className="font-bold">{counts.excellent}</span>
            </div>
            <div className="p-2 bg-surface-card rounded border border-border-subtle flex justify-between">
              <span className="text-slate-300">Good:</span>
              <span className="font-bold">{counts.good}</span>
            </div>
            <div className="p-2 bg-surface-card rounded border border-border-subtle flex justify-between">
              <span className="text-accent-amber">Inaccuracies:</span>
              <span className="font-bold">{counts.inaccuracy}</span>
            </div>
            <div className="p-2 bg-surface-card rounded border border-border-subtle flex justify-between">
              <span className="text-orange-400">Mistakes:</span>
              <span className="font-bold">{counts.mistake}</span>
            </div>
            <div className="p-2 bg-surface-card rounded border border-border-subtle flex justify-between">
              <span className="text-accent-rose">Blunders:</span>
              <span className="font-bold">{counts.blunder}</span>
            </div>
          </div>
        </div>

        {/* Thought Replay CTA */}
        <div className="p-4 bg-accent-violet/10 border border-accent-violet/30 rounded-xl flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-accent-violet" />
              Launch Thought Replay
            </h4>
            <p className="text-[11px] text-slate-300">
              Reflect on critical decision points and train thinking habits.
            </p>
          </div>
          <button
            onClick={() => setShowThoughtReplay(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-accent-violet hover:bg-violet-600 text-slate-950 font-semibold text-xs rounded-lg transition-all"
          >
            Review <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setShowProfile(true)}
            className="flex items-center gap-1.5 text-xs text-accent-sky hover:underline font-medium"
          >
            <BarChart3 className="w-4 h-4" /> View Thinking Profile
          </button>

          <button
            onClick={() => {
              resetGame();
              onClose();
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-accent-emerald hover:bg-emerald-600 text-slate-950 font-semibold text-xs rounded-lg transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Start New Game
          </button>
        </div>
      </div>

      {showThoughtReplay && (
        <ThoughtReplayModal onClose={() => setShowThoughtReplay(false)} />
      )}

      {showProfile && (
        <ThinkingProfileModal onClose={() => setShowProfile(false)} />
      )}
    </div>
  );
};


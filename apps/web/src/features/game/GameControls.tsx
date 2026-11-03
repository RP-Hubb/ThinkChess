import React from 'react';
import { 
  RotateCw, 
  RotateCcw, 
  Flag, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  ShieldOff
} from 'lucide-react';
import { useGameStore } from '../../store/gameStore.js';
import { 
  GameMode, 
  BotPersonalityId, 
  BotDifficulty, 
  BOT_PERSONALITIES, 
  DIFFICULTY_CONFIGS 
} from '@thinkchess/chess-core';

export const GameControls: React.FC = () => {
  const { 
    flipBoard, 
    undoMove, 
    resetGame, 
    soundEnabled, 
    toggleSound, 
    blunderPrevention, 
    toggleBlunderPrevention,
    mode,
    setMode,
    botPersonality,
    botDifficulty,
    setBotConfig,
    whiteHintsEnabled,
    blackHintsEnabled,
    setWhiteHints,
    setBlackHints
  } = useGameStore();

  return (
    <div className="flex flex-col gap-3 p-3.5 bg-surface-subtle border border-border-subtle rounded-xl shadow-lg text-xs">
      {/* Top Row: Game Mode & Bot Selection */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-subtle pb-3">
        {/* Mode Selector */}
        <div className="flex items-center gap-1.5">
          {(['play_vs_bot', 'self_play', 'analysis'] as GameMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                mode === m
                  ? 'bg-accent-sky text-slate-950 font-semibold shadow-sm'
                  : 'bg-surface-elevated hover:bg-surface-card text-slate-300'
              }`}
            >
              {m === 'play_vs_bot' ? '🤖 Play vs Bot' : m === 'self_play' ? '🔄 Self-Play' : '🔍 Analysis'}
            </button>
          ))}
        </div>

        {/* Action Toggles: Sound & Blunder Prevention */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleBlunderPrevention}
            title="Toggle Blunder Prevention"
            className={`p-1.5 rounded-lg border transition-all ${
              blunderPrevention 
                ? 'bg-accent-emerald/15 border-accent-emerald/40 text-accent-emerald' 
                : 'bg-surface-elevated border-border-subtle text-slate-500'
            }`}
          >
            {blunderPrevention ? <ShieldCheck className="w-4 h-4" /> : <ShieldOff className="w-4 h-4" />}
          </button>

          <button
            onClick={toggleSound}
            title="Toggle Sound"
            className={`p-1.5 rounded-lg border transition-all ${
              soundEnabled 
                ? 'bg-surface-elevated border-border-subtle text-slate-200' 
                : 'bg-surface-elevated border-border-subtle text-slate-600'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Middle Row: Bot Config (when in Play vs Bot mode) */}
      {mode === 'play_vs_bot' && (
        <div className="flex flex-wrap items-center justify-between gap-2 bg-surface-card p-2.5 rounded-lg border border-border-subtle">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400">Opponent:</span>
            <select
              value={botPersonality}
              onChange={(e) => setBotConfig(e.target.value as BotPersonalityId, botDifficulty)}
              className="bg-surface-elevated border border-border-strong text-slate-200 px-2 py-1 rounded text-xs focus:outline-none"
            >
              {Object.values(BOT_PERSONALITIES).map(b => (
                <option key={b.id} value={b.id}>
                  {b.avatar} {b.name} ({b.style})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400">Level:</span>
            <select
              value={botDifficulty}
              onChange={(e) => setBotConfig(botPersonality, e.target.value as BotDifficulty)}
              className="bg-surface-elevated border border-border-strong text-slate-200 px-2 py-1 rounded text-xs focus:outline-none capitalize"
            >
              {Object.keys(DIFFICULTY_CONFIGS).map(d => (
                <option key={d} value={d}>
                  {d} (~{DIFFICULTY_CONFIGS[d as BotDifficulty].ratingEstimate} Elo)
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Independent Hints Toggles (when in Self-Play mode) */}
      {mode === 'self_play' && (
        <div className="flex items-center justify-between bg-surface-card p-2.5 rounded-lg border border-border-subtle">
          <span className="text-[11px] font-semibold text-slate-300">Independent Hints:</span>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-200">
              <input
                type="checkbox"
                checked={whiteHintsEnabled}
                onChange={(e) => setWhiteHints(e.target.checked)}
                className="rounded accent-accent-emerald"
              />
              White Hints
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-200">
              <input
                type="checkbox"
                checked={blackHintsEnabled}
                onChange={(e) => setBlackHints(e.target.checked)}
                className="rounded accent-accent-emerald"
              />
              Black Hints
            </label>
          </div>
        </div>
      )}

      {/* Bottom Row: Game State Actions */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <button
            onClick={undoMove}
            className="flex items-center gap-1 px-3 py-1.5 bg-surface-elevated hover:bg-surface-card border border-border-subtle text-slate-300 hover:text-slate-100 rounded-lg transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Undo
          </button>
          <button
            onClick={flipBoard}
            className="flex items-center gap-1 px-3 py-1.5 bg-surface-elevated hover:bg-surface-card border border-border-subtle text-slate-300 hover:text-slate-100 rounded-lg transition-all"
          >
            <RotateCw className="w-3.5 h-3.5" />
            Flip
          </button>
        </div>

        <button
          onClick={() => resetGame()}
          className="flex items-center gap-1 px-3 py-1.5 bg-surface-elevated hover:bg-accent-rose/20 border border-border-subtle hover:border-accent-rose/50 text-slate-300 hover:text-accent-rose rounded-lg transition-all"
        >
          <Flag className="w-3.5 h-3.5" />
          New Game
        </button>
      </div>
    </div>
  );
};


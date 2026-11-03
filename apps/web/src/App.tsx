import React, { useState } from 'react';
import { 
  Sparkles, 
  BarChart3, 
  Award, 
  ShieldCheck, 
  RotateCcw,
  Compass,
  Cpu
} from 'lucide-react';
import { ChessboardView } from './features/board/ChessboardView.js';
import { CoachPanel } from './features/coach/CoachPanel.js';
import { MoveHistory } from './features/game/MoveHistory.js';
import { GameControls } from './features/game/GameControls.js';
import { EvaluationBar } from './features/game/EvaluationBar.js';
import { BlunderWarningModal } from './features/coach/BlunderWarningModal.js';
import { PostGameModal } from './features/analysis/PostGameModal.js';
import { ThinkingProfileModal } from './features/profile/ThinkingProfileModal.js';
import { useGameStore } from './store/gameStore.js';

export const App: React.FC = () => {
  const { status, turn, mode, history } = useGameStore();
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const isGameOver = status !== 'in_progress';

  return (
    <div className="min-h-screen bg-canvas text-slate-100 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="h-14 border-b border-border-subtle bg-surface-subtle/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-sky to-accent-emerald flex items-center justify-center font-bold text-slate-950 text-base shadow-md">
            ♟
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-slate-100">
                ThinkChess
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-accent-sky/15 text-accent-sky border border-accent-sky/30">
                v1.0 MVP
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
              Learn how to think, not just what to play
            </p>
          </div>
        </div>

        {/* Status & Navigation */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 bg-surface-card border border-border-subtle rounded-full text-xs">
            <span className={`w-2 h-2 rounded-full ${turn === 'w' ? 'bg-slate-200' : 'bg-slate-900 border border-slate-600'}`} />
            <span className="font-mono text-[11px] text-slate-300">
              {isGameOver ? status.replace('_', ' ').toUpperCase() : `${turn === 'w' ? 'White' : 'Black'} to move`}
            </span>
          </div>

          {history.length > 0 && (
            <button
              onClick={() => setShowAnalysis(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-emerald/15 hover:bg-accent-emerald/25 border border-accent-emerald/40 text-accent-emerald text-xs font-semibold rounded-lg transition-all"
            >
              <Award className="w-3.5 h-3.5" />
              Game Report
            </button>
          )}

          <button
            onClick={() => setShowProfile(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-elevated hover:bg-surface-card border border-border-subtle text-slate-200 text-xs font-semibold rounded-lg transition-all"
          >
            <BarChart3 className="w-3.5 h-3.5 text-accent-sky" />
            <span className="hidden sm:inline">Thinking Profile</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Chessboard & Eval Bar */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex gap-3 justify-center items-stretch">
            {/* Real-time Evaluation Bar */}
            <EvaluationBar />

            {/* Interactive Chessboard */}
            <div className="flex-1 max-w-[560px]">
              <ChessboardView />
            </div>
          </div>

          {/* Game Controls Panel directly below board */}
          <GameControls />
        </div>

        {/* Right Column: Live Coach & Move Notation */}
        <div className="lg:col-span-5 flex flex-col gap-4 h-[640px]">
          {/* Live Coach and Opponent Intent Panel */}
          <div className="flex-1 overflow-hidden">
            <CoachPanel />
          </div>

          {/* Move History List */}
          <div className="h-52 overflow-hidden">
            <MoveHistory />
          </div>
        </div>
      </main>

      {/* Pre-Move Blunder Warning Interceptor */}
      <BlunderWarningModal />

      {/* Post-Game Report and Thought Replay Launcher */}
      {showAnalysis && (
        <PostGameModal onClose={() => setShowAnalysis(false)} />
      )}

      {/* Thinking Profile Dashboard */}
      {showProfile && (
        <ThinkingProfileModal onClose={() => setShowProfile(false)} />
      )}
    </div>
  );
};


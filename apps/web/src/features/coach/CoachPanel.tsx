import React, { useState } from 'react';
import { 
  Compass, 
  Eye, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  Lightbulb, 
  ChevronRight,
  Sparkles,
  Bot
} from 'lucide-react';
import { useGameStore } from '../../store/gameStore.js';
import { MasterNoticeModal } from './MasterNoticeModal.js';

export const CoachPanel: React.FC = () => {
  const { 
    currentIntent, 
    currentExplanation, 
    history, 
    turn, 
    mode, 
    whiteHintsEnabled, 
    blackHintsEnabled,
    isThinking
  } = useGameStore();

  const [activeTab, setActiveTab] = useState<'coach' | 'intent'>('coach');
  const [showMasterNotice, setShowMasterNotice] = useState(false);

  const lastMove = history[history.length - 1];
  const hintsAllowed = turn === 'w' ? whiteHintsEnabled : blackHintsEnabled;

  return (
    <div className="flex flex-col h-full bg-surface-subtle border border-border-subtle rounded-xl overflow-hidden shadow-xl">
      {/* Panel Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-surface-elevated/70 border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-accent-sky/15 text-accent-sky rounded-lg">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 tracking-wide uppercase">
              Live AI Coach
            </h3>
            <span className="text-[10px] text-slate-400">
              {isThinking ? 'Thinking...' : 'Ready to analyze'}
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowMasterNotice(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-accent-sky/10 hover:bg-accent-sky/20 border border-accent-sky/30 text-accent-sky text-[11px] font-semibold rounded-lg transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          What Would a Master Notice?
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-border-subtle bg-surface-subtle/50 text-xs">
        <button
          onClick={() => setActiveTab('coach')}
          className={`flex-1 py-2.5 px-3 font-medium transition-colors border-b-2 ${
            activeTab === 'coach'
              ? 'border-accent-sky text-accent-sky bg-surface-elevated/40'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Coach Explanation
        </button>
        <button
          onClick={() => setActiveTab('intent')}
          className={`flex-1 py-2.5 px-3 font-medium transition-colors border-b-2 ${
            activeTab === 'intent'
              ? 'border-accent-amber text-accent-amber bg-surface-elevated/40'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Opponent Intent
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {mode === 'self_play' && (
          <div className="px-3 py-2 bg-surface-card border border-border-subtle rounded-lg flex items-center justify-between text-xs">
            <span className="text-slate-400">Independent Hints:</span>
            <div className="flex gap-2 font-mono text-[11px]">
              <span className={`px-2 py-0.5 rounded ${whiteHintsEnabled ? 'bg-accent-emerald/20 text-accent-emerald' : 'bg-slate-800 text-slate-500'}`}>
                White: {whiteHintsEnabled ? 'ON' : 'OFF'}
              </span>
              <span className={`px-2 py-0.5 rounded ${blackHintsEnabled ? 'bg-accent-emerald/20 text-accent-emerald' : 'bg-slate-800 text-slate-500'}`}>
                Black: {blackHintsEnabled ? 'ON' : 'OFF'}
              </span>
            </div>
          </div>
        )}

        {/* Tab 1: Coach Explanation */}
        {activeTab === 'coach' && (
          <div className="space-y-3">
            {currentExplanation ? (
              <div className="space-y-3">
                <div className="p-3 bg-surface-elevated border border-border-subtle rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-accent-emerald uppercase tracking-wider">
                      {currentExplanation.quality} Move
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Last: {lastMove ? lastMove.san : '-'}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-100">
                    {currentExplanation.title}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentExplanation.explanation}
                  </p>
                </div>

                <div className="p-3 bg-surface-card border border-border-subtle rounded-xl space-y-1.5">
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                    Strategic Concept
                  </span>
                  <p className="text-xs text-slate-200 font-medium">
                    {currentExplanation.strategicIdea}
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center space-y-2 text-slate-400">
                <Compass className="w-8 h-8 mx-auto text-slate-600 stroke-[1.5]" />
                <p className="text-xs">Make a move on the board to receive active coaching.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Opponent Intent Detection */}
        {activeTab === 'intent' && (
          <div className="space-y-3">
            {currentIntent ? (
              <div className="space-y-3">
                {/* Summary */}
                <div className="p-3 bg-surface-elevated border border-accent-amber/30 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-accent-amber uppercase tracking-wider">
                    Opponent Plan
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    {currentIntent.opponentPlan}
                  </p>
                </div>

                {/* What Changed */}
                <div className="p-3 bg-surface-card border border-border-subtle rounded-xl space-y-2">
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-accent-sky" />
                    What Changed?
                  </span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {currentIntent.whatChanged.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-accent-sky mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Threats */}
                <div className="p-3 bg-surface-card border border-border-subtle rounded-xl space-y-2">
                  <span className="text-xs font-semibold text-accent-rose flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-accent-rose" />
                    Potential Threats
                  </span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {currentIntent.threats.map((threat, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-accent-rose mt-0.5">•</span>
                        <span>{threat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pre-Move Checklist */}
                <div className="p-3 bg-surface-card border border-border-subtle rounded-xl space-y-2">
                  <span className="text-xs font-semibold text-accent-emerald flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent-emerald" />
                    Before You Move Checklist
                  </span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {currentIntent.preMoveChecklist.map((check, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-accent-emerald mt-0.5">✓</span>
                        <span>{check}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center space-y-2 text-slate-400">
                <Eye className="w-8 h-8 mx-auto text-slate-600 stroke-[1.5]" />
                <p className="text-xs">Opponent intent will appear here after the opponent's move.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Master Notice Modal */}
      {showMasterNotice && (
        <MasterNoticeModal onClose={() => setShowMasterNotice(false)} />
      )}
    </div>
  );
};


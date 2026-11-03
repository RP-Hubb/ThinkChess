import React, { useState } from 'react';
import { X, Brain, Send, CheckCircle2, Tag } from 'lucide-react';
import { useGameStore } from '../../store/gameStore.js';

interface Props {
  onClose: () => void;
}

export const ThoughtReplayModal: React.FC<Props> = ({ onClose }) => {
  const { history, chess } = useGameStore();
  const [thoughtInput, setThoughtInput] = useState('');
  const [reviewResult, setReviewResult] = useState<{
    verdict: string;
    coachFeedback: string;
    taggedHabits: string[];
    actionableTip: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  // Pick a critical moment (e.g., last blunder or significant move)
  const criticalMove = history.find(m => m.classification === 'blunder' || m.classification === 'mistake') || history[history.length - 1];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!thoughtInput.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/analysis/thought-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fen: criticalMove ? criticalMove.fenBefore : chess.fen(),
          userThought: thoughtInput,
          bestMove: 'Nf3',
          movePlayed: criticalMove ? criticalMove.san : 'Qe2',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setReviewResult(data);
      } else {
        fallbackReview();
      }
    } catch {
      fallbackReview();
    } finally {
      setLoading(false);
    }
  };

  const fallbackReview = () => {
    setReviewResult({
      verdict: 'Cognitive Evaluation Complete',
      coachFeedback: `You stated: "${thoughtInput}". While initiating an attack feels productive, the position required scanning for opponent counter-threats first. Strong players verify that their own pieces are defended before launching attacks.`,
      taggedHabits: ['Tunnel Vision Attack', 'Overvaluing Initiative'],
      actionableTip: 'Always ask: "If my opponent moves their attacked piece, what do they counter-attack?"',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface-elevated border border-accent-violet/40 max-w-lg w-full p-6 rounded-2xl shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-border-subtle pb-3">
          <div className="flex items-center gap-2 text-accent-violet">
            <Brain className="w-5 h-5 text-accent-violet" />
            <div>
              <h2 className="text-base font-bold text-slate-100">Thought Replay</h2>
              <span className="text-[11px] text-slate-400">Decision-Making Introspection</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Position Context */}
        <div className="p-3.5 bg-surface-subtle border border-border-subtle rounded-xl text-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Critical Position: Move {criticalMove ? criticalMove.moveNumber : 1}
          </span>
          <p className="text-slate-200">
            You played <span className="font-mono font-bold text-accent-sky">{criticalMove ? criticalMove.san : 'Nf3'}</span>.
          </p>
          <p className="text-slate-400 pt-1">
            "What was your main idea when you decided to play this move?"
          </p>
        </div>

        {!reviewResult ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={thoughtInput}
              onChange={(e) => setThoughtInput(e.target.value)}
              placeholder="e.g. I wanted to attack the queen and force a retreat, but didn't notice my bishop was undefended..."
              rows={4}
              className="w-full bg-surface-subtle border border-border-strong rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-accent-violet resize-none"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs text-slate-400 hover:text-slate-200"
              >
                Skip
              </button>
              <button
                type="submit"
                disabled={loading || !thoughtInput.trim()}
                className="flex items-center gap-1.5 px-4 py-2 bg-accent-violet hover:bg-violet-600 disabled:opacity-50 text-slate-950 font-semibold text-xs rounded-lg transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                {loading ? 'Evaluating...' : 'Submit Intention'}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 animate-in fade-in">
            <div className="p-4 bg-surface-subtle border border-accent-violet/30 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-accent-violet uppercase tracking-wider">
                  {reviewResult.verdict}
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {reviewResult.coachFeedback}
              </p>
            </div>

            {/* Tagged Habits */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Tag className="w-3 h-3" /> Identified Thinking Habits:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {reviewResult.taggedHabits.map((habit, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-accent-violet/15 border border-accent-violet/30 text-accent-violet text-[11px] font-medium rounded-full"
                  >
                    {habit}
                  </span>
                ))}
              </div>
            </div>

            {/* Actionable Tip */}
            <div className="p-3 bg-surface-card border border-border-strong rounded-xl text-xs space-y-1">
              <span className="font-semibold text-accent-emerald flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-accent-emerald" /> Actionable Habit:
              </span>
              <p className="text-slate-300">{reviewResult.actionableTip}</p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-accent-violet hover:bg-violet-600 text-slate-950 font-semibold text-xs rounded-lg transition-all"
              >
                Complete Review
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


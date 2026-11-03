import React, { useState, useEffect } from 'react';
import { X, Sparkles, GraduationCap, Award, Crown } from 'lucide-react';
import { useGameStore } from '../../store/gameStore.js';
import { extractBoardFacts, MasterNoticeResponse } from '@thinkchess/chess-core';

interface Props {
  onClose: () => void;
}

export const MasterNoticeModal: React.FC<Props> = ({ onClose }) => {
  const { chess } = useGameStore();
  const [data, setData] = useState<MasterNoticeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const res = await fetch('/api/coach/master-notice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fen: chess.fen(), userRatingBand: '800-1400' }),
        });
        if (res.ok) {
          const json = await res.json();
          setData(json);
        } else {
          fallbackLocalNotice();
        }
      } catch {
        fallbackLocalNotice();
      } finally {
        setLoading(false);
      }
    };

    const fallbackLocalNotice = () => {
      const facts = extractBoardFacts(chess);
      const undefended = facts.sideToMove === 'w' ? facts.undefendedPieces.white : facts.undefendedPieces.black;
      setData({
        beginner: `Material count: White ${facts.material.white} vs Black ${facts.material.black}. King under check: ${facts.isCheck ? 'YES' : 'NO'}.`,
        intermediate: undefended.length > 0 
          ? `Piece alert: friendly piece on ${undefended.join(', ')} is not currently defended.` 
          : `Solid piece defenses. Look for tactical levers against opponent center.`,
        master: `Analyze pawn structure and files (${facts.openFiles.length ? facts.openFiles.join(', ') : 'closed'}). Seek long-term outposts for minor pieces and prioritize piece harmony.`,
        keyTakeaway: 'Strong players look beyond immediate captures to identify structural weaknesses.',
      });
    };

    fetchNotice();
  }, [chess]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface-elevated border border-border-strong max-w-lg w-full p-6 rounded-2xl shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-border-subtle pb-3">
          <div className="flex items-center gap-2 text-accent-sky">
            <Sparkles className="w-5 h-5 text-accent-sky" />
            <h2 className="text-base font-bold text-slate-100">
              What Would a Master Notice?
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-surface-subtle"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-slate-400">
            Analyzing position across master cognitive tiers...
          </div>
        ) : data ? (
          <div className="space-y-3.5">
            {/* Level 1: Beginner */}
            <div className="p-3.5 bg-surface-subtle border border-border-subtle rounded-xl space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <GraduationCap className="w-4 h-4" />
                <span>Level 1: Beginner Perspective</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-6">
                {data.beginner}
              </p>
            </div>

            {/* Level 2: Intermediate */}
            <div className="p-3.5 bg-surface-subtle border border-border-subtle rounded-xl space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-accent-amber">
                <Award className="w-4 h-4" />
                <span>Level 2: Intermediate Player Notice</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-6">
                {data.intermediate}
              </p>
            </div>

            {/* Level 3: Master */}
            <div className="p-3.5 bg-surface-subtle border border-accent-sky/40 rounded-xl space-y-1 bg-accent-sky/5">
              <div className="flex items-center gap-2 text-xs font-semibold text-accent-sky">
                <Crown className="w-4 h-4" />
                <span>Level 3: Master Cognitive Lens</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed pl-6 font-medium">
                {data.master}
              </p>
            </div>

            {/* Practical Takeaway */}
            <div className="p-3 bg-surface-card border border-border-strong rounded-xl text-xs space-y-1">
              <span className="font-semibold text-slate-300">Takeaway Habit:</span>
              <p className="text-slate-400">{data.keyTakeaway}</p>
            </div>
          </div>
        ) : null}

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-accent-sky hover:bg-sky-600 text-slate-950 font-semibold text-xs rounded-lg transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};


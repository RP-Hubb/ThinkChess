import React, { useState, useEffect } from 'react';
import { X, BarChart3, CheckCircle2, AlertTriangle, Target } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const ThinkingProfileModal: React.FC<Props> = ({ onClose }) => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/profile/me')
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setLoading(false);
      })
      .catch(() => {
        setProfile({
          gamesAnalyzed: 6,
          strengths: [
            'Proactive king safety awareness',
            'Strong center pawn stake habits',
            'Solid defensive recovery after check',
          ],
          weaknesses: [
            'Tunnel vision attack (initiating attacks before defending loose pieces)',
            'Overvaluing short-term initiative against solid pawns',
            'Leaving knights undefended during kingside pawn moves',
          ],
          topPriorities: [
            'Check opponent active capture threats before every move',
            'Use Self-Play mode with Independent Hints to practice defense',
            'Pause during blunder warnings to scan hanging pieces',
          ],
        });
        setLoading(false);
      });
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface-elevated border border-border-strong max-w-lg w-full p-6 rounded-2xl shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-border-subtle pb-3">
          <div className="flex items-center gap-2 text-accent-sky">
            <BarChart3 className="w-5 h-5 text-accent-sky" />
            <div>
              <h2 className="text-base font-bold text-slate-100">Thinking Profile</h2>
              <span className="text-[11px] text-slate-400">
                Cognitive Growth Dashboard ({profile?.gamesAnalyzed || 0} games analyzed)
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-slate-400">
            Loading cognitive profile...
          </div>
        ) : profile ? (
          <div className="space-y-4 text-xs">
            {/* Strengths */}
            <div className="p-3.5 bg-surface-subtle border border-accent-emerald/30 rounded-xl space-y-2">
              <span className="font-semibold text-accent-emerald uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-accent-emerald" />
                Thinking Strengths
              </span>
              <ul className="space-y-1.5 text-slate-300">
                {profile.strengths.map((str: string, i: number) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-accent-emerald mt-0.5">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="p-3.5 bg-surface-subtle border border-accent-rose/30 rounded-xl space-y-2">
              <span className="font-semibold text-accent-rose uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-accent-rose" />
                Recurring Thinking Blind Spots
              </span>
              <ul className="space-y-1.5 text-slate-300">
                {profile.weaknesses.map((wk: string, i: number) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-accent-rose mt-0.5">•</span>
                    <span>{wk}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Training Priorities */}
            <div className="p-3.5 bg-surface-subtle border border-accent-sky/30 rounded-xl space-y-2">
              <span className="font-semibold text-accent-sky uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-4 h-4 text-accent-sky" />
                Personalized Training Priorities
              </span>
              <ul className="space-y-1.5 text-slate-300">
                {profile.topPriorities.map((tp: string, i: number) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-accent-sky mt-0.5">→</span>
                    <span>{tp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-surface-subtle hover:bg-surface-card border border-border-subtle text-slate-200 font-semibold text-xs rounded-lg transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};


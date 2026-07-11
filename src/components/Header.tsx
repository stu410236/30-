import React from 'react';
import { RotateCcw, Undo2, Trophy, Flame } from 'lucide-react';

interface HeaderProps {
  score: number;
  bestScore: number;
  onRestart: () => void;
  onUndo: () => void;
  canUndo: boolean;
  movesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  score,
  bestScore,
  onRestart,
  onUndo,
  canUndo,
  movesCount,
}) => {
  return (
    <header id="game-header" className="w-full max-w-[480px] mx-auto space-y-4">
      {/* Title & Scoreboards */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1
            id="game-logo-title"
            className="text-5xl md:text-6xl font-display font-extrabold text-slate-700 tracking-tighter"
          >
            2048
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium tracking-tight mt-1">
            合併相同數字，挑戰拼出 <span className="font-bold text-slate-700">2048</span>！
          </p>
        </div>

        {/* Scoreboards */}
        <div className="flex gap-2 font-display">
          {/* Current Score */}
          <div
            id="score-card"
            className="flex flex-col items-center justify-center min-w-[76px] md:min-w-[90px] px-3 py-2 bg-slate-200/80 rounded-lg text-center shadow-xs border border-slate-300/50"
          >
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-500">
              SCORE
            </span>
            <span className="text-lg md:text-xl font-bold text-slate-700 leading-tight">
              {score}
            </span>
          </div>

          {/* Best Score */}
          <div
            id="best-card"
            className="flex flex-col items-center justify-center min-w-[76px] md:min-w-[90px] px-3 py-2 bg-slate-200/80 rounded-lg text-center shadow-xs border border-slate-300/50"
          >
            <div className="flex items-center gap-1 justify-center">
              <Trophy className="h-3 w-3 text-slate-500" />
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-500">
                BEST
              </span>
            </div>
            <span className="text-lg md:text-xl font-bold text-slate-700 leading-tight">
              {bestScore}
            </span>
          </div>
        </div>
      </div>

      {/* Buttons and controls bar */}
      <div className="flex items-center justify-between gap-4 py-2.5 border-t border-b border-slate-200">
        <div className="flex items-center gap-2">
          {/* Moves Count Badge */}
          <div
            id="moves-badge"
            className="flex items-center gap-1 px-3 py-1 bg-slate-200/50 border border-slate-300/30 rounded-full text-xs font-semibold text-slate-600"
          >
            <Flame className="h-3.5 w-3.5 text-orange-500 animate-pulse" />
            <span>步數: {movesCount}</span>
          </div>
        </div>

        <div className="flex gap-2">
          {/* Undo Button */}
          <button
            id="undo-action-btn"
            onClick={onUndo}
            disabled={!canUndo}
            title="復原上一步"
            className={`flex items-center gap-1 px-4 py-2 rounded-lg text-xs md:text-sm font-bold shadow-xs transition-all cursor-pointer ${
              canUndo
                ? 'bg-slate-200 hover:bg-slate-300 text-slate-700 border border-slate-300/50 active:scale-95'
                : 'bg-slate-100/50 text-slate-300 border border-slate-200 cursor-not-allowed'
            }`}
          >
            <Undo2 className="h-4 w-4" />
            <span>復原</span>
          </button>

          {/* Restart Button */}
          <button
            id="restart-action-btn"
            onClick={onRestart}
            title="重新開始"
            className="flex items-center gap-1 px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-lg text-xs md:text-sm font-bold shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            <span>重開</span>
          </button>
        </div>
      </div>
    </header>
  );
};

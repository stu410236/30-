import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Grid } from './components/Grid';
import { GameOverlay } from './components/GameOverlay';
import { Tile, HistoryState } from './types';
import { initGame, move, checkGameOver, addRandomTile } from './utils/game';
import { Keyboard, ShieldQuestion, Award } from 'lucide-react';

export default function App() {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [score, setScore] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [won, setWon] = useState<boolean>(false);
  const [keepPlaying, setKeepPlaying] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [movesCount, setMovesCount] = useState<number>(0);

  // Touch swiping tracking state
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);

  // 1. Initialize Best Score and Load game from localStorage if available
  useEffect(() => {
    const savedBest = localStorage.getItem('2048-best-score');
    if (savedBest) {
      setBestScore(parseInt(savedBest, 10));
    }

    const savedState = localStorage.getItem('2048-saved-game');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setTiles(parsed.tiles || []);
        setScore(parsed.score || 0);
        setGameOver(parsed.gameOver || false);
        setWon(parsed.won || false);
        setKeepPlaying(parsed.keepPlaying || false);
        setHistory(parsed.history || []);
        setMovesCount(parsed.movesCount || 0);
        return; // Skip standard initialization
      } catch (e) {
        console.error('Error parsing saved game state', e);
      }
    }

    // Default initialization if no saved state
    resetGame();
  }, []);

  // 2. Save state to localStorage whenever it changes
  useEffect(() => {
    if (tiles.length === 0) return;
    
    const gameState = {
      tiles,
      score,
      gameOver,
      won,
      keepPlaying,
      history,
      movesCount,
    };
    localStorage.setItem('2048-saved-game', JSON.stringify(gameState));

    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('2048-best-score', score.toString());
    }
  }, [tiles, score, gameOver, won, keepPlaying, history, movesCount, bestScore]);

  // Restart/Reset Game
  const resetGame = () => {
    const freshTiles = initGame();
    setTiles(freshTiles);
    setScore(0);
    setGameOver(false);
    setWon(false);
    setKeepPlaying(false);
    setHistory([]);
    setMovesCount(0);
  };

  // Keep Playing after 2048
  const handleKeepPlaying = () => {
    setKeepPlaying(true);
  };

  // Undo Last Move
  const handleUndo = () => {
    if (history.length === 0) return;

    const previousState = history[history.length - 1];
    setTiles(previousState.tiles);
    setScore(previousState.score);
    setHistory(prev => prev.slice(0, -1));
    setMovesCount(prev => Math.max(0, prev - 1));
    setGameOver(false);
  };

  // Core movement execution handler
  const handleMove = useCallback(
    (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
      if (gameOver) return;
      if (won && !keepPlaying) return;

      const result = move(tiles, direction);

      if (result.hasMoved) {
        // Record history state BEFORE applying new state
        const currentHistoryItem: HistoryState = {
          tiles: tiles.map(t => ({ ...t })),
          score,
        };

        // We only keep the last 15 history steps to save memory
        setHistory(prev => [...prev.slice(-14), currentHistoryItem]);

        // Process score and moves
        const nextScore = score + result.scoreIncrement;
        setScore(nextScore);
        setMovesCount(prev => prev + 1);

        // Slide the tiles, then spawn a new tile with a tiny delay so sliding animation can finish nicely
        const movedTiles = result.tiles;
        setTiles(movedTiles);

        // Wait for the slide transition (100ms matches .tile-transition / spring physics)
        setTimeout(() => {
          setTiles(prevTiles => {
            const finalTiles = addRandomTile(prevTiles);

            // Check if player reached 2048
            const has2048 = finalTiles.some(t => t.value === 2048);
            if (has2048 && !won && !keepPlaying) {
              setWon(true);
            }

            // Check for Game Over
            if (checkGameOver(finalTiles)) {
              setGameOver(true);
            }

            return finalTiles;
          });
        }, 120);
      }
    },
    [tiles, score, gameOver, won, keepPlaying]
  );

  // 3. Setup Keyboard Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent screen scrolling on arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key.toUpperCase()) {
        case 'ARROWUP':
        case 'W':
          handleMove('UP');
          break;
        case 'ARROWDOWN':
        case 'S':
          handleMove('DOWN');
          break;
        case 'ARROWLEFT':
        case 'A':
          handleMove('LEFT');
          break;
        case 'ARROWRIGHT':
        case 'D':
          handleMove('RIGHT');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleMove]);

  // 4. Touch swipe gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    
    // Minimum distance for swipe action
    const threshold = 45;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0) {
          handleMove('RIGHT');
        } else {
          handleMove('LEFT');
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > threshold) {
        if (deltaY > 0) {
          handleMove('DOWN');
        } else {
          handleMove('UP');
        }
      }
    }
    setTouchStart(null);
  };

  return (
    <div
      id="app-container"
      className="min-h-screen w-full flex flex-col justify-between py-6 px-4 bg-slate-50 transition-colors duration-300"
    >
      {/* Upper spacing / content */}
      <div id="game-central-container" className="my-auto space-y-6">
        
        {/* Game Header */}
        <Header
          score={score}
          bestScore={bestScore}
          onRestart={resetGame}
          onUndo={handleUndo}
          canUndo={history.length > 0}
          movesCount={movesCount}
        />

        {/* Playable Stage Area */}
        <div
          id="game-board-container"
          className="relative max-w-[480px] mx-auto overflow-hidden touch-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Game grid itself */}
          <Grid tiles={tiles} />

          {/* Game Over / Winning Screen Overlay */}
          <GameOverlay
            gameOver={gameOver}
            won={won}
            score={score}
            onRestart={resetGame}
            onKeepPlaying={handleKeepPlaying}
            keepPlaying={keepPlaying}
          />
        </div>

        {/* Responsive Tutorial / Instructions Panel */}
        <div
          id="instructions-panel"
          className="max-w-[480px] mx-auto bg-white border border-slate-200 rounded-xl p-4 md:p-5 shadow-xs space-y-4"
        >
          <div className="flex items-center gap-2 text-slate-700 border-b border-slate-100 pb-2">
            <ShieldQuestion className="h-4 py-0.5 w-4 text-slate-500" />
            <h3 className="font-display font-bold text-sm tracking-wide">如何開始遊玩？</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-600 font-sans">
            <div className="space-y-3" id="keyboard-guide">
              <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                <Keyboard className="h-3.5 w-3.5 text-slate-500" />
                <span>電腦鍵盤 / 滑動操作</span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-slate-500 uppercase tracking-wider font-medium">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 bg-white rounded border border-slate-200 flex items-center justify-center text-slate-400 font-bold shadow-xs">↑</div>
                  <span>上 (W)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 bg-white rounded border border-slate-200 flex items-center justify-center text-slate-400 font-bold shadow-xs">↓</div>
                  <span>下 (S)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 bg-white rounded border border-slate-200 flex items-center justify-center text-slate-400 font-bold shadow-xs">←</div>
                  <span>左 (A)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 bg-white rounded border border-slate-200 flex items-center justify-center text-slate-400 font-bold shadow-xs">→</div>
                  <span>右 (D)</span>
                </div>
              </div>
            </div>

            <div className="space-y-2" id="mobile-guide">
              <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                <Award className="h-3.5 w-3.5 text-slate-500" />
                <span>手機或平板</span>
              </div>
              <p className="leading-relaxed text-slate-500">
                在遊戲板區域中，直接以手指進行上、下、左、右的「滑動手勢」即可流暢控制方塊。
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Footer Branding */}
      <footer id="app-footer" className="text-center text-[11px] text-slate-400 mt-8">
        <p className="font-mono">2048 Game • Sleek Interface Edition</p>
      </footer>
    </div>
  );
}

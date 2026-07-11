import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Award } from 'lucide-react';

interface GameOverlayProps {
  gameOver: boolean;
  won: boolean;
  score: number;
  onRestart: () => void;
  onKeepPlaying: () => void;
  keepPlaying: boolean;
}

export const GameOverlay: React.FC<GameOverlayProps> = ({
  gameOver,
  won,
  score,
  onRestart,
  onKeepPlaying,
  keepPlaying,
}) => {
  // Show win overlay only if we won and haven't chosen to keep playing
  const showWin = won && !keepPlaying;
  const showOverlay = gameOver || showWin;

  return (
    <AnimatePresence>
      {showOverlay && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-[#faf8f5]/90 backdrop-blur-md rounded-xl md:rounded-2xl text-center"
          id="game-overlay-container"
        >
          {showWin ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring' }}
              className="space-y-6 max-w-sm"
              id="win-content"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                <Award className="h-10 w-10 animate-bounce" />
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-display font-extrabold text-gray-900 tracking-tight">
                  恭喜獲勝！ 🎉
                </h2>
                <p className="text-gray-600 font-sans">
                  你成功的拼出了第一個 <span className="font-bold text-yellow-600">2048</span> 方塊！
                </p>
                <div className="inline-block px-4 py-2 bg-yellow-50 text-yellow-800 rounded-full font-mono text-sm font-semibold">
                  目前得分: {score} 分
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row justify-center">
                <button
                  id="keep-playing-btn"
                  onClick={onKeepPlaying}
                  className="px-6 py-3 bg-[#8f7a66] hover:bg-[#7f6a56] text-white rounded-xl font-display font-bold shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  繼續挑戰
                </button>
                <button
                  id="win-restart-btn"
                  onClick={onRestart}
                  className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-display font-bold shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="h-5 w-5" />
                  重新開始
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring' }}
              className="space-y-6 max-w-sm"
              id="game-over-content"
            >
              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-display font-extrabold text-gray-800 tracking-tight">
                  遊戲結束
                </h2>
                <p className="text-gray-600 font-sans">
                  沒有可以移動的方塊了。繼續加油，下次一定能拼出 2048！
                </p>
                <div className="inline-block px-4 py-2 bg-gray-100 text-gray-800 rounded-full font-mono text-sm font-semibold">
                  最終得分: {score} 分
                </div>
              </div>

              <div>
                <button
                  id="game-over-restart-btn"
                  onClick={onRestart}
                  className="w-full px-6 py-3 bg-[#8f7a66] hover:bg-[#7f6a56] text-white rounded-xl font-display font-bold shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="h-5 w-5" />
                  再試一次
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

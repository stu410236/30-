import React from 'react';
import { motion } from 'motion/react';
import { Tile } from '../types';

interface TileViewProps {
  tile: Tile;
}

export const TileView: React.FC<TileViewProps> = ({ tile }) => {
  const { value, row, col, isNew, isMerged } = tile;

  // Modern, highly polished tile colors matching classic 2048 styling but with a refined palette
  const getTileStyles = (val: number) => {
    switch (val) {
      case 2:
        return {
          bg: 'bg-[#eee4da]',
          text: 'text-[#776e65]',
          shadow: 'shadow-xs',
          fontSize: 'text-2xl md:text-3xl lg:text-4xl',
        };
      case 4:
        return {
          bg: 'bg-[#ede0c8]',
          text: 'text-[#776e65]',
          shadow: 'shadow-xs',
          fontSize: 'text-2xl md:text-3xl lg:text-4xl',
        };
      case 8:
        return {
          bg: 'bg-[#f2b179]',
          text: 'text-[#f9f6f2]',
          shadow: 'shadow-md shadow-orange-500/10',
          fontSize: 'text-2xl md:text-3xl lg:text-4xl',
        };
      case 16:
        return {
          bg: 'bg-[#f59563]',
          text: 'text-[#f9f6f2]',
          shadow: 'shadow-md shadow-orange-600/15',
          fontSize: 'text-2xl md:text-3xl lg:text-4xl',
        };
      case 32:
        return {
          bg: 'bg-[#f67c5f]',
          text: 'text-[#f9f6f2]',
          shadow: 'shadow-md shadow-red-500/15',
          fontSize: 'text-2xl md:text-3xl lg:text-4xl',
        };
      case 64:
        return {
          bg: 'bg-[#f65e3b]',
          text: 'text-[#f9f6f2]',
          shadow: 'shadow-lg shadow-red-600/20',
          fontSize: 'text-2xl md:text-3xl lg:text-4xl',
        };
      case 128:
        return {
          bg: 'bg-[#edcf72]',
          text: 'text-[#f9f6f2]',
          shadow: 'shadow-lg shadow-yellow-500/30 ring-2 ring-yellow-400/20',
          fontSize: 'text-xl md:text-2xl lg:text-3xl',
        };
      case 256:
        return {
          bg: 'bg-[#edcc61]',
          text: 'text-[#f9f6f2]',
          shadow: 'shadow-lg shadow-yellow-500/40 ring-2 ring-yellow-400/40',
          fontSize: 'text-xl md:text-2xl lg:text-3xl',
        };
      case 512:
        return {
          bg: 'bg-[#edc850]',
          text: 'text-[#f9f6f2]',
          shadow: 'shadow-xl shadow-yellow-400/50 ring-2 ring-yellow-300/60',
          fontSize: 'text-xl md:text-2xl lg:text-3xl',
        };
      case 1024:
        return {
          bg: 'bg-[#edc53f]',
          text: 'text-[#f9f6f2]',
          shadow: 'shadow-xl shadow-yellow-400/60 ring-2 ring-yellow-300/80',
          fontSize: 'text-lg md:text-xl lg:text-2xl',
        };
      case 2048:
        return {
          bg: 'bg-[#edc22e]',
          text: 'text-[#f9f6f2]',
          shadow: 'shadow-2xl shadow-yellow-300/70 ring-4 ring-yellow-200/90',
          fontSize: 'text-lg md:text-xl lg:text-2xl',
        };
      default:
        // For 4096 and higher
        return {
          bg: 'bg-[#3c3a33]',
          text: 'text-[#f9f6f2]',
          shadow: 'shadow-2xl shadow-black/30 ring-2 ring-[#776e65]',
          fontSize: 'text-base md:text-lg lg:text-xl',
        };
    }
  };

  const style = getTileStyles(value);

  // Position style in percentages (fluid and responsive)
  const positionStyle: React.CSSProperties = {
    top: `${row * 25}%`,
    left: `${col * 25}%`,
    width: '25%',
    height: '25%',
    position: 'absolute',
  };

  // Set up animations:
  // - Motion layout facilitates smooth sliding transitions between rows and columns
  // - New tiles fade and scale up
  // - Merged tiles trigger a brief popping effect
  const initial = isNew ? { scale: 0, opacity: 0 } : false;
  const animate = isMerged
    ? { scale: [1, 1.15, 1], opacity: 1 }
    : isNew
    ? { scale: 1, opacity: 1 }
    : { scale: 1, opacity: 1 };

  return (
    <motion.div
      layout
      layoutId={tile.id}
      style={positionStyle}
      initial={initial}
      animate={animate}
      transition={{
        layout: { type: 'spring', stiffness: 350, damping: 28 },
        scale: { type: 'spring', stiffness: 400, damping: 20 },
        opacity: { duration: 0.15 },
      }}
      className="p-2 select-none"
      id={`tile-container-${tile.id}`}
    >
      <div
        id={`tile-content-${tile.id}`}
        className={`w-full h-full rounded-lg md:rounded-xl flex items-center justify-center font-display font-bold ${style.bg} ${style.text} ${style.shadow} transition-all duration-100`}
      >
        <span className={`${style.fontSize} tracking-tight`}>{value}</span>
      </div>
    </motion.div>
  );
};

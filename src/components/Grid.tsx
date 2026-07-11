import React from 'react';
import { Tile } from '../types';
import { TileView } from './TileView';

interface GridProps {
  tiles: Tile[];
}

export const Grid: React.FC<GridProps> = ({ tiles }) => {
  // We'll render a static 4x4 background grid
  const backgroundCells = Array.from({ length: 16 }).map((_, index) => (
    <div
      key={`bg-cell-${index}`}
      id={`bg-cell-${index}`}
      className="bg-slate-200/50 rounded-lg aspect-square"
    />
  ));

  return (
    <div
      id="game-grid-wrapper"
      className="relative w-full aspect-square max-w-[480px] mx-auto bg-slate-300 p-4 rounded-xl shadow-inner overflow-hidden"
    >
      {/* Background cells (4x4 static grid) */}
      <div id="grid-bg-cells" className="grid grid-cols-4 gap-4 w-full h-full">
        {backgroundCells}
      </div>

      {/* Dynamic tiles layer (positioned absolutely on top) */}
      <div
        id="grid-tiles-overlay"
        className="absolute inset-4 pointer-events-none"
      >
        {tiles.map(tile => (
          <TileView key={tile.id} tile={tile} />
        ))}
      </div>
    </div>
  );
};

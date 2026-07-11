import { Tile } from '../types';

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function getEmptyCells(tiles: Tile[]): { row: number; col: number }[] {
  const occupied = new Set(tiles.map(t => `${t.row},${t.col}`));
  const empty: { row: number; col: number }[] = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (!occupied.has(`${row},${col}`)) {
        empty.push({ row, col });
      }
    }
  }
  return empty;
}

export function addRandomTile(tiles: Tile[]): Tile[] {
  const empty = getEmptyCells(tiles);
  if (empty.length === 0) return tiles;
  const { row, col } = empty[Math.floor(Math.random() * empty.length)];
  const value = Math.random() < 0.9 ? 2 : 4;
  const newTile: Tile = {
    id: `tile-${generateId()}`,
    value,
    row,
    col,
    isNew: true,
  };
  return [...tiles, newTile];
}

export function initGame(): Tile[] {
  let tiles: Tile[] = [];
  tiles = addRandomTile(tiles);
  tiles = addRandomTile(tiles);
  return tiles;
}

export function checkGameOver(tiles: Tile[]): boolean {
  if (getEmptyCells(tiles).length > 0) return false;

  // Check horizontal neighbors
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 3; c++) {
      const current = tiles.find(t => t.row === r && t.col === c);
      const next = tiles.find(t => t.row === r && t.col === c + 1);
      if (current && next && current.value === next.value) {
        return false;
      }
    }
  }

  // Check vertical neighbors
  for (let c = 0; c < 4; c++) {
    for (let r = 0; r < 3; r++) {
      const current = tiles.find(t => t.row === r && t.col === c);
      const next = tiles.find(t => t.row === r + 1 && t.col === c);
      if (current && next && current.value === next.value) {
        return false;
      }
    }
  }

  return true;
}

export function move(
  tiles: Tile[],
  direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
): { tiles: Tile[]; scoreIncrement: number; hasMoved: boolean } {
  // Clear temporary flags and clean tiles
  const cleanTiles = tiles.map(t => ({ ...t, isNew: false, isMerged: false }));

  let scoreIncrement = 0;
  let hasMoved = false;
  const nextTiles: Tile[] = [];

  const getTileAt = (r: number, c: number) =>
    cleanTiles.find(t => t.row === r && t.col === c);

  // Define lines of coordinates based on direction
  const lines: { row: number; col: number }[][] = [];

  if (direction === 'LEFT') {
    for (let r = 0; r < 4; r++) {
      lines.push([
        { row: r, col: 0 },
        { row: r, col: 1 },
        { row: r, col: 2 },
        { row: r, col: 3 },
      ]);
    }
  } else if (direction === 'RIGHT') {
    for (let r = 0; r < 4; r++) {
      lines.push([
        { row: r, col: 3 },
        { row: r, col: 2 },
        { row: r, col: 1 },
        { row: r, col: 0 },
      ]);
    }
  } else if (direction === 'UP') {
    for (let c = 0; c < 4; c++) {
      lines.push([
        { row: 0, col: c },
        { row: 1, col: c },
        { row: 2, col: c },
        { row: 3, col: c },
      ]);
    }
  } else if (direction === 'DOWN') {
    for (let c = 0; c < 4; c++) {
      lines.push([
        { row: 3, col: c },
        { row: 2, col: c },
        { row: 1, col: c },
        { row: 0, col: c },
      ]);
    }
  }

  // Process each line
  for (const line of lines) {
    const lineTiles: Tile[] = [];
    for (const cell of line) {
      const tile = getTileAt(cell.row, cell.col);
      if (tile) {
        lineTiles.push(tile);
      }
    }

    const newLineTiles: Tile[] = [];
    let i = 0;
    while (i < lineTiles.length) {
      const current = lineTiles[i];
      const next = lineTiles[i + 1];

      if (next && current.value === next.value) {
        const targetCell = line[newLineTiles.length];
        const mergedValue = current.value * 2;
        scoreIncrement += mergedValue;

        const mergedTile: Tile = {
          id: current.id, // keep ID of current for layout slide animation
          value: mergedValue,
          row: targetCell.row,
          col: targetCell.col,
          isMerged: true,
        };

        newLineTiles.push(mergedTile);
        hasMoved = true;
        i += 2; // Skip next tile since it merged
      } else {
        const targetCell = line[newLineTiles.length];
        const updatedCurrent: Tile = {
          ...current,
          row: targetCell.row,
          col: targetCell.col,
        };

        newLineTiles.push(updatedCurrent);

        if (current.row !== targetCell.row || current.col !== targetCell.col) {
          hasMoved = true;
        }

        i += 1;
      }
    }

    nextTiles.push(...newLineTiles);
  }

  return {
    tiles: nextTiles,
    scoreIncrement,
    hasMoved,
  };
}

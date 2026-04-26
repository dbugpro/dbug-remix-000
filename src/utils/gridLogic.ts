import { GRID_CONFIG } from '../config';

export interface Position {
  row: number;
  col: number;
}

/**
 * Returns true if a tile is part of the navigable path (39 tiles total)
 * Rows 1, 2, and 3 are full corridors (33)
 * Rows 0 and 4 have connectors at 0, 5, and 10 (6)
 */
export const isPathTile = (row: number, col: number): boolean => {
  if (row === 1 || row === 2 || row === 3) return true;
  if (row === 0 || row === 4) {
    return col === 0 || col === 5 || col === 10;
  }
  return false;
};

/**
 * Validates if a move is adjacent and stay on path
 */
export const isValidMove = (prev: Position, next: Position): boolean => {
  if (!isPathTile(next.row, next.col)) return false;
  const rowDiff = Math.abs(prev.row - next.row);
  const colDiff = Math.abs(prev.col - next.col);
  return (rowDiff + colDiff) === 1;
};

/**
 * Maps a grid tile to a code digit if it's a threshold
 */
export const getDoorDigitForTile = (row: number, col: number): string | null => {
  // Left Wall Doors (Even): Row 1 + Even Column
  if (row === 1 && col % 2 === 0 && col < 10) {
    return GRID_CONFIG.DOOR_MAP[col] || null;
  }
  
  // Right Wall Doors (Odd): Row 3 + Odd Column
  if (row === 3 && col % 2 !== 0 && col < 10) {
    return GRID_CONFIG.DOOR_MAP[col] || null;
  }

  return null;
};

/**
 * Returns true if the column represents the Far Door
 */
export const isFarDoor = (col: number): boolean => {
  return col === 10;
};

/**
 * Parses a string position like "r2_c5" into a Position object
 */
export const parsePosition = (posStr: string): Position => {
  const match = posStr.match(/r(\d+)_c(\d+)/);
  if (match) {
    return { row: parseInt(match[1]), col: parseInt(match[2]) };
  }
  return GRID_CONFIG.START_POS;
};

/**
 * Translates grid coordinates to 3D Z-depth
 * We add an offset so the camera isn't exactly touching the floor tile
 */
export const calculateDepth = (col: number): number => {
  // Each column is 400px deep. 
  // We want the current column to be at a viewing distance.
  return (col * GRID_CONFIG.CORRIDOR_DEPTH_PER_COL) - 300;
};

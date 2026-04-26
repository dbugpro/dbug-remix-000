import { GRID_CONFIG } from '../config';

export interface Position {
  row: number;
  col: number;
}

/**
 * Validates if a move is adjacent (Manhattan distance = 1)
 */
export const isValidMove = (prev: Position, next: Position): boolean => {
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
 * Translates grid coordinates to 3D Z-depth
 */
export const calculateDepth = (col: number): number => {
  return -col * GRID_CONFIG.CORRIDOR_DEPTH_PER_COL;
};

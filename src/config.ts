export const GRID_CONFIG = {
  ROWS: 5,
  COLS: 11,
  CODE_LENGTH: 3,
  START_POS: { row: 2, col: 3 }, // Adjusted starting position
  
  // Door mappings (Column Index => Digit)
  DOOR_MAP: {
    0: '0', 2: '2', 4: '4', 6: '6', 8: '8', // Left Wall (Even)
    1: '1', 3: '3', 5: '5', 7: '7', 9: '9', // Right Wall (Odd)
  } as Record<number, string>,
  
  CORRIDOR_DEPTH_PER_COL: 400,
  WALL_HEIGHT: 500
};

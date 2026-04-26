import { create } from 'zustand';
import { Position, isValidMove, getDoorDigitForTile, isFarDoor, parsePosition } from '../utils/gridLogic';
import { GRID_CONFIG } from '../config';

// Define the shape of the state
interface CorridorState {
  userIdentity: string;
  currentPosition: Position;
  currentCode: string;
  isFarDoorUnlocked: boolean;
  latticeInstance: number;
  debugMode: boolean;
  showMenu: boolean;
  rotation: { x: number; y: number };

  // Actions
  moveTo: (row: number, col: number) => void;
  resetCode: () => void;
  progressToNextInstance: () => void;
  setShowMenu: (show: boolean) => void;
  setRotation: (rot: { x: number; y: number }) => void;
  loadFromURL: () => void;
}

// Helper to sync state with URL
const updateURL = (pos: Position, code: string, lattice: number, debug: boolean) => {
  try {
    const url = new URL(window.location.href);
    url.searchParams.set('pos', `r${pos.row}_c${pos.col}`);
    url.searchParams.set('code', code);
    url.searchParams.set('lattice', lattice.toString());
    if (debug) url.searchParams.set('debug', 'true');
    window.history.pushState({}, '', url.toString());
  } catch (e) {
    console.error('URL sync failed', e);
  }
};

const parseURLParams = () => {
  const params = new URLSearchParams(window.location.search);
  const posMatch = (params.get('pos') || '').match(/r(\d+)_c(\d+)/);
  
  return {
    pos: posMatch ? { row: parseInt(posMatch[1]), col: parseInt(posMatch[2]) } : GRID_CONFIG.START_POS,
    code: params.get('code') || '',
    lattice: parseInt(params.get('lattice') || '0', 10),
    debug: params.has('debug'),
  };
};

export const useCorridorStore = create<CorridorState>((set) => ({
  userIdentity: 'dbugx',
  currentPosition: GRID_CONFIG.START_POS,
  currentCode: '',
  isFarDoorUnlocked: false,
  latticeInstance: 0,
  debugMode: false,
  showMenu: false,
  rotation: { x: 0, y: 0 },

  moveTo: (row, col) => {
    set((state) => {
      const targetPos = { row, col };
      
      // Enforce proximity
      if (!isValidMove(state.currentPosition, targetPos)) return state;

      let nextCode = state.currentCode;
      const doorDigit = getDoorDigitForTile(row, col);

      // Accumulate code if threshold reached
      if (doorDigit && nextCode.length < GRID_CONFIG.CODE_LENGTH) {
        nextCode += doorDigit;
      }

      const unlocked = nextCode.length === GRID_CONFIG.CODE_LENGTH;
      updateURL(targetPos, nextCode, state.latticeInstance, state.debugMode);

      return {
        currentPosition: targetPos,
        currentCode: nextCode,
        isFarDoorUnlocked: unlocked
      };
    });
  },

  resetCode: () => {
    set((state) => {
      const startPos = typeof GRID_CONFIG.START_POS === 'string' 
        ? parsePosition(GRID_CONFIG.START_POS) 
        : GRID_CONFIG.START_POS;
        
      updateURL(startPos, '', state.latticeInstance, state.debugMode);
      return {
        currentPosition: startPos,
        currentCode: '',
        isFarDoorUnlocked: false,
        showMenu: false,
        rotation: { x: 0, y: 0 }
      };
    });
  },

  progressToNextInstance: () => {
    set((state) => {
      if (!state.isFarDoorUnlocked || !isFarDoor(state.currentPosition.col)) return state;

      const nextLattice = state.latticeInstance + 1;
      updateURL(GRID_CONFIG.START_POS, '', nextLattice, state.debugMode);

      return {
        currentPosition: GRID_CONFIG.START_POS,
        currentCode: '',
        isFarDoorUnlocked: false,
        latticeInstance: nextLattice,
      };
    });
  },

  setShowMenu: (show: boolean) => {
    set({ showMenu: show });
  },

  setRotation: (rot) => {
    set({ rotation: rot });
  },

  loadFromURL: () => {
    const { pos, code, lattice, debug } = parseURLParams();
    set({
      currentPosition: pos,
      currentCode: code,
      isFarDoorUnlocked: code.length === GRID_CONFIG.CODE_LENGTH,
      latticeInstance: lattice,
      debugMode: debug,
    });
  },
}));

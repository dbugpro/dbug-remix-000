import { create } from 'zustand';

interface CorridorState {
  instanceCount: number;
  currentCell: string;
  isFarDoorUnlocked: boolean;
  incrementInstance: () => void;
  resetCorridor: () => void;
}

export const useCorridorStore = create<CorridorState>((set) => ({
  instanceCount: 0,
  currentCell: '000',
  isFarDoorUnlocked: false,

  incrementInstance: () => set((state) => {
    const nextCount = state.instanceCount + 1;
    return {
      instanceCount: nextCount,
      currentCell: String(nextCount).padStart(3, '0'),
      isFarDoorUnlocked: nextCount >= 3,
    };
  }),

  resetCorridor: () => set({
    instanceCount: 0,
    currentCell: '000',
    isFarDoorUnlocked: false,
  }),
}));

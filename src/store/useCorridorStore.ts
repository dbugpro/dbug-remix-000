import { create } from 'zustand';

type DoorState = 'corridor' | 'focused' | 'opened';

interface CorridorState {
  instanceCount: number;
  currentCell: string;
  isFarDoorUnlocked: boolean;
  focusedDoor: number | null;
  doorState: DoorState;
  incrementInstance: () => void;
  resetCorridor: () => void;
  setFocus: (door: number | null) => void;
  setDoorState: (state: DoorState) => void;
}

export const useCorridorStore = create<CorridorState>((set) => ({
  instanceCount: 0,
  currentCell: '000',
  isFarDoorUnlocked: false,
  focusedDoor: null,
  doorState: 'corridor',

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
    focusedDoor: null,
    doorState: 'corridor',
  }),

  setFocus: (door) => set({ focusedDoor: door }),
  setDoorState: (doorState) => set({ doorState }),
}));

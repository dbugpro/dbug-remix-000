import { create } from 'zustand';

interface CorridorState {
  x: number;
  z: number;
  instance: number;
  setPosition: (x: number, z: number) => void;
  nextInstance: () => void;
  reset: () => void;
}

export const useCorridorStore = create<CorridorState>((set) => ({
  x: 0,
  z: 0,
  instance: 0,
  setPosition: (x, z) => set({ x, z }),
  nextInstance: () => set((state) => ({ x: 0, z: 0, instance: state.instance + 1 })),
  reset: () => set({ x: 0, z: 0, instance: 0 }),
}));

import React from 'react';
import { RefreshCw, MapPin, Radio } from 'lucide-react';
import { CorridorState } from '../hooks/useCorridorState';

interface HUDProps {
  state: CorridorState;
  onReset: () => void;
}

export const HUD: React.FC<HUDProps> = ({ state, onReset }) => {
  return (
    <div className="hud-container">
      <div className="hud-device">
        {/* Lattice Status */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">
            <MapPin size={10} className="text-zinc-600" />
            Lattice Index
          </div>
          <div className="font-mono text-2xl font-black tracking-tighter text-white">
            {state.x.toString().padStart(2, '0')}.{state.z.toString().padStart(3, '0')}
          </div>
        </div>

        {/* Level Monitor */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-1.5 bg-blue-500/10 border border-blue-500/20 px-3 py-0.5 rounded-full">
            <Radio size={10} className="text-blue-500 animate-pulse" />
            <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Linked</span>
          </div>
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            Level <span className="text-white font-mono">{String(state.instance).padStart(3, '0')}</span>
          </div>
        </div>

        {/* Global Reset */}
        <button 
          onClick={onReset}
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 active:scale-95 transition-all px-4 py-2.5 rounded-2xl border border-white/10 group"
        >
          <RefreshCw size={16} className="text-zinc-300 group-hover:rotate-180 transition-transform duration-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-100">Origin</span>
        </button>
      </div>
    </div>
  );
};

import React from 'react';
import { RefreshCw, MapPin, Radio } from 'lucide-react';
import { useCorridorStore } from '../store/useCorridorStore';

export const HUD: React.FC = () => {
  const { x, z, instance, reset } = useCorridorStore();
  
  return (
    <div className="hud-container">
      <div className="hud-device">
        {/* Lattice Status */}
        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-1 text-[7px] font-bold text-zinc-500 uppercase tracking-[0.2em] leading-none mb-0.5">
            <MapPin size={7} />
            Pos
          </div>
          <div className="font-mono text-xs font-bold text-white/70">
            {x}:{z}
          </div>
        </div>

        {/* Global Reset - Center */}
        <button 
          onClick={reset}
          className="flex items-center justify-center bg-white/5 hover:bg-white/10 active:scale-90 transition-all w-7 h-7 rounded-full border border-white/10"
        >
          <RefreshCw size={12} className="text-white/80" />
        </button>

        {/* Level Monitor */}
        <div className="flex flex-col flex-1 items-end">
          <div className="flex items-center gap-1 mb-0.5">
            <Radio size={7} className="text-blue-500 animate-pulse" />
            <span className="text-[7px] font-black text-blue-400/60 uppercase tracking-[0.2em]">Active</span>
          </div>
          <div className="text-[8px] font-bold text-zinc-600 uppercase">
            Inst <span className="text-white/60 font-mono">{String(instance).padStart(3, '0')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

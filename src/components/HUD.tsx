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
        {/* Left Section: Lattice Index */}
        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-1.5 text-[8px] font-bold text-zinc-500 uppercase tracking-widest leading-none mb-1">
            <MapPin size={8} />
            Pos
          </div>
          <div className="font-mono text-lg font-black tracking-tighter text-white leading-none">
            {state.x}:{state.z}
          </div>
        </div>

        {/* Center Section: Origin Button */}
        <div className="flex flex-1 justify-center">
          <button 
            onClick={onReset}
            className="flex items-center justify-center bg-white/5 hover:bg-white/10 active:scale-90 transition-all w-10 h-10 rounded-full border border-white/10 shadow-lg shadow-black/50"
            title="Return to Origin"
          >
            <RefreshCw size={18} className="text-zinc-100" />
          </button>
        </div>

        {/* Right Section: Level Monitor */}
        <div className="flex flex-col flex-1 items-end">
          <div className="flex items-center gap-1 mb-1">
            <Radio size={8} className="text-blue-500 animate-pulse" />
            <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest">Linked</span>
          </div>
          <div className="text-[9px] font-bold text-zinc-400 leading-none">
            LVL <span className="text-white font-mono">{String(state.instance).padStart(3, '0')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

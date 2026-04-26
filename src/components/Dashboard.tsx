import React from 'react';
import { LayoutGrid, Home, Menu, Monitor } from 'lucide-react';
import { useCorridorStore } from '../store/useCorridorStore';

export const Dashboard: React.FC = () => {
  const { 
    userIdentity, 
    currentPosition, 
    currentCode, 
    latticeInstance, 
    isFarDoorUnlocked,
    resetCode, 
    setShowMenu,
    debugMode 
  } = useCorridorStore();
  
  const slots = [0, 1, 2].map(i => currentCode[i] || null);

  return (
    <div className="dashboard-container">
      <div className="dashboard-inner !bg-slate-950 !border-t-2 !border-blue-500 shadow-2xl">
        
        {/* Left Section: Identity & Lattice */}
        <div className="flex flex-col flex-1 border-r border-white/5 pr-4">
          <div className="flex flex-col mb-2">
            <div className="text-[7px] text-slate-400 uppercase tracking-widest font-mono">Operative</div>
            <div className="text-xs font-bold text-white uppercase">{userIdentity}</div>
          </div>
          <div className="flex flex-col">
            <div className="text-[7px] text-slate-400 uppercase tracking-widest font-mono">Lattice Inst</div>
            <div className="text-sm font-black text-blue-500 font-mono">
              {latticeInstance.toString().padStart(3, '0')}
            </div>
          </div>
        </div>

        {/* Center Section: Access Code Display */}
        <div className="flex-[2] flex flex-col items-center justify-center px-4">
          <div className="text-[7px] text-slate-400 uppercase tracking-[0.3em] font-mono mb-1">Access Code</div>
          <div className="flex items-center gap-2">
            {slots.map((digit, i) => (
              <div 
                key={`slot-${i}`}
                className={`w-9 h-12 rounded border flex items-center justify-center transition-all duration-300 font-mono text-2xl font-black ${
                  digit 
                    ? 'bg-slate-900 border-blue-500 text-blue-500' 
                    : 'bg-slate-800 border-slate-600 text-slate-600'
                }`}
              >
                {digit || '_'}
              </div>
            ))}
          </div>
          <div className={`text-[8px] font-bold mt-1 tracking-widest uppercase flex items-center gap-1 ${isFarDoorUnlocked ? 'text-green-500' : 'text-red-500'}`}>
             <span>{isFarDoorUnlocked ? '🔓' : '🔒'}</span>
             {isFarDoorUnlocked ? 'Unlocked' : 'Locked'}
          </div>
        </div>

        {/* Right Section: Navigation Controls */}
        <div className="flex-1 flex items-center justify-end gap-2 border-l border-white/5 pl-4">
          <div className="flex flex-col gap-1 items-end mr-4">
            <div className="text-[9px] font-black text-white/90 uppercase tracking-tighter flex items-center gap-1">
              <LayoutGrid size={10} className="text-zinc-600" />
              V.1000{debugMode ? ' [DBG]' : ''}
            </div>
            <div className="text-[6px] text-zinc-600 font-mono uppercase relative overflow-hidden group">
              <span className="relative z-10">COORD: {currentPosition.row}:{currentPosition.col}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors flex items-center gap-1" title="Display">
              <Monitor size={14} />
            </button>
            <button 
              onClick={() => setShowMenu(true)}
              className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors flex items-center gap-1" 
              title="Menu"
            >
              <Menu size={14} />
            </button>
            <button 
              onClick={resetCode}
              className="p-2 bg-red-600 hover:bg-red-500 text-white rounded transition-colors flex items-center gap-1" 
              title="Home"
            >
              <Home size={14} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

import React from 'react';
import { motion } from 'motion/react';
import { useCorridorStore } from '../store/useCorridorStore';
import { X, Settings, Map as MapIcon, ScrollText, LogOut } from 'lucide-react';

export const MenuOverlay: React.FC = () => {
  const { 
    showMenu, 
    setShowMenu, 
    latticeInstance, 
    currentCode, 
    resetCode,
    debugMode 
  } = useCorridorStore();

  if (!showMenu) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[3000] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl"
    >
      <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-xl font-black text-white tracking-tight uppercase">Control Menu</h2>
            <div className="text-[10px] text-blue-500 font-mono tracking-widest uppercase mt-1">
              Lattice: {latticeInstance.toString().padStart(3, '0')} | Code: {currentCode || '---'}
            </div>
          </div>
          <button 
            onClick={() => setShowMenu(false)}
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Options */}
        <div className="p-6 space-y-3">
          <button 
            onClick={() => setShowMenu(false)}
            className="w-full p-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
          >
            Return to Corridor
          </button>

          <div className="grid grid-cols-1 gap-2 pt-2">
            {[
              { icon: Settings, label: 'System Configuration', placeholder: true },
              { icon: MapIcon, label: 'Lattice Map', placeholder: true },
              { icon: ScrollText, label: 'Operative Logs', placeholder: true },
            ].map((item, idx) => (
              <button 
                key={idx}
                className="w-full p-3 bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium rounded-lg transition-colors flex items-center gap-3 border border-white/5 group"
              >
                <item.icon size={16} className="text-slate-500 group-hover:text-blue-400 transition-colors" />
                {item.label}
                {item.placeholder && <span className="ml-auto text-[8px] opacity-30 font-mono uppercase">Placeholder</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/50 border-t border-white/5">
          <button 
            onClick={() => {
              resetCode();
              setShowMenu(false);
            }}
            className="w-full p-3 hover:bg-red-500/10 text-red-500 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 uppercase tracking-widest"
          >
            <LogOut size={14} />
            Reset Session (Home)
          </button>
        </div>

        {debugMode && (
          <div className="p-4 bg-black/40 border-t border-blue-500/20 font-mono text-[8px] text-blue-500/40 uppercase tracking-widest">
            X-TRS: {Math.random().toString(36).substring(7)} | MEM_LNK: ACTIVE
          </div>
        )}
      </div>
    </motion.div>
  );
};

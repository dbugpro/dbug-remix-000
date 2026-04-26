import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCorridorStore } from '../store/useCorridorStore';
import { Dashboard } from './Dashboard';
import { MenuOverlay } from './MenuOverlay';
import { GRID_CONFIG } from '../config';
import { calculateDepth, isValidMove, getDoorDigitForTile, isFarDoor } from '../utils/gridLogic';
import '../styles/Corridor.css';

export const CorridorView: React.FC = () => {
  const { 
    currentPosition, 
    isFarDoorUnlocked, 
    moveTo, 
    progressToNextInstance, 
    loadFromURL 
  } = useCorridorStore();
  
  const [fading, setFading] = useState(false);

  useEffect(() => {
    loadFromURL();
  }, [loadFromURL]);

  const handleTileClick = (r: number, c: number) => {
    // If it's a far door and we are unlocked, progress
    if (isFarDoor(c) && isFarDoorUnlocked) {
      setFading(true);
      setTimeout(() => {
        progressToNextInstance();
        setFading(false);
      }, 600);
      return;
    }

    // Attempt standard move
    moveTo(r, c);
    // Visual feedback for door portal activation
    if (getDoorDigitForTile(r, c)) {
      setFading(true);
      setTimeout(() => setFading(false), 300);
    }
  };

  const camZ = calculateDepth(currentPosition.col);
  const camX = -(currentPosition.row - 2) * 200; // Shift camera based on row

  return (
    <div className="corridor-root">
      <AnimatePresence>
        {fading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/20 z-[2000] pointer-events-none backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <div className="corridor-stage">
        <motion.div
          animate={{
            transform: `translateZ(${camZ}px) translateX(${camX}px) translateY(-250px)`
          }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="w-full h-full preserve-3d"
        >
          {/* Floor Grid (5x11) */}
          <div className="wall wall-floor overflow-hidden">
            <div className="relative w-full h-full">
              {Array.from({ length: GRID_CONFIG.ROWS }).map((_, r) => (
                Array.from({ length: GRID_CONFIG.COLS }).map((_, c) => {
                  const isDoor = getDoorDigitForTile(r, c);
                  const isCurrent = currentPosition.row === r && currentPosition.col === c;
                  const isAdjacent = isValidMove(currentPosition, { row: r, col: c });

                  return (
                    <div
                      key={`tile-${r}-${c}`}
                      className={`absolute tile transition-all duration-300 ${
                        isCurrent ? 'bg-blue-500/10' : 
                        isAdjacent ? 'hover:bg-blue-500/5 cursor-pointer border border-black/5' : 
                        'opacity-20 pointer-events-none'
                      }`}
                      style={{
                        left: `${r * 200}px`,
                        top: `${c * GRID_CONFIG.CORRIDOR_DEPTH_PER_COL}px`
                      }}
                      onClick={() => handleTileClick(r, c)}
                    >
                      {isDoor && (
                        <div className="absolute inset-2 border border-blue-400/20 rounded flex items-center justify-center">
                          <span className="text-[10px] font-mono text-blue-500/60 font-black">{isDoor}</span>
                        </div>
                      )}
                    </div>
                  );
                })
              ))}
            </div>
          </div>

          <div className="wall wall-ceiling" />

          {/* Left Wall Doors (Even Columns) */}
          <div className="wall wall-left">
            {[0, 2, 4, 6, 8].map((i) => (
              <div 
                key={`l-door-${i}`}
                className={`door-container ${currentPosition.col === i && currentPosition.row === 1 ? 'border-blue-500 shadow-lg' : 'opacity-40'}`}
                style={{ left: `${i * GRID_CONFIG.CORRIDOR_DEPTH_PER_COL + 100}px`, top: '130px' }}
              >
                <div className="door-handle" />
                <div className="absolute top-4 left-4 text-[8px] font-black text-zinc-400 uppercase tracking-widest">
                  PORTAL {i}
                </div>
              </div>
            ))}
          </div>

          {/* Right Wall Doors (Odd Columns) */}
          <div className="wall wall-right">
            {[1, 3, 5, 7, 9].map((i) => (
              <div 
                key={`r-door-${i}`}
                className={`door-container ${currentPosition.col === i && currentPosition.row === 3 ? 'border-blue-500 shadow-lg' : 'opacity-40'}`}
                style={{ left: `${i * GRID_CONFIG.CORRIDOR_DEPTH_PER_COL + 100}px`, top: '130px', transform: 'scaleX(-1)' }}
              >
                <div className="door-handle" />
                <div className="absolute top-4 left-4 text-[8px] font-black text-zinc-400 uppercase tracking-widest transform scaleX(-1)">
                  PORTAL {i}
                </div>
              </div>
            ))}
          </div>

          {/* Far Wall (End of Column 10) */}
          <div 
            className="absolute bg-white border-x border-zinc-200 flex flex-col items-center justify-center"
            style={{
              width: '1000px',
              height: '500px',
              transform: `translateZ(-4400px)`,
              left: '0',
              top: '0'
            }}
          >
            <div 
              className={`door-container relative transition-all duration-500 ${isFarDoorUnlocked ? 'border-blue-500 border-4' : 'opacity-20 grayscale'}`}
              style={{ width: '180px', height: '320px' }}
              onClick={() => handleTileClick(currentPosition.row, 10)}
            >
              <div className={`w-3 h-3 rounded-full absolute top-8 left-1/2 -translate-x-1/2 ${isFarDoorUnlocked ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`} />
              <div className="door-handle" />
              <div className="text-center">
                <div className="text-[10px] font-black text-blue-500/80 uppercase tracking-[0.3em] mb-1">Exit Link</div>
                <div className="text-5xl font-black text-zinc-900 font-mono tracking-tighter">
                  {isFarDoorUnlocked ? 'ACTV' : 'LOCK'}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <Dashboard />
      <MenuOverlay />
    </div>
  );
};

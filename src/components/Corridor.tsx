import React from 'react';
import { motion } from 'motion/react';
import { useCorridorState } from '../hooks/useCorridorState';
import { HUD } from './HUD';
import '../styles/Corridor.css';

export const Corridor: React.FC = () => {
  const { state, setPosition, reset, nextInstance } = useCorridorState();

  const handleTileClick = (tx: number, tz: number) => {
    setPosition(tx, tz);
  };

  const handleDoorClick = (type: string) => {
    if (type === 'far') {
      nextInstance();
    }
  };

  // 1000px floor width / 5 tiles across = 200px each
  // 4000px depth / 40 tiles deep = 100px each
  const renderTiles = () => {
    const tiles = [];
    for (let x = -2; x <= 2; x++) {
      for (let z = 0; z < 40; z++) {
        tiles.push(
          <div
            key={`tile-${x}-${z}`}
            className="absolute tile"
            style={{
              left: `${(x + 2) * 200}px`,
              top: `${z * 100}px`
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleTileClick(x, z);
            }}
          />
        );
      }
    }
    return tiles;
  };

  // Camera calculations
  const camX = -state.x * 200;
  const camZ = state.z * 100 - 300; // -300 to give some starting space

  return (
    <div className="corridor-root">
      <div className="corridor-stage">
        <motion.div
          animate={{
            transform: `translateZ(${-camZ}px) translateX(${camX}px)`
          }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="w-full h-full preserve-3d"
        >
          {/* Floor */}
          <div className="wall wall-floor overflow-hidden">
            <div className="relative w-full h-full bg-white/5">
              {renderTiles()}
            </div>
          </div>

          {/* Ceiling */}
          <div className="wall wall-ceiling" />

          {/* Side Walls */}
          <div className="wall wall-left">
            {[0, 1, 2, 3, 4].map(i => (
              <div 
                key={`l-door-${i}`}
                className="door-container"
                style={{ left: `${i * 800 + 400}px`, top: '90px' }}
                onClick={() => handleDoorClick('left')}
              >
                <div className="door-handle" />
                <div className="absolute top-4 left-4 text-[9px] font-black text-zinc-300 uppercase letter-spacing-widest">
                  Sector {i * 2}L
                </div>
              </div>
            ))}
          </div>

          <div className="wall wall-right">
            {[0, 1, 2, 3, 4].map(i => (
              <div 
                key={`r-door-${i}`}
                className="door-container"
                style={{ left: `${i * 800 + 400}px`, top: '90px', transform: 'scaleX(-1)' }}
                onClick={() => handleDoorClick('right')}
              >
                <div className="door-handle" />
                <div className="absolute top-4 left-4 text-[9px] font-black text-zinc-300 uppercase letter-spacing-widest transform scaleX(-1)">
                  Sector {i * 2 + 1}R
                </div>
              </div>
            ))}
          </div>

          {/* Far Wall */}
          <div 
            className="absolute bg-white border-x border-zinc-200"
            style={{
              width: '1000px',
              height: '500px',
              transform: 'translateZ(-3800px) translateY(-250px)',
              left: 'calc(50% - 500px)'
            }}
          >
            <div className="flex flex-col items-center justify-center h-full">
              <div 
                className="door-container relative"
                style={{ width: '180px', height: '360px' }}
                onClick={() => handleDoorClick('far')}
              >
                <div className="door-handle" />
                <div className="text-center">
                  <div className="text-[10px] font-black text-blue-500 uppercase tracking-tighter mb-1">Sync Point</div>
                  <div className="text-3xl font-black text-zinc-900 font-mono">
                    {String(state.instance).padStart(3, '0')}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </motion.div>
      </div>

      <HUD state={state} onReset={reset} />
    </div>
  );
};

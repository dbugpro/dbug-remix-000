import React from 'react';
import { motion } from 'motion/react';
import { useCorridorStore } from '../store/useCorridorStore';
import { HUD } from './HUD';
import '../styles/Corridor.css';

export const Corridor: React.FC = () => {
  const { x, z, instance, setPosition, nextInstance, reset } = useCorridorStore();

  const handleTileClick = (tx: number, tz: number) => {
    setPosition(tx, tz);
  };

  const handleDoorClick = (type: string) => {
    if (type === 'far') {
      nextInstance();
    }
  };

  const renderTiles = () => {
    const tiles = [];
    for (let tx = -2; tx <= 2; tx++) {
      for (let tz = 0; tz < 40; tz++) {
        tiles.push(
          <div
            key={`tile-${tx}-${tz}`}
            className="absolute tile"
            style={{
              left: `${(tx + 2) * 200}px`,
              top: `${tz * 100}px`
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleTileClick(tx, tz);
            }}
          />
        );
      }
    }
    return tiles;
  };

  const camX = -x * 200;
  const camZ = z * 100 - 300;

  return (
    <div className="corridor-root">
      <div className="corridor-stage">
        <motion.div
          animate={{
            transform: `translateZ(${-camZ}px) translateX(${camX}px)`
          }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
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
            {[0, 1, 2].map(i => (
              <div 
                key={`l-door-${i}`}
                className="door-container"
                style={{ left: `${i * 1200 + 400}px`, top: '90px' }}
                onClick={() => handleDoorClick('left')}
              >
                <div className="door-handle" />
              </div>
            ))}
          </div>

          <div className="wall wall-right">
            {[0, 1, 2].map(i => (
              <div 
                key={`r-door-${i}`}
                className="door-container"
                style={{ left: `${i * 1200 + 400}px`, top: '90px', transform: 'scaleX(-1)' }}
                onClick={() => handleDoorClick('right')}
              >
                <div className="door-handle" />
              </div>
            ))}
          </div>

          {/* Far Wall */}
          <div 
            className="absolute bg-white border-x border-zinc-100"
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
                style={{ width: '150px', height: '300px' }}
                onClick={() => handleDoorClick('far')}
              >
                <div className="door-handle" />
                <div className="text-center">
                  <div className="text-[8px] font-black text-blue-500/80 uppercase tracking-[0.3em] mb-1">Next Link</div>
                  <div className="text-4xl font-black text-zinc-900 font-mono tracking-tighter">
                    {String(instance + 1).padStart(2, '0')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <HUD />
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Door } from './Door';
import { Screen } from './Screen';
import { useCorridorStore } from '../store/useCorridorStore';
import '../styles/corridor.css';

export const Corridor: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { instanceCount, currentCell, isFarDoorUnlocked, incrementInstance } = useCorridorStore();
  const [zoom, setZoom] = useState(0);
  const [lastDistance, setLastDistance] = useState<number | null>(null);

  const handleWheel = (e: React.WheelEvent) => {
    // Zoom in on deltaY < 0, out on deltaY > 0
    setZoom(prev => Math.min(Math.max(prev - e.deltaY, 0), 1500));
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );
      
      if (lastDistance !== null) {
        // Multiplier to make it feel natural
        const delta = (distance - lastDistance) * 3;
        setZoom(prev => Math.min(Math.max(prev + delta, 0), 1500));
      }
      setLastDistance(distance);
    }
  };

  const handleTouchEnd = () => {
    setLastDistance(null);
  };

  const showDebug = searchParams.get('debug') === 'true';

  // Side door configuration
  const leftDoors = [0, 2, 4, 6, 8];
  const rightDoors = [1, 3, 5, 7, 9];
  const doorSpacing = 300; // Increased spacing for long hallway feel

  // Sync state to URL
  useEffect(() => {
    const params: Record<string, string> = { cell: currentCell };
    if (showDebug) params.debug = 'true';
    setSearchParams(params);
  }, [currentCell, setSearchParams, showDebug]);

  const handleDoorClick = (num: number, position: string) => {
    if (position === 'far') {
      if (isFarDoorUnlocked) {
        console.log('Proceeding to next MAGICUBE instance');
        incrementInstance();
      } else {
        console.log('Far door is LOCKED. Reach Instance 003.');
      }
      return;
    }
    
    console.log(`Entering Cell ${num} - Incrementing Instance`);
    incrementInstance();
  };

  const handleNearDoorClick = () => {
    console.log('Exiting current sector');
  };

  return (
    <div 
      className="corridor-container" 
      id="corridor-root"
      onWheel={handleWheel}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Debug Overlay */}
      {showDebug && (
        <div className="debug-overlay">
          <div>INSTANCE: {String(instanceCount).padStart(3, '0')}</div>
          <div>CELL: {currentCell}</div>
          <div>STATUS: {isFarDoorUnlocked ? 'ACCESS GRANTED' : 'RESTRICTED'}</div>
        </div>
      )}

      <div className="corridor" style={{ transform: `translateZ(${zoom}px)` }}>
        {/* Walls */}
        <div className="wall wall-left" />
        <div className="wall wall-right" />
        <div className="wall wall-ceiling" />
        <div className="wall wall-floor" />
        
        {/* Far Wall */}
        <div className="wall wall-far">
          <div className="door-frame far-frame">
             <div className="mb-4 text-center">
                <div className="text-xs text-zinc-500 uppercase tracking-widest font-mono">Instance</div>
                <div className={`text-3xl font-mono ${isFarDoorUnlocked ? 'text-green-500' : 'text-red-500'}`}>
                  {String(instanceCount).padStart(3, '0')}
                </div>
                <div className="mt-1 text-[10px] text-zinc-600 uppercase font-mono">
                  {isFarDoorUnlocked ? 'UNLOCKED' : 'LOCKED'}
                </div>
             </div>
             <Door 
               number={0} 
               position="far" 
               onClick={() => handleDoorClick(0, 'far')} 
               isLocked={!isFarDoorUnlocked} 
               isUnlocked={isFarDoorUnlocked}
             />
          </div>
        </div>

        {/* Left Wall Doors (Even) */}
        {leftDoors.map((num, index) => (
          <div 
            key={num} 
            className="door-frame left-side"
            style={{ transform: `translateX(calc(-1 * var(--side-offset, 300px))) translate3d(0, 0, ${-index * doorSpacing - 100}px) rotateY(90deg)` }}
          >
            <Screen 
              position="left" 
              content={`CELL ${num}`} 
              metadata={num === 0 ? "Entry Matrix" : "Access Point"}
              interactive 
              onClick={() => handleDoorClick(num, 'left')} 
            />
            <Door 
              number={num} 
              position="left" 
              onClick={() => handleDoorClick(num, 'left')} 
            />
          </div>
        ))}

        {/* Right Wall Doors (Odd) */}
        {rightDoors.map((num, index) => (
          <div 
            key={num} 
            className="door-frame right-side"
            style={{ transform: `translateX(var(--side-offset, 300px)) translate3d(0, 0, ${-index * doorSpacing - 100}px) rotateY(-90deg)` }}
          >
            <Screen 
              position="left" 
              content={`CELL ${num}`} 
              metadata="Sub-Matrix"
              interactive 
              onClick={() => handleDoorClick(num, 'right')} 
            />
            <Door 
              number={num} 
              position="right" 
              onClick={() => handleDoorClick(num, 'right')} 
            />
          </div>
        ))}

        {/* Near Wall */}
        <div className="wall wall-near" />
      </div>
    </div>
  );
};

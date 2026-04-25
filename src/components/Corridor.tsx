import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Door } from './Door';
import { Screen } from './Screen';
import { useCorridorStore } from '../store/useCorridorStore';
import '../styles/corridor.css';

export const Corridor: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { 
    instanceCount, 
    currentCell, 
    isFarDoorUnlocked, 
    incrementInstance,
    focusedDoor,
    setFocus,
    doorState,
    setDoorState
  } = useCorridorStore();
  
  const [zoom, setZoom] = useState(0);
  const [lastDistance, setLastDistance] = useState<number | null>(null);

  const handleWheel = (e: React.WheelEvent) => {
    setZoom(prev => Math.min(Math.max(prev - e.deltaY, 0), 1800));
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );
      
      if (lastDistance !== null) {
        const delta = (distance - lastDistance) * 3;
        setZoom(prev => Math.min(Math.max(prev + delta, 0), 1800));
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
  const doorSpacing = 300;

  // Sync state to URL
  useEffect(() => {
    const params: Record<string, string> = { cell: currentCell };
    if (showDebug) params.debug = 'true';
    if (focusedDoor !== null) params.focus = String(focusedDoor);
    setSearchParams(params);
  }, [currentCell, setSearchParams, showDebug, focusedDoor]);

  const handleDoorClick = (num: number, position: 'left' | 'right' | 'far' | 'near') => {
    if (focusedDoor === num) {
      // Second click: Open
      if (position === 'far') {
        if (isFarDoorUnlocked) {
          setDoorState('opened');
          setTimeout(() => {
            window.location.href = '/123'; // Navigate to BUGWORLD
          }, 600);
        }
        return;
      }

      setDoorState('opened');
      setTimeout(() => {
        incrementInstance();
        setFocus(null);
        setDoorState('corridor');
      }, 600);
    } else {
      // First click: Focus
      setFocus(num);
      setDoorState('focused');
      // Adjust zoom to face the door? The user said "adjusted the view so that the door is right in front of me"
      // We can use a transition on the corridor container if we had rotation, but since we are just zooming,
      // maybe we just set a specific zoom or transform.
      // However, the original layout was linear.
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setFocus(null);
      setDoorState('corridor');
    }
  };

  // Calculate container transform based on focus
  let corridorTransform = `translateZ(${zoom}px)`;
  if (focusedDoor !== null && doorState !== 'corridor') {
    // If focused, we might want to override or additive transform
    // For now, let's keep it simple or use the store to drive more complex camera if needed.
    // The user just wants the focus logic back.
  }

  return (
    <div 
      className="corridor-container" 
      id="corridor-root"
      onWheel={handleWheel}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleBackdropClick}
    >
      {/* Debug Overlay */}
      {showDebug && (
        <div className="debug-overlay">
          <div>INSTANCE: {String(instanceCount).padStart(3, '0')}</div>
          <div>CELL: {currentCell}</div>
          <div>STATUS: {isFarDoorUnlocked ? 'ACCESS GRANTED' : 'RESTRICTED'}</div>
        </div>
      )}

      <div className="corridor" style={{ transform: corridorTransform }}>
        {/* Walls */}
        <div className="wall wall-left" />
        <div className="wall wall-right" />
        <div className="wall wall-ceiling" />
        <div className="wall wall-floor" />
        
        {/* Far Wall */}
        <div className="wall wall-far">
          <div className="door-frame far-frame">
             <div className="mb-4 text-center">
                <div className="text-xs text-zinc-400 uppercase tracking-widest font-mono">Instance</div>
                <div className={`text-3xl font-mono ${isFarDoorUnlocked ? 'text-blue-500' : 'text-zinc-300'}`}>
                  {String(instanceCount).padStart(3, '0')}
                </div>
                <div className="mt-1 text-[8px] text-zinc-400 uppercase font-mono">
                  {isFarDoorUnlocked ? 'LATTICE SYNC READY' : 'LEVEL PROGRESSION REQUIRED'}
                </div>
             </div>
             <div className="relative">
               {focusedDoor === 100 && doorState === 'focused' && (
                 <div className="prompt-overlay">CLICK TO ENTER LATTICE</div>
               )}
               <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold font-mono text-zinc-500 bg-white/90 px-3 py-1 rounded shadow-sm border border-zinc-200 whitespace-nowrap">
                 SYNC PORTAL
               </div>
               <Door 
                 number={0} 
                 position="far" 
                 onClick={() => handleDoorClick(100, 'far')} 
                 isLocked={!isFarDoorUnlocked} 
                 isUnlocked={isFarDoorUnlocked}
                 isFocused={focusedDoor === 100}
                 isOpened={focusedDoor === 100 && doorState === 'opened'}
               />
             </div>
          </div>
        </div>

        {/* Left Wall Doors (Even) */}
        {leftDoors.map((num, index) => (
          <div 
            key={num} 
            className="door-frame left-side"
            style={{ transform: `translateX(calc(-1 * var(--side-offset, 300px))) translate3d(0, 0, ${-index * doorSpacing - 100}px) rotateY(90deg)` }}
          >
            <div className="relative">
              {focusedDoor === num && doorState === 'focused' && (
                <div className="prompt-overlay">ENTER SECTOR</div>
              )}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold font-mono text-zinc-500 bg-white/90 px-2 py-0.5 rounded shadow-sm border border-zinc-200">
                SECTOR {num}
              </div>
              <Door 
                number={num} 
                position="left" 
                onClick={() => handleDoorClick(num, 'left')} 
                isFocused={focusedDoor === num}
                isOpened={focusedDoor === num && doorState === 'opened'}
              />
            </div>
          </div>
        ))}

        {/* Right Wall Doors (Odd) */}
        {rightDoors.map((num, index) => (
          <div 
            key={num} 
            className="door-frame right-side"
            style={{ transform: `translateX(var(--side-offset, 300px)) translate3d(0, 0, ${-index * doorSpacing - 100}px) rotateY(-90deg)` }}
          >
            <div className="relative">
              {focusedDoor === num && doorState === 'focused' && (
                <div className="prompt-overlay">ENTER SECTOR</div>
              )}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold font-mono text-zinc-500 bg-white/90 px-2 py-0.5 rounded shadow-sm border border-zinc-200">
                SECTOR {num}
              </div>
              <Door 
                number={num} 
                position="right" 
                onClick={() => handleDoorClick(num, 'right')} 
                isFocused={focusedDoor === num}
                isOpened={focusedDoor === num && doorState === 'opened'}
              />
            </div>
          </div>
        ))}

        {/* Near Wall */}
        <div className="wall wall-near" />
      </div>
    </div>
  );
};

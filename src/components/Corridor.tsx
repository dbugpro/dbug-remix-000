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
    decrementInstance,
    focusedDoor,
    setFocus,
    doorState,
    setDoorState
  } = useCorridorStore();
  
  const [zoom, setZoom] = useState(0);
  const [panX, setPanX] = useState(0);
  const [rotationY, setRotationY] = useState(0);
  const [lastDistance, setLastDistance] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [mouseStartX, setMouseStartX] = useState(0);
  const [mouseStartY, setMouseStartY] = useState(0);

  const handleReset = () => {
    setZoom(0);
    setPanX(0);
    setRotationY(0);
    setFocus(null);
    setDoorState('corridor');
  };

  const handleWheel = (e: React.WheelEvent) => {
    setZoom(prev => Math.min(Math.max(prev - e.deltaY, 0), 1800));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX - panX);
    setStartY(e.clientY - zoom);
    setMouseStartX(e.clientX);
    setMouseStartY(e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    // Pan sideways
    const newX = e.clientX - startX;
    setPanX(Math.min(Math.max(newX, -1000), 1000));
    
    // Move forward/back with vertical drag
    const newZoom = e.clientY - startY;
    setZoom(Math.min(Math.max(newZoom, -100), 1800));

    // Turn with X
    setRotationY(newX * 0.2); 
    // Pan limited
    setPanX(Math.min(Math.max(newX * 0.5, -200), 200));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setStartX(e.touches[0].pageX - panX);
      setStartY(e.touches[0].pageY - zoom);
      setMouseStartX(e.touches[0].pageX);
      setMouseStartY(e.touches[0].pageY);
    } else if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );
      setLastDistance(distance);
    }
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
    } else if (e.touches.length === 1) {
      const newX = e.touches[0].pageX - startX;
      const newZoom = e.touches[0].pageY - startY;
      setZoom(Math.min(Math.max(newZoom, -100), 1800));
      setRotationY(newX * 0.2);
      setPanX(Math.min(Math.max(newX * 0.5, -200), 200));
    }
  };

  const handleTouchEnd = () => {
    setLastDistance(null);
  };

  const showDebug = searchParams.get('debug') === 'true';

  // Side door configuration
  const leftDoors = [0, 2, 4, 6, 8];
  const rightDoors = [1, 3, 5, 7, 9];
  const doorSpacing = 350;

  // Sync state to URL
  useEffect(() => {
    const params: Record<string, string> = { cell: currentCell };
    if (showDebug) params.debug = 'true';
    if (focusedDoor !== null) params.focus = String(focusedDoor);
    setSearchParams(params);
  }, [currentCell, setSearchParams, showDebug, focusedDoor]);

  const handleDoorClick = (num: number, position: 'left' | 'right' | 'far' | 'near', event: React.MouseEvent) => {
    event.stopPropagation();
    
    // increase displacement threshold for mobile/touch
    const dx = Math.abs(event.clientX - mouseStartX);
    const dy = Math.abs(event.clientY - mouseStartY);
    if (dx > 40 || dy > 40) {
      console.log('Click ignored due to move displacement:', dx, dy);
      return;
    }

    console.log(`Door Clicked: num=${num}, pos=${position}, state=${doorState}, focused=${focusedDoor}`);

    if (focusedDoor === num) {
      // Second click: Open
      if (position === 'far') {
        if (isFarDoorUnlocked) {
          setDoorState('opened');
          setTimeout(() => {
            window.location.href = '/123';
          }, 800);
        }
        return;
      }

      setDoorState('opened');
      setTimeout(() => {
        if (position === 'near') {
          decrementInstance();
        } else {
          incrementInstance();
        }
        setFocus(null);
        setDoorState('corridor');
        setZoom(0);
        setPanX(0);
        setRotationY(0);
      }, 1000);
    } else {
      // First click: Focus
      setFocus(num);
      setDoorState('focused');
      
      // Adjust view so the door is front-center
      if (position === 'left') {
        setPanX(200);
        setZoom(800);
        setRotationY(-90);
      } else if (position === 'right') {
        setPanX(-200);
        setZoom(800);
        setRotationY(90);
      } else if (position === 'far') {
        setPanX(0);
        setZoom(1200);
        setRotationY(0);
      } else if (position === 'near') {
        setPanX(0);
        setZoom(-200);
        setRotationY(180);
      }
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    console.log('Backdrop Clicked:', e.target === e.currentTarget ? 'CONTAINER' : 'ELEMENT', (e.target as HTMLElement).className);
    if (e.target === e.currentTarget) {
      setFocus(null);
      setDoorState('corridor');
    }
  };

  const renderDoor = (num: number, position: 'left' | 'right' | 'far' | 'near', index: number = 0) => {
    const isFocused = focusedDoor === num;
    const isOpened = isFocused && doorState === 'opened';
    const isLocked = position === 'far' ? !isFarDoorUnlocked : false;
    const isUnlocked = position === 'far' ? isFarDoorUnlocked : false;

    const frameStyle = (position === 'left' || position === 'right') ? { 
      transform: `${position === 'left' ? 'translateX(calc(-1 * var(--side-offset, 300px)))' : 'translateX(var(--side-offset, 300px))'} translate3d(0, 0, ${-index * doorSpacing - 100}px) rotateY(${position === 'left' ? '90deg' : '-90deg'})` 
    } : position === 'near' ? {
      transform: 'rotateY(180deg) translateZ(1px)' // Prevent z-fighting
    } : {};

    return (
      <div 
        key={num} 
        className={`door-frame ${position}-side`}
        style={frameStyle}
      >
        <div className="relative pointer-events-none">
          {isFocused && doorState === 'focused' && (
            <div className="prompt-overlay">{position === 'far' ? 'CLICK TO SYNC LATTICE' : position === 'near' ? 'CLICK TO RETURN' : 'CLICK TO ENTER'}</div>
          )}
          <div className="door-label">
            {position === 'far' ? (isFarDoorUnlocked ? 'LATTICE PORTAL' : 'CORE LOCKED') : position === 'near' ? 'RETURN PORTAL' : `SECTOR ${num}`}
          </div>
          <div className="pointer-events-auto">
            <Door 
              number={num === -1 ? 0 : num} 
              position={position} 
              onClick={(e) => handleDoorClick(num, position, e)} 
              isFocused={isFocused}
              isOpened={isOpened}
              isLocked={isLocked}
              isUnlocked={isUnlocked}
            />
          </div>
        </div>
      </div>
    );
  };

  // Calculate container transform based on focus
  let corridorTransform = `rotateY(${rotationY}deg) translateZ(${zoom}px) translateX(${panX}px)`;
  if (focusedDoor !== null && doorState !== 'corridor') {
    // Optional focus positioning
  }

  return (
    <div 
      className="corridor-container" 
      id="corridor-root"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleBackdropClick}
    >
      {/* Dashboard Overlay */}
      <div className="fixed bottom-0 left-0 w-full z-50 pointer-events-none">
        <div className="max-w-xl mx-auto px-6 pb-8">
          <div className="bg-white/80 backdrop-blur-md border border-zinc-200/50 rounded-2xl shadow-2xl p-4 flex items-center justify-between pointer-events-auto">
            {/* Location Info */}
            <div className="flex flex-col">
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none mb-1">
                Lattice Coordinates
              </div>
              <div className="flex items-center gap-3">
                <div className="font-mono text-lg font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100/50">
                  {currentCell}
                </div>
                <div className="h-4 w-[1px] bg-zinc-200" />
                <div className="text-xs font-medium text-zinc-500 uppercase tracking-tighter">
                  Instance <span className="text-zinc-900">{String(instanceCount).padStart(3, '0')}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button 
                onClick={(e) => { e.stopPropagation(); handleReset(); }}
                className="bg-zinc-900 text-white hover:bg-blue-600 px-4 py-2 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all flex items-center gap-2 group"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 group-hover:bg-white animate-pulse" />
                Recenter
              </button>
            </div>
          </div>
        </div>
      </div>

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
             {renderDoor(100, 'far')}
          </div>
        </div>

        {/* Side Doors */}
        {leftDoors.map((num, index) => renderDoor(num, 'left', index))}
        {rightDoors.map((num, index) => renderDoor(num, 'right', index))}

        {/* Near Wall */}
        <div className="wall wall-near">
          <div className="door-frame near-frame">
             {instanceCount > 0 && renderDoor(-1, 'near')}
          </div>
        </div>
      </div>
    </div>
  );
};

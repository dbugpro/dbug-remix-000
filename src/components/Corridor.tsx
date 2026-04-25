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
  const [panX, setPanX] = useState(0);
  const [lastDistance, setLastDistance] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [mouseStartX, setMouseStartX] = useState(0);
  const [mouseStartY, setMouseStartY] = useState(0);

  const handleWheel = (e: React.WheelEvent) => {
    setZoom(prev => Math.min(Math.max(prev - e.deltaY, 0), 1800));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX - panX);
    setMouseStartX(e.clientX);
    setMouseStartY(e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - startX;
    setPanX(Math.min(Math.max(newX, -1000), 1000));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setStartX(e.touches[0].pageX - panX);
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
      setPanX(Math.min(Math.max(newX, -1000), 1000));
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

  const handleDoorClick = (num: number, position: 'left' | 'right' | 'far', event: React.MouseEvent) => {
    event.stopPropagation();
    
    // Disambiguate click from drag
    const dx = Math.abs(event.clientX - mouseStartX);
    const dy = Math.abs(event.clientY - mouseStartY);
    if (dx > 10 || dy > 10) return;

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
        incrementInstance();
        setFocus(null);
        setDoorState('corridor');
        setZoom(0);
        setPanX(0);
      }, 1000);
    } else {
      // First click: Focus
      setFocus(num);
      setDoorState('focused');
      
      // Adjust view so the door is front-center
      if (position === 'left') {
        setPanX(400);
        setZoom(800);
      } else if (position === 'right') {
        setPanX(-400);
        setZoom(800);
      } else if (position === 'far') {
        setPanX(0);
        setZoom(1200);
      }
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setFocus(null);
      setDoorState('corridor');
    }
  };

  const renderDoor = (num: number, position: 'left' | 'right' | 'far', index: number = 0) => {
    const isFocused = focusedDoor === num;
    const isOpened = isFocused && doorState === 'opened';
    const isLocked = position === 'far' ? !isFarDoorUnlocked : false;
    const isUnlocked = position === 'far' ? isFarDoorUnlocked : false;

    const frameStyle = position !== 'far' ? { 
      transform: `${position === 'left' ? 'translateX(calc(-1 * var(--side-offset, 300px)))' : 'translateX(var(--side-offset, 300px))'} translate3d(0, 0, ${-index * doorSpacing - 100}px) rotateY(${position === 'left' ? '90deg' : '-90deg'})` 
    } : {};

    return (
      <div 
        key={num} 
        className={`door-frame ${position}-side`}
        style={frameStyle}
      >
        <div className="relative">
          {isFocused && doorState === 'focused' && (
            <div className="prompt-overlay">{position === 'far' ? 'CLICK TO SYNC LATTICE' : 'CLICK TO ENTER'}</div>
          )}
          <div className="door-label">
            {position === 'far' ? (isFarDoorUnlocked ? 'LATTICE PORTAL' : 'CORE LOCKED') : `SECTOR ${num}`}
          </div>
          <Door 
            number={num} 
            position={position} 
            onClick={(e) => handleDoorClick(num, position, e)} 
            isFocused={isFocused}
            isOpened={isOpened}
            isLocked={isLocked}
            isUnlocked={isUnlocked}
          />
        </div>
      </div>
    );
  };

  // Calculate container transform based on focus
  let corridorTransform = `translateZ(${zoom}px) translateX(${panX}px)`;
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
        <div className="wall wall-near" />
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Door } from './Door';
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
    
    // Pan sideways - slightly more limited to feel more like looking around
    const newX = e.clientX - startX;
    
    // Move forward/back with vertical drag - constrained to corridor length
    const newZoom = e.clientY - startY;
    setZoom(Math.min(Math.max(newZoom, -100), 1600));

    // Turn with X - allow full 360 rotation to see behind
    const newRotation = newX * 0.3;
    setRotationY(newRotation); 
    
    // Slight lateral movement (panning) - constrained strictly to stay within walls
    setPanX(Math.min(Math.max(newX * 0.2, -150), 150));
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
      setZoom(Math.min(Math.max(newZoom, -100), 1600));
      setRotationY(newX * 0.3);
      setPanX(Math.min(Math.max(newX * 0.2, -150), 150));
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

  const handleDoorClick = (num: number, position: 'left' | 'right' | 'far' | 'near', event: React.PointerEvent | React.MouseEvent) => {
    event.stopPropagation();
    
    // Generous click threshold
    const dx = Math.abs((event as any).clientX - mouseStartX);
    const dy = Math.abs((event as any).clientY - mouseStartY);
    if (dx > 40 || dy > 40) return;

    if (focusedDoor === num) {
      handleEnterDoor(num, position);
    } else {
      // First click: Focus
      setFocus(num);
      setDoorState('focused');
      
      // Adjust view so the door is front-center
      if (position === 'left') {
        setPanX(150);
        setRotationY(-80);
        setZoom(400); // Zoom in slightly on focus
      } else if (position === 'right') {
        setPanX(-150);
        setRotationY(80);
        setZoom(400);
      } else if (position === 'far') {
        setPanX(0);
        setRotationY(0);
        setZoom(1400);
      } else if (position === 'near') {
        setPanX(0);
        setRotationY(180);
        setZoom(-100);
      }
    }
  };

  const handleEnterDoor = (num: number, position: string) => {
    if (position === 'far' && !isFarDoorUnlocked) return;

    setDoorState('opened');
    setTimeout(() => {
      if (position === 'near') {
        decrementInstance();
      } else {
        incrementInstance();
      }
      handleReset();
    }, 1000);
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
    const isUnlocked = !isLocked;

    const frameStyle = (position === 'left' || position === 'right') ? { 
      transform: `${position === 'left' ? 'translateX(calc(-1 * var(--side-offset, 300px)))' : 'translateX(var(--side-offset, 300px))'} translate3d(0, 0, ${-index * doorSpacing - 100}px) rotateY(${position === 'left' ? '90deg' : '-90deg'})` 
    } : position === 'near' ? {
      transform: 'rotateY(180deg) translateZ(1px)' // Prevent z-fighting
    } : {};

    return (
      <div 
        key={`${position}-${num}`} 
        className={`door-frame ${position}-side ${isFocused ? 'focused-frame' : ''}`}
        style={frameStyle}
      >
        <div className="relative pointer-events-none">
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
          {isFocused && (
            <div className="absolute inset-0 bg-blue-500/5 rounded-sm ring-2 ring-blue-500/40 pointer-events-none animate-pulse" />
          )}
        </div>
      </div>
    );
  };

  // Calculate container transform based on focus
  const corridorTransform = `rotateY(${rotationY}deg) translateZ(${zoom}px) translateX(${panX}px)`;
  if (focusedDoor !== null && doorState !== 'corridor') {
    // Optional focus positioning
  }

  return (
    <div className="corridor-view-root">
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
          {/* Walls - ensure pointer-events: none so they don't block doors */}
          <div className="wall wall-left pointer-events-none" />
          <div className="wall wall-right pointer-events-none" />
          <div className="wall wall-ceiling pointer-events-none" />
          <div className="wall wall-floor pointer-events-none" />
          
          {/* Far Wall */}
          <div className="wall wall-far pointer-events-none">
            <div className="door-frame far-frame pointer-events-auto">
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
          <div className="wall wall-near pointer-events-none">
            <div className="door-frame near-frame pointer-events-auto">
               {instanceCount > 0 && renderDoor(-1, 'near')}
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Overlay - Handheld HUD design */}
      <div className="fixed bottom-0 left-0 w-full z-[100] pb-8 flex justify-center px-4 pointer-events-none">
        <div className="bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-5 flex items-center gap-6 pointer-events-auto max-w-xl w-full translate-y-2 hover:translate-y-0 transition-transform duration-500 shadow-blue-500/10">
          {/* Location Info */}
          <div className="flex flex-col gap-1 pr-6 border-r border-white/10 min-w-[140px]">
            <div className="text-[9px] font-bold text-blue-400/80 uppercase tracking-widest flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-blue-400"></div>
              Location Hub
            </div>
            <div className="flex items-center gap-3">
              <div className="font-mono text-xl font-bold text-white tracking-tighter">
                {currentCell}
              </div>
              <div className="bg-blue-500/10 px-2 py-0.5 rounded text-[10px] font-bold text-blue-400 font-mono">
                LVL {String(instanceCount).padStart(2, '0')}
              </div>
            </div>
          </div>

          {/* Center Display - Interaction Context */}
          <div className="flex-1 flex flex-col gap-1 overflow-hidden">
             <div className="text-[8px] font-bold text-white/40 uppercase tracking-widest whitespace-nowrap">
               {focusedDoor !== null ? 'Proximity Alert' : 'Scanning Environment...'}
             </div>
             <div className="flex items-center gap-2 overflow-hidden">
                <div className={`w-1.5 h-1.5 rounded-full ${focusedDoor !== null ? 'bg-amber-500' : 'bg-green-500'} shadow-[0_0_8px_rgba(34,197,94,0.3)] animate-pulse`} />
                <div className="text-[11px] font-bold text-white tracking-wide uppercase truncate">
                  {focusedDoor !== null 
                    ? `Door identified at sector ${focusedDoor}` 
                    : 'Corridor integrity normal'}
                </div>
             </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 ml-auto">
            {focusedDoor !== null && (
               <button 
                 onClick={(e) => { e.stopPropagation(); setFocus(null); setDoorState('corridor'); }}
                 className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 px-4 py-2.5 rounded-2xl text-[10px] font-bold tracking-widest uppercase transition-all"
               >
                 Exit View
               </button>
            )}
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                if (focusedDoor !== null) {
                  // Find the position of the focused door
                  let pos: 'left' | 'right' | 'far' | 'near' = 'far';
                  if (focusedDoor === -1) pos = 'near';
                  else if (focusedDoor === 100) pos = 'far';
                  else if (leftDoors.includes(focusedDoor)) pos = 'left';
                  else if (rightDoors.includes(focusedDoor)) pos = 'right';
                  handleEnterDoor(focusedDoor, pos);
                } else {
                  handleReset();
                }
              }}
              className={`px-5 py-3 rounded-2xl text-[10px] font-black tracking-widest uppercase transition-all flex items-center gap-3 ${
                focusedDoor !== null 
                  ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20' 
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              {focusedDoor !== null ? 'Enter Portal' : 'Recenter HUD'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

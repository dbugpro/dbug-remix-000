import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Door } from './Door';
import { Screen } from './Screen';
import { useCorridorStore } from '../store/useCorridorStore';
import { useDragPan } from '../hooks/useDragPan';
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

  const { rotation, setRotation, isDragging, handleStart } = useDragPan(45);

  const showDebug = searchParams.get('debug') === 'true';

  // Side door sequence along depth
  const leftDoors = [0, 2, 4, 6, 8];
  const rightDoors = [1, 3, 5, 7, 9];

  // Progression logic: 000 -> 003
  const doorSpacing = 150; // Spacing along Z axis

  // Sync state to URL
  useEffect(() => {
    const params: Record<string, string> = { cell: currentCell };
    if (showDebug) params.debug = 'true';
    if (focusedDoor !== null) params.focus = String(focusedDoor);
    setSearchParams(params);
  }, [currentCell, setSearchParams, showDebug, focusedDoor]);

  const handleDoorClick = (num: number, position: 'left' | 'right' | 'far' | 'near') => {
    if (isDragging) return;

    if (focusedDoor === num) {
      if (position === 'far') {
        if (isFarDoorUnlocked) {
          setDoorState('opened');
          setTimeout(() => {
            incrementInstance();
            setFocus(null);
            setDoorState('corridor');
            setRotation(0);
          }, 500);
        }
        return;
      }
      
      if (position === 'near') {
        console.log('Exit corridor');
        return;
      }

      // Side doors
      setDoorState('opened');
      setTimeout(() => {
        incrementInstance();
        setFocus(null);
        setDoorState('corridor');
        setRotation(0);
      }, 500);
    } else {
      setFocus(num);
      setDoorState('focused');
      // Set rotation to face door
      if (position === 'left') setRotation(45);
      if (position === 'right') setRotation(-45);
      if (position === 'far') setRotation(0);
      if (position === 'near') setRotation(180); // Optional: if we want to turn around
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setFocus(null);
      setDoorState('corridor');
      setRotation(0);
    }
  };

  return (
    <div 
      className={`corridor-container ${isDragging ? 'dragging' : 'draggable'}`} 
      id="corridor-root"
      onMouseDown={(e) => handleStart(e.clientX)}
      onTouchStart={(e) => handleStart(e.touches[0].clientX)}
      onClick={handleBackdropClick}
      style={{ '--door-spacing': `${doorSpacing}px` } as React.CSSProperties}
    >
      {/* Debug Overlay */}
      {showDebug && (
        <div className="debug-overlay">
          <div>INSTANCE: {String(instanceCount).padStart(3, '0')}</div>
          <div>CELL: {currentCell}</div>
          <div>STATUS: {isFarDoorUnlocked ? 'ACCESS GRANTED' : 'RESTRICTED'}</div>
        </div>
      )}

      <div 
        className={`corridor ${focusedDoor !== null ? 'corridor-focused' : ''}`}
        style={{ transform: `rotateY(${rotation}deg)` }}
      >
        {/* Walls */}
        <div className="wall wall-left" />
        <div className="wall wall-right" />
        <div className="wall wall-far">
          <div className={`door-frame far-frame ${focusedDoor === 0 && doorState !== 'corridor' ? 'focused-frame' : ''}`}>
             <div className="mb-4 text-center">
                <div className="text-xs text-zinc-500 uppercase tracking-widest">Instance</div>
                <div className={`text-3xl font-mono ${isFarDoorUnlocked ? 'text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'text-red-500'}`}>
                  {String(instanceCount).padStart(3, '0')}
                </div>
                <div className="mt-1 text-[10px] text-zinc-600 uppercase">
                  {isFarDoorUnlocked ? 'UNLOCKED' : 'LOCKED'}
                </div>
             </div>
             <div className="relative">
               {focusedDoor === 0 && doorState === 'focused' && (
                 <div className="prompt-overlay">CLICK TO ENTER</div>
               )}
               <Door 
                 number={0} 
                 position="far" 
                 onClick={() => handleDoorClick(0, 'far')} 
                 isLocked={!isFarDoorUnlocked} 
                 isUnlocked={isFarDoorUnlocked}
                 isFocused={focusedDoor === 0}
               />
             </div>
          </div>
        </div>

        {/* Left Wall Doors */}
        {leftDoors.map((num, index) => (
          <div 
            key={num} 
            className={`door-frame side-door-frame left-side ${focusedDoor === num ? 'focused-frame' : ''}`}
            style={{ '--door-index': index } as React.CSSProperties}
          >
            <Screen 
              position="left" 
              content={`CELL ${num}`} 
              metadata={num === 0 ? "Entry Matrix" : "Access Point"}
              interactive 
              onClick={() => handleDoorClick(num, 'left')} 
            />
            <div className="relative">
              {focusedDoor === num && doorState === 'focused' && (
                <div className="prompt-overlay">CLICK TO ENTER</div>
              )}
              <Door 
                number={num} 
                position="left" 
                onClick={() => handleDoorClick(num, 'left')} 
                isFocused={focusedDoor === num}
              />
            </div>
          </div>
        ))}

        {/* Right Wall Doors */}
        {rightDoors.map((num, index) => (
          <div 
            key={num} 
            className={`door-frame side-door-frame right-side ${focusedDoor === num ? 'focused-frame' : ''}`}
            style={{ '--door-index': index } as React.CSSProperties}
          >
            <Screen 
              position="left" 
              content={`CELL ${num}`} 
              metadata="Sub-Matrix"
              interactive 
              onClick={() => handleDoorClick(num, 'right')} 
            />
            <div className="relative">
              {focusedDoor === num && doorState === 'focused' && (
                <div className="prompt-overlay">CLICK TO ENTER</div>
              )}
              <Door 
                number={num} 
                position="right" 
                onClick={() => handleDoorClick(num, 'right')} 
                isFocused={focusedDoor === num}
              />
            </div>
          </div>
        ))}

        {/* Near Wall (behind us) */}
        <div className="wall wall-near">
          <div className={`door-frame near-frame ${focusedDoor === -1 ? 'focused-frame' : ''}`}>
            <Screen position="above" content="EXIT" />
            <Door number={0} position="near" onClick={() => handleDoorClick(-1, 'near')} isFocused={focusedDoor === -1} />
          </div>
        </div>
      </div>
    </div>
  );
};

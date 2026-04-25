import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Door } from './Door';
import { Screen } from './Screen';
import { useCorridorStore } from '../store/useCorridorStore';
import '../styles/corridor.css';

export const Corridor: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { instanceCount, currentCell, isFarDoorUnlocked, incrementInstance } = useCorridorStore();

  const showDebug = searchParams.get('debug') === 'true';

  // Side door logic
  const leftDoors = [0, 2, 4, 6, 8];
  const rightDoors = [1, 3, 5, 7, 9];

  // Sync state to URL
  useEffect(() => {
    const params: Record<string, string> = { cell: currentCell };
    if (showDebug) params.debug = 'true';
    setSearchParams(params);
  }, [currentCell, setSearchParams, showDebug]);

  const handleSideDoorClick = (num: number) => {
    console.log(`Entering Cell ${num} - Incrementing Instance`);
    incrementInstance();
  };

  const handleFarDoorClick = () => {
    if (isFarDoorUnlocked) {
      console.log('Proceeding to next MAGICUBE instance');
      incrementInstance();
    } else {
      console.log('Far door is LOCKED. Reach Instance 003.');
    }
  };

  const handleNearDoorClick = () => {
    console.log('Returning to previous corridor state (Simulation only)');
  };

  return (
    <div className="corridor-container" id="corridor-root">
      {/* Debug Overlay */}
      {showDebug && (
        <div className="debug-overlay">
          <div>INSTANCE: {String(instanceCount).padStart(3, '0')}</div>
          <div>CELL: {currentCell}</div>
          <div>STATUS: {isFarDoorUnlocked ? 'ACCESS GRANTED' : 'RESTRICTED'}</div>
        </div>
      )}

      <div className="corridor">
        {/* Left Wall */}
        <div className="wall wall-left">
          {leftDoors.map(num => (
            <div key={num} className="door-frame">
              <Screen 
                position="left" 
                content={`CELL ${num}`} 
                metadata={num === 0 ? "Entry Matrix" : "Access Point"}
                interactive 
                onClick={() => handleSideDoorClick(num)} 
              />
              <Door 
                number={num} 
                position="left" 
                onClick={() => handleSideDoorClick(num)} 
              />
            </div>
          ))}
        </div>

        {/* Right Wall */}
        <div className="wall wall-right">
          {rightDoors.map(num => (
            <div key={num} className="door-frame">
              <Screen 
                position="left" 
                content={`CELL ${num}`} 
                metadata="Sub-Matrix"
                interactive 
                onClick={() => handleSideDoorClick(num)} 
              />
              <Door 
                number={num} 
                position="right" 
                onClick={() => handleSideDoorClick(num)} 
              />
            </div>
          ))}
        </div>

        {/* Far Wall */}
        <div className="wall wall-far">
          <div className="door-frame">
             <div className="mb-4 text-center">
                <div className="text-xs text-zinc-500 uppercase tracking-widest">Instance</div>
                <div className={`text-3xl font-mono ${isFarDoorUnlocked ? 'text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'text-red-500'}`}>
                  {String(instanceCount).padStart(3, '0')}
                </div>
                <div className="mt-1 text-[10px] text-zinc-600 uppercase">
                  {isFarDoorUnlocked ? 'UNLOCKED' : 'LOCKED'}
                </div>
             </div>
             <Door 
               number={0} 
               position="far" 
               onClick={handleFarDoorClick} 
               isLocked={!isFarDoorUnlocked} 
               isUnlocked={isFarDoorUnlocked}
             />
          </div>
        </div>

        {/* Near Wall (behind us) */}
        <div className="wall wall-near">
          <div className="door-frame">
            <Screen position="above" content="EXIT" />
            <Door number={0} position="near" onClick={handleNearDoorClick} />
          </div>
        </div>
      </div>
    </div>
  );
};

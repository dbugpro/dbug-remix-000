import React from 'react';
import { Lock, Unlock } from 'lucide-react';

interface DoorProps {
  number: number;
  position: 'left' | 'right' | 'near' | 'far';
  onClick: () => void;
  isLocked?: boolean;
  isUnlocked?: boolean;
  isFocused?: boolean;
}

export const Door: React.FC<DoorProps> = ({
  number,
  position,
  onClick,
  isLocked = false,
  isUnlocked = false,
  isFocused = false
}) => {
  const doorClasses = [
    'door',
    `door-${position}`,
    isLocked ? 'door-locked' : '',
    isUnlocked ? 'door-unlocked' : '',
    isFocused ? 'door-focused' : ''
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={doorClasses}
      onClick={!isLocked ? onClick : undefined}
      id={`door-${position}-${number}`}
    >
      <div className="flex flex-col items-center gap-1">
        <span className="text-xl font-bold font-mono">{number}</span>
        {isLocked && <Lock className="w-3 h-3 text-red-500" />}
        {isUnlocked && <Unlock className="w-3 h-3 text-green-500" />}
      </div>
      
      {isUnlocked && (
        <div className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full m-1 animate-ping" />
      )}
    </div>
  );
};

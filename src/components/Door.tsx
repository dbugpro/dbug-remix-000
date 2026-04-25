import React from 'react';
import { Lock, Unlock } from 'lucide-react';

interface DoorProps {
  number: number;
  position: 'left' | 'right' | 'near' | 'far';
  onClick: (e: React.MouseEvent) => void;
  isLocked?: boolean;
  isUnlocked?: boolean;
  isFocused?: boolean;
  isOpened?: boolean;
}

export const Door: React.FC<DoorProps> = ({
  number,
  position,
  onClick,
  isLocked = false,
  isUnlocked = false,
  isFocused = false,
  isOpened = false
}) => {
  const doorClasses = [
    'door',
    `door-${position}`,
    isLocked ? 'door-locked' : '',
    isUnlocked ? 'door-unlocked' : '',
    isFocused ? 'door-focused' : '',
    isOpened ? 'door-opened' : ''
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={doorClasses}
      onClick={!isLocked ? onClick : undefined}
      id={`door-${position}-${number}`}
    >
      <div className="flex items-center justify-center w-full h-full">
        {isLocked && <Lock className="w-5 h-5 text-red-500/20" />}
        {isUnlocked && <Unlock className="w-5 h-5 text-blue-400" />}
      </div>
      
      {isUnlocked && (
        <div className="absolute bottom-2 right-2 w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
      )}
    </div>
  );
};

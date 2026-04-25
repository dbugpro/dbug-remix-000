import React from 'react';

interface ScreenProps {
  position: 'left' | 'above';
  content: string;
  metadata?: string;
  interactive?: boolean;
  onClick?: () => void;
}

export const Screen: React.FC<ScreenProps> = ({
  position,
  content,
  metadata,
  interactive = false,
  onClick
}) => {
  return (
    <div
      className={`screen screen-${position} ${interactive ? 'cursor-pointer' : ''} group relative`}
      onClick={interactive ? onClick : undefined}
      id={`screen-${position}-${content.replace(/\s+/g, '-').toLowerCase()}`}
    >
      <div className="flex flex-col items-center">
        <span className="font-bold">{content}</span>
        {metadata && (
          <span className="text-[8px] opacity-60 mt-1">{metadata}</span>
        )}
      </div>
      
      {interactive && (
        <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-[6px] text-green-400 font-bold tracking-tighter">CLICK TO ENTER</span>
        </div>
      )}
    </div>
  );
};

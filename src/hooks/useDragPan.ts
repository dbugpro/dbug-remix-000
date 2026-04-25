import { useState, useEffect, useCallback, useRef } from 'react';

export function useDragPan(maxRotation = 45) {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const currentRotationRef = useRef(0);

  const handleStart = useCallback((clientX: number) => {
    setIsDragging(true);
    startXRef.current = clientX;
    currentRotationRef.current = rotation;
  }, [rotation]);

  const handleMove = useCallback((clientX: number) => {
    if (!isDragging) return;
    const deltaX = clientX - startXRef.current;
    // Sensitivity adjustment: 0.1 degrees per pixel moved
    const moveRotation = currentRotationRef.current + (deltaX * 0.1);
    const clamped = Math.max(-maxRotation, Math.min(maxRotation, moveRotation));
    setRotation(clamped);
  }, [isDragging, maxRotation]);

  const handleEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const onMouseUp = () => handleEnd();
    const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);
    const onTouchEnd = () => handleEnd();

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchmove', onTouchMove, { passive: false });
      window.addEventListener('touchend', onTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [isDragging, handleMove, handleEnd]);

  return {
    rotation,
    setRotation,
    isDragging,
    handleStart
  };
}

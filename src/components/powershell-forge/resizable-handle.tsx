
'use client';

import React, { useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';

interface ResizableHandleProps {
  onResize: (deltaX: number) => void;
  onResizeEnd?: () => void;
}

export function ResizableHandle({ onResize, onResizeEnd }: ResizableHandleProps) {
  const handleRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0); // Corrected typo here
  const isDraggingRef = useRef(false);

  const handleMouseDown = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    isDraggingRef.current = true;
    startXRef.current = event.clientX;
    document.body.style.cursor = 'col-resize';
    document.body.classList.add('select-none');

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [onResize, onResizeEnd]); // handleMouseMove and handleMouseUp should be in dependencies if they aren't stable references, but they are defined via useCallback

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = event.clientX - startXRef.current;
    onResize(deltaX);
    startXRef.current = event.clientX; // Update startX for next delta calculation
  }, [onResize]);

  const handleMouseUp = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    document.body.style.cursor = '';
    document.body.classList.remove('select-none');

    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    if (onResizeEnd) {
      onResizeEnd();
    }
  }, [onResizeEnd, handleMouseMove]); // Added handleMouseMove as dependency as it's used

  return (
    <div
      ref={handleRef}
      className={cn(
        'hidden md:flex items-center justify-center w-2 cursor-col-resize group relative',
        'bg-background hover:bg-muted transition-colors duration-150'
      )}
      onMouseDown={handleMouseDown}
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize columns"
    >
      <div className="w-px h-full bg-border group-hover:bg-primary transition-colors duration-150" />
    </div>
  );
}

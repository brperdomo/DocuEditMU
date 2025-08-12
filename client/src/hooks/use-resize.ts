import { useState, useCallback, useEffect } from 'react';

export interface ResizeState {
  isResizing: boolean;
  initialPos: { x: number; y: number };
  initialSize: { width: number; height: number };
}

export function useResize(
  onResize: (size: { width: number; height: number }) => void,
  containerRef: React.RefObject<HTMLElement>
) {
  const [resizeState, setResizeState] = useState<ResizeState | null>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    setResizeState({
      isResizing: true,
      initialPos: { x: e.clientX, y: e.clientY },
      initialSize: { width: 0, height: 0 } // Will be set by the component
    });
  }, [containerRef]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!resizeState?.isResizing) return;

    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    const deltaX = e.clientX - resizeState.initialPos.x;
    const deltaY = e.clientY - resizeState.initialPos.y;
    
    // Convert pixel deltas to percentage deltas
    const widthDelta = (deltaX / containerRect.width) * 100;
    const heightDelta = (deltaY / containerRect.height) * 100;
    
    const newWidth = Math.max(5, resizeState.initialSize.width + widthDelta);
    const newHeight = Math.max(5, resizeState.initialSize.height + heightDelta);
    
    onResize({ width: newWidth, height: newHeight });
  }, [resizeState, containerRef, onResize]);

  const handleMouseUp = useCallback(() => {
    setResizeState(null);
  }, []);

  useEffect(() => {
    if (resizeState?.isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'nw-resize';
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = 'default';
      };
    }
  }, [resizeState?.isResizing, handleMouseMove, handleMouseUp]);

  return {
    handleMouseDown,
    isResizing: resizeState?.isResizing || false,
    setInitialSize: (size: { width: number; height: number }) => {
      if (resizeState) {
        setResizeState({ ...resizeState, initialSize: size });
      }
    }
  };
}
import React, { memo, useEffect, useRef } from 'react';

import { useCells, useScheduler } from '../providers';

/**
 * Drawing cells background component
 */
export const Background = memo(() => {
  const { helperWidthProp, headerHeightProp, baseZIndex, bottomHeightProp } =
    useScheduler();
  const { widthStep, heightStep, offsetHeight, offsetWidth } = useCells();

  /**
   * Canvas reference
   */
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /**
   * Context reference
   */
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  /**
   * Cells redrawing
   */
  useEffect(() => {
    const canvas = canvasRef?.current;
    if (!canvas) return;
    canvas.width = offsetWidth * 2;
    canvas.height = offsetHeight * 2;
    canvas.style.width = `${offsetWidth}px`;
    canvas.style.height = `${offsetHeight}px`;
    const context = canvas.getContext('2d');
    if (!context) return;

    context.scale(2, 2);
    contextRef.current = context;
    contextRef.current.beginPath();
    for (let x = helperWidthProp; x <= offsetWidth; x += widthStep) {
      contextRef.current.moveTo(x, 0);
      contextRef.current.lineTo(x, offsetHeight - bottomHeightProp);
    }
    contextRef.current.strokeStyle = 'rgba(0,0,0, 0.2)';
    contextRef.current.lineWidth = 1;
    contextRef.current.stroke();
    contextRef.current.beginPath();
    for (
      let y = headerHeightProp;
      y <= offsetHeight - bottomHeightProp;
      y += heightStep
    ) {
      contextRef.current.moveTo(helperWidthProp, y);
      contextRef.current.lineTo(offsetWidth, y);
    }
    contextRef.current.strokeStyle = 'rgba(0,0,0, 0.1)';
    contextRef.current.lineWidth = 1;
    contextRef.current.stroke();
    contextRef.current.save();
  }, [
    bottomHeightProp,
    headerHeightProp,
    heightStep,
    helperWidthProp,
    offsetHeight,
    offsetWidth,
    widthStep,
  ]);

  return (
    <canvas
      id={'backgroundCanvas'}
      className={'scheduler-background-canvas'}
      style={{
        position: 'absolute',
        zIndex: baseZIndex + 1,
      }}
      ref={canvasRef}
    />
  );
});

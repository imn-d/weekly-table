import React, { FC, useEffect } from 'react';

import {
  useCanvas,
  useCustomTime,
  usePointerLock,
  usePopup,
  useScheduler,
  useTimeBlock,
} from '../providers';

/**
 * Time blocks drawing area component
 */
export const SchedulerArea: FC = () => {
  const { baseZIndex } = useScheduler();
  const { startDrawing, finishDrawing, draw, canvasRef, isDrawing } =
    useCanvas();
  const { blocks } = useTimeBlock();
  const { hidePopup } = usePopup();
  const { isLocking } = usePointerLock();
  const { isEditing } = useCustomTime();

  /**
   * Automatically hides the popup if at the same time:
   * no draws new block
   * no uses pointer lock
   * no custom time setter is active
   */
  useEffect(() => {
    if (!isDrawing && !isLocking && !isEditing) {
      hidePopup();
    }
    //eslint-disable-next-line
  }, [isDrawing, blocks, isLocking, isEditing]);

  return (
    <canvas
      id={'schedulerArea'}
      className={'scheduler-area'}
      style={{
        position: 'absolute',
        zIndex: baseZIndex + 3,
        cursor: 'crosshair',
      }}
      onMouseDown={(event) => (isEditing ? null : startDrawing(event))}
      onMouseUp={finishDrawing}
      onMouseMove={draw}
      onMouseLeave={finishDrawing}
      ref={canvasRef}
    />
  );
};

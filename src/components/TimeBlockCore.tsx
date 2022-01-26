import React, { FC, useCallback, useMemo } from 'react';

import { HOUR_24, TimeBlock } from '../common';
import { useCanvas, useCustomTime, usePopup, useScheduler } from '../providers';

/**
 * Each time block represents by this component
 * @param block - [TimeBlock]{@link TimeBlock}
 */
export const TimeBlockCore: FC<TimeBlock> = ({ ...block }: TimeBlock) => {
  const { baseZIndex, blockColors } = useScheduler();
  const { isDrawing } = useCanvas();
  const { popup, showPopup, hidePopup } = usePopup();
  const { isEditing, handleObject } = useCustomTime();

  /**
   * Select blocks colors
   */
  const bgColor = useMemo<string>(() => {
    if (popup?.id === block.id) return blockColors.hover;
    if (block.isTemp) return blockColors.temp;
    if (isDrawing) return blockColors.draw;
    return blockColors.common;
  }, [
    block.id,
    block.isTemp,
    blockColors.common,
    blockColors.draw,
    blockColors.hover,
    blockColors.temp,
    isDrawing,
    popup?.id,
  ]);

  /**
   * Calling when time block is hovering, popup and custom time components setter
   */
  const handleShowActions = useCallback(() => {
    if (isEditing) return null;
    showPopup(block.id);
    handleObject(block);
    //eslint-disable-next-line
  }, [block, isEditing]);

  /**
   * Showing endTime as 24:00 instead of 00:00
   */
  const endTime = useMemo<string>(() => {
    if (block.endTime === HOUR_24) return '24:00';
    return new Date(block.endTime).toISOString().substr(11, 5);
  }, [block.endTime]);

  return (
    <div
      id={'timeBlock'}
      className={'scheduler-time-block'}
      style={{
        zIndex: isDrawing ? baseZIndex : baseZIndex + 4,
        position: 'absolute',
        top: block.top,
        left: block.left,
        width: block.width,
        height: block.height,
        backgroundColor: bgColor,
      }}
      onMouseEnter={handleShowActions}
      onMouseMove={handleShowActions}
      onMouseLeave={() => (!isEditing ? hidePopup() : null)}
    >
      <span
        id={'timeDisplay'}
        className={'scheduler-text scheduler-time-display'}
        style={{
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        {new Date(block.startTime).toISOString().substr(11, 5) +
          ' / ' +
          endTime}
      </span>
    </div>
  );
};

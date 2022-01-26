import React, { FC, useMemo } from 'react';

import { useCells, useScheduler } from '../providers';

/**
 *  Time description component (first column)
 */
export const SchedulerHelper: FC = () => {
  const { helperWidthProp, rows, headerHeightProp, bottomHeightProp } =
    useScheduler();
  const { offsetHeight } = useCells();

  /**
   * Calculates height for time descriptions assignment
   */
  const helperHeight = useMemo(() => {
    return (offsetHeight - headerHeightProp - bottomHeightProp) / rows?.length;
  }, [bottomHeightProp, headerHeightProp, offsetHeight, rows?.length]);

  return (
    <div
      id={'schedulerHelper'}
      className={'scheduler-helper'}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        position: 'relative',
        width: `${helperWidthProp}px`,
        maxWidth: `${helperWidthProp}px`,
        userSelect: 'none',
      }}
    >
      {rows?.map((row, index) => {
        return (
          <div
            id={'schedulerHelperRow'}
            className={'scheduler-text scheduler-helper-row'}
            key={index}
            style={{
              display: 'inline-flex',
              minHeight: `${helperHeight}px`,
              height: `${helperHeight}px`,
            }}
          >
            {row}
          </div>
        );
      })}
    </div>
  );
};

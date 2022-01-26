import React, { FC } from 'react';

import { useCells, useScheduler } from '../providers';

/**
 *  Days of week component (columns)
 */
export const SchedulerHeader: FC = () => {
  const { widthStep } = useCells();
  const { headerHeightProp, columns } = useScheduler();
  return (
    <div
      id={'schedulerHeader'}
      className={'scheduler-header'}
      style={{
        position: 'relative',
        userSelect: 'none',
        display: 'inline-flex',
        height: `${headerHeightProp}px`,
        maxHeight: `${headerHeightProp}px`,
      }}
    >
      {columns?.map((col) => {
        return (
          <div
            id={'schedulerHeaderColumn'}
            className={'scheduler-text scheduler-header-column'}
            style={{
              display: 'inline-flex',
              minWidth: `${widthStep}px`,
              width: `${widthStep}px`,
            }}
            key={col.weight}
          >
            {col.full}
          </div>
        );
      })}
    </div>
  );
};

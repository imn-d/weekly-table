import React, { FC } from 'react';

import { useCells, useScheduler, useTimeBlock } from '../providers';
import {
  SchedulerArea,
  SchedulerHeader,
  SchedulerHelper,
  TimeBlockCore,
} from './index';

/**
 * Columns description, rows and drawing area layout component
 */
export const SchedulerLayout: FC = () => {
  const { headerHeightProp, helperWidthProp, bottomHeightProp, baseZIndex } =
    useScheduler();
  const { offsetWidth, offsetHeight } = useCells();
  const { blocks, preview } = useTimeBlock();

  return (
    <div
      id={'schedulerLayout'}
      className={'scheduler-layout'}
      style={{
        position: 'absolute',
        display: 'grid',
        gridTemplateColumns: `${helperWidthProp}px ${
          offsetWidth - helperWidthProp
        }px`,
        gridTemplateRows: `${headerHeightProp}px ${
          offsetHeight - headerHeightProp - bottomHeightProp
        }px ${bottomHeightProp}px`,
        width: offsetWidth,
        maxWidth: offsetWidth,
        height: offsetHeight,
        maxHeight: offsetHeight,
        zIndex: baseZIndex + 2,
      }}
    >
      {blocks?.map((block) => (
        <TimeBlockCore key={block.id} {...block} />
      ))}
      {preview?.map((block) => (
        <TimeBlockCore key={block.id} {...block} />
      ))}
      <div style={{ position: 'relative' }} />
      <SchedulerHeader />
      <SchedulerHelper />
      <SchedulerArea />
    </div>
  );
};

import React, { FC } from 'react';

import { TIME } from '../common';
import { useCells, useCustomTime, useScheduler } from '../providers';

/**
 * Custom time setter component
 */
export const CustomTime: FC = () => {
  const { baseZIndex } = useScheduler();
  const { widthStep } = useCells();
  const { isEditing, position, displayTime, handleTime, isError } =
    useCustomTime();

  return (
    <div
      id={'customTimeWrapper'}
      className={'scheduler-text custom-time-wrapper'}
      style={{
        display: isEditing ? 'flex' : 'none',
        zIndex: baseZIndex + 6,
        position: 'absolute',
        flexDirection: 'column',
        top: position?.top,
        left: position?.left,
        width: widthStep ? widthStep * 0.75 : 0,
        maxWidth: widthStep ? widthStep * 0.75 : 0,
      }}
    >
      {isError ? (
        <span
          id={'customTimeError'}
          className={'custom-time-error'}
          style={{
            position: 'absolute',
            top: 55,
            width: widthStep,
          }}
        >
          {isError}
        </span>
      ) : (
        <></>
      )}
      <input
        id={'customTimeInputStart'}
        className={'custom-time-input custom-time-input-start'}
        style={{
          width: widthStep ? widthStep * 0.75 : 0,
          maxWidth: widthStep ? widthStep * 0.75 : 0,
        }}
        type={'time'}
        value={displayTime.startTime}
        step={1}
        onChange={(event) =>
          handleTime(event?.target?.valueAsNumber, TIME.START)
        }
      />
      <input
        id={'customTimeInputEnd'}
        className={'custom-time-input custom-time-input-end'}
        style={{
          width: widthStep ? widthStep * 0.75 : 0,
          maxWidth: widthStep ? widthStep * 0.75 : 0,
        }}
        type={'time'}
        value={displayTime.endTime}
        step={1}
        onChange={(event) => handleTime(event?.target?.valueAsNumber, TIME.END)}
      />
    </div>
  );
};

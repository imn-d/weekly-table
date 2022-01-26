import React, { memo } from 'react';

export const CancelIcon = memo(() => {
  return (
    <svg
      id={'cancelIcon'}
      className={'scheduler-icon cancel-icon'}
      xmlns='http://www.w3.org/2000/svg'
      x='0px'
      y='0px'
      width='24'
      height='24'
      viewBox='0 0 64 64'
    >
      <path d='M 12 8 L 8 12 L 24.666016 32 L 8 52 L 12 56 L 32 39.333984 L 52 56 L 56 52 L 39.333984 32 L 56 12 L 52 8 L 32 24.666016 L 12 8 z' />
    </svg>
  );
});

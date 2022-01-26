import React, { memo } from 'react';

export const CheckIcon = memo(() => {
  return (
    <svg
      id={'checkIcon'}
      className={'scheduler-icon check-icon'}
      xmlns='http://www.w3.org/2000/svg'
      x='0px'
      y='0px'
      width='24'
      height='24'
      viewBox='0 0 64 64'
    >
      <path d='M27 55L6 33 9 29 26 41 55 12 59 16z' />
    </svg>
  );
});

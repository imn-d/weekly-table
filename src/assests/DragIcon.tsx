import React, { memo } from 'react';

export const DragIcon = memo(() => {
  return (
    <svg
      id={'dragIcon'}
      className={'scheduler-icon drag-icon'}
      xmlns='http://www.w3.org/2000/svg'
      x='0px'
      y='0px'
      width={25}
      height={25}
      viewBox='0 0 25 25'
    >
      <path d='M20 9H4v2h16V9zM4 15h16v-2H4v2z' />
    </svg>
  );
});

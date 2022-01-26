import React, { FC } from 'react';

import {
  CancelIcon,
  CheckIcon,
  DeleteIcon,
  DragIcon,
  EditIcon,
} from '../assests';
import { ACTION } from '../common';
import {
  useCanvas,
  useCells,
  useCustomTime,
  usePointerLock,
  usePopup,
  useScheduler,
  useTimeBlock,
} from '../providers';

/**
 * Time block hovering popup component
 * Always displaying above time block component
 */
export const Popup: FC = () => {
  const { baseZIndex } = useScheduler();
  const { widthStep, heightStep } = useCells();
  const { setTopPosition, setBotPosition } = useTimeBlock();
  const { popup, showPopup, hidePopup, deleteBlock, isAllowing } = usePopup();
  const { isEditing, setEditing, updateBlock, resetTime } = useCustomTime();
  const {
    moveRef,
    resBotRef,
    resTopRef,
    startDrawing,
    finishDrawing,
    draw,
    isLocking,
  } = usePointerLock();
  const { isDrawing } = useCanvas();

  /**
   * No hover - no rendering
   */
  if (!popup) return null;

  return (
    <div
      id={'popupWrapper'}
      className={'scheduler-popup-wrapper'}
      style={{
        zIndex: isDrawing ? baseZIndex + 2 : baseZIndex + 5,
        position: 'absolute',
        top: popup.block.top - 35,
        left: popup.block.left - 15,
        boxSizing: 'border-box',
        display: 'grid',
        gridTemplateColumns: `${15}px ${widthStep * 0.75}px ${30}px`,
        gridTemplateRows: `${33}px ${
          popup.block.height < heightStep ? heightStep : popup.block.height + 3
        }px ${33}px `,
        width: widthStep * 0.75 + 45,
        maxWidth: widthStep * 0.75 + 45,
      }}
      onMouseEnter={() => showPopup(popup.id)}
      onMouseMove={() => (isLocking ? showPopup(popup.id) : null)}
      onMouseLeave={() => {
        if (!isEditing) {
          hidePopup();
          finishDrawing();
        }
        return null;
      }}
    >
      <div
        style={{
          gridColumn: ' 1',
          gridRow: '1 / 4',
        }}
      />
      <div
        id={'popupTop'}
        className={'scheduler-popup scheduler-popup-top'}
        style={{
          gridColumn: '2',
          gridRow: '1',
          display: isEditing || !isAllowing ? 'none' : 'flex',
          cursor: 'n-resize',
          justifyContent: 'center',
          alignItems: 'self-end',
        }}
        ref={resTopRef}
        onMouseMove={draw}
        onMouseDown={() => startDrawing(ACTION.RESIZE_TOP)}
        onMouseUp={() => {
          finishDrawing();
          setTopPosition(popup.block, true);
        }}
      >
        <DragIcon />
      </div>

      <div
        id={'popupRight'}
        className={'scheduler-popup scheduler-popup-right'}
        style={{
          gridColumn: ' 3',
          gridRow: '1 / 4',
          display: isLocking ? 'none' : 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: isEditing ? 'center' : 'space-around',
        }}
      >
        {isEditing ? (
          <div
            id={'popupCheckIcon'}
            className={'popup-check-icon'}
            style={{ cursor: 'pointer' }}
            onClick={() => setEditing(updateBlock())}
          >
            <CheckIcon />
          </div>
        ) : (
          <></>
        )}

        <div
          id={'popupCEIcon'}
          className={'popup-cancel-edit-icon'}
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setEditing((edit) => !edit);
            resetTime();
          }}
        >
          {isEditing ? <CancelIcon /> : <EditIcon />}
        </div>
        <div
          id={'popupDeleteIcon'}
          className={'popup-delete-icon'}
          style={{
            cursor: 'pointer',
            display: isEditing ? 'none' : 'block',
          }}
          onClick={() => deleteBlock(popup.id)}
        >
          <DeleteIcon />
        </div>
      </div>

      <div
        id={'popupCenter'}
        className={'scheduler-popup scheduler-popup-center'}
        style={{
          gridColumn: '2',
          gridRow: '2',
          cursor: 'grab',
          display: isEditing || !isAllowing ? 'none' : 'block',
        }}
        ref={moveRef}
        onMouseMove={draw}
        onMouseDown={() => startDrawing(ACTION.MOVE)}
        onMouseUp={() => {
          finishDrawing();
          setTopPosition(popup.block, false);
        }}
      />

      <div
        id={'popupBot'}
        className={'scheduler-popup scheduler-popup-bot'}
        style={{
          gridColumn: '2',
          gridRow: '3',
          cursor: 'n-resize',
          display: isEditing || !isAllowing ? 'none' : 'flex',
          justifyContent: 'center',
          alignItems: 'self-start',
        }}
        ref={resBotRef}
        onMouseMove={draw}
        onMouseDown={() => startDrawing(ACTION.RESIZE_BOT)}
        onMouseUp={() => {
          finishDrawing();
          setBotPosition(popup.block);
        }}
      >
        <DragIcon />
      </div>
    </div>
  );
};

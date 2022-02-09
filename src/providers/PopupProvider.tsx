import React, {
  FC,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  ACTION,
  DIR,
  HOUR_24,
  PopupProps,
  PopupType,
  TimeBlock,
} from '../common';
import { useCells } from './CellsProvider';
import { usePointerLock } from './PointerLockProvider';
import { useScheduler } from './Scheduler';
import { useTimeBlock } from './TimeBlockProvider';

const PopupContext = createContext<PopupProps>({} as PopupProps);

/**
 *  Popup provider context hook
 *  @returns [PopupProps]{@link PopupProps}
 */
export const usePopup = (): PopupProps => useContext(PopupContext);

/**
 * Popup provider, operates most timeblock actions
 */
const PopupProvider: FC = ({ children }) => {
  const { blocks, setBlocks, handleHistory, undoHistory } = useTimeBlock();
  const { millisPerPixel, msTime } = useCells();
  const { isLocking, movement, action } = usePointerLock();
  const { mouseSpeed } = useScheduler();
  /**
   * Popup state, component have only one popup
   */
  const [popup, setPopup] = useState<PopupType | undefined>(undefined);

  /**
   * Hotkeys state
   */
  const [keyRequest, setKeyRequest] = useState({ code: '', ctrl: false });

  /**
   * Hotkeys event listeners
   */
  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('keydown', handleKey);
    };
    //eslint-disable-next-line
  }, []);

  /**
   * Hotkeys actions handler
   */
  const handleKey = useCallback((event: KeyboardEvent) => {
    if (event.code) {
      setKeyRequest({ code: event.code, ctrl: event.ctrlKey });
    }
  }, []);

  /**
   * Hotkeys actions
   */
  useEffect(() => {
    if (keyRequest.code === 'Delete' || keyRequest.code === 'Backspace') {
      if (popup?.id) {
        deleteBlock(popup.id);
      }
      setKeyRequest({ code: '', ctrl: false });
      return;
    }
    if (keyRequest.code === 'KeyZ' && keyRequest.ctrl) {
      undoHistory();
      setKeyRequest({ code: '', ctrl: false });
    }
    //eslint-disable-next-line
  }, [keyRequest.code, keyRequest.ctrl, popup?.id]);

  /**
   * Popup rendering over timeblock
   */
  const showPopup = useCallback(
    (blockId: string) => {
      const block = blocks.find((b) => b.id === blockId);
      if (!block) return;
      setPopup({
        id: block.id,
        block: block,
      });
    },
    [blocks],
  );

  /**
   * Popup hiding eq removing
   */
  const hidePopup = useCallback(() => {
    setPopup(undefined);
  }, []);

  /**
   * isAllowing timerange state
   * Timeblock will stopping actions if it less than timeframe
   * Don't affecting to custom time setting
   */
  const isAllowing = useMemo<boolean>(() => {
    if (!popup?.block) return true;
    return popup.block.endTime - popup.block.startTime >= msTime;
  }, [msTime, popup?.block]);

  /**
   * Block remover
   */
  const deleteBlock = useCallback(
    (blockId: string) => {
      setBlocks([...blocks].filter((b) => b.id !== blockId));
      handleHistory([...blocks].filter((b) => b.id !== blockId));
      setPopup(undefined);
    },
    //eslint-disable-next-line
    [blocks],
  );

  /**
   * Move handler - moving block with mouse pressed
   * Hidden realTime field used
   * Rounding visible time every timeframe
   */
  const handleMove = useCallback(
    (block: TimeBlock, movementY: number) => {
      const oldTop = block.top;
      const newTop = oldTop + movementY * mouseSpeed;

      const newBlocks = [...blocks].filter((b) => b.id !== block.id);
      const dateDiff = (newTop - oldTop) * millisPerPixel;
      const newStart = block.realStartTime + dateDiff;
      const newEnd = block.realEndTime + dateDiff;
      if (
        newStart < -msTime / 3 ||
        newEnd > HOUR_24 + msTime / 3 ||
        newEnd - newStart < msTime
      ) {
        return;
      }

      const roundedStart = Math.abs(
        Math.round(block.realStartTime / msTime) * msTime,
      );
      const roundedEnd = Math.round(block.realEndTime / msTime) * msTime;

      const movedBlock = {
        ...block,
        startTime: roundedStart,
        endTime: roundedEnd,
        realStartTime: newStart,
        realEndTime: newEnd,
        top: newTop,
      };
      setBlocks(newBlocks.concat(movedBlock));
    },
    [mouseSpeed, blocks, millisPerPixel, msTime],
  );

  /**
   * Resize handler - resizing block with mouse pressed
   * Hidden realTime field used
   * Rounding visible time every timeframe
   */
  const handleResize = useCallback(
    (block: TimeBlock, movementY: number, dir: boolean) => {
      const newBlocks = blocks.filter((b) => b.id !== block.id);
      if (dir === DIR.TOP) {
        const oldTop = block.top;
        const newTop = oldTop + movementY * mouseSpeed;
        const dateDiff = (newTop - oldTop) * millisPerPixel;
        const newStart = block.realStartTime + dateDiff;

        if (newStart < -msTime / 3) return;
        if (block.realEndTime - newStart < msTime) return;

        const roundedStart = Math.abs(
          Math.round(block.realStartTime / msTime) * msTime,
        );

        const movedBlock = {
          ...block,
          startTime: roundedStart,
          realStartTime: newStart,
          top: newTop,
          height: block.height + oldTop - newTop,
        };
        setBlocks(newBlocks.concat(movedBlock));
        return;
      }

      if (dir === DIR.BOTTOM) {
        const oldBot = block.height;
        const newBot = oldBot + movementY * mouseSpeed;
        const dateDiff = (newBot - oldBot) * millisPerPixel;

        const newEnd = block.realEndTime + dateDiff;
        if (newEnd > HOUR_24 + msTime / 3) return;
        if (newEnd - block.realStartTime < msTime) return;

        let roundedEnd = Math.round(block.realEndTime / msTime) * msTime;
        if (roundedEnd > HOUR_24) roundedEnd = HOUR_24;

        const movedBlock = {
          ...block,
          endTime: roundedEnd,
          realEndTime: newEnd,
          height: newBot,
        };
        setBlocks(newBlocks.concat(movedBlock));
      }
    },
    [blocks, millisPerPixel, mouseSpeed, msTime],
  );

  /**
   * mouseevents router when timeblock actions
   */
  useEffect(() => {
    if (isLocking && popup?.block && movement !== 0) {
      switch (action) {
        case ACTION.MOVE: {
          handleMove(popup.block, movement);
          return;
        }
        case ACTION.RESIZE_TOP: {
          handleResize(popup.block, movement, DIR.TOP);
          return;
        }
        case ACTION.RESIZE_BOT: {
          handleResize(popup.block, movement, DIR.BOTTOM);
          return;
        }
        default:
          return;
      }
    }
  }, [action, isLocking, movement, popup?.block]);

  return (
    <PopupContext.Provider
      value={{
        isAllowing,
        popup,
        hidePopup,
        deleteBlock,
        showPopup,
      }}
    >
      {children}
    </PopupContext.Provider>
  );
};

export default PopupProvider;

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
  Cell,
  ScheduleGroup,
  Time,
  TimeBlock,
  TimeBlockProps,
} from '../common';
import {
  inputOffset,
  inputParser,
  outputMerger,
  outputOffset,
  random,
} from '../utils';
import { useCanvas } from './CanvasProvider';
import { useCells } from './CellsProvider';
import { usePointerLock } from './PointerLockProvider';
import { useScheduler } from './Scheduler';

const TimeBlockContext = createContext<TimeBlockProps>({} as TimeBlockProps);

/**
 *  Timeblock provider context hook
 *  @returns [TimeBlockProps]{@link TimeBlockProps}
 */
export const useTimeBlock = (): TimeBlockProps => useContext(TimeBlockContext);

/**
 * Timeblock provider, keeps all timeblocks and main action with it
 */
const TimeBlockProvider: FC = ({ children }) => {
  const {
    columns,
    defaultValue,
    onChange,
    helperWidthProp,
    headerHeightProp,
    requiredTZOffset,
  } = useScheduler();
  const { cells, setCells, widthStep, msTime, maxCellIndex, millisPerPixel } =
    useCells();
  const { isDrawing } = useCanvas();
  const { isLocking } = usePointerLock();

  /**
   * Browser timezone offset in ms
   */
  const browserOffset = useMemo(() => {
    return new Date().getTimezoneOffset() * 60 * 1000;
  }, []);

  /**
   * Working offset state
   */
  const [tzOffset, setTZOffset] = useState<number>(browserOffset);

  /**
   * Primary timeblocks state
   */
  const [blocks, setBlocks] = useState<TimeBlock[]>([]);

  /**
   * Temporary (preview) timeblocks state
   */
  const [preview, setPreview] = useState<TimeBlock[]>([]);

  /**
   * History state
   */
  const [history, setHistory] = useState<TimeBlock[][]>([]);

  /**
   * History writer
   */
  const handleHistory = useCallback(
    (input: TimeBlock[]) => {
      setHistory(history.concat([input]));
    },
    [history],
  );

  /**
   * History rollback
   */
  const undoHistory = useCallback(() => {
    if (history.length < 2) {
      return;
    }
    setBlocks(history[history.length - 2]);
    setHistory([...history.slice(0, history.length - 1)]);
  }, [history]);

  /**
   * Selecting between browser timezone and required timezone
   * This is global-primary-important component value
   */
  useEffect(() => {
    if (!requiredTZOffset && requiredTZOffset !== 0) {
      setTZOffset(browserOffset);
      return;
    }
    setTZOffset(requiredTZOffset);
  }, [browserOffset, requiredTZOffset]);

  /**
   * Moves timeblock to the nearest top cell after stopped move or resize it
   */
  const setTopPosition = useCallback(
    (block: TimeBlock, withHeight: boolean) => {
      if (block.endTime - block.startTime < msTime) return;
      const newBlocks = blocks.filter((b) => b.id !== block.id);
      let startRow = Math.abs(Math.round(block.startTime / msTime));
      if (startRow < 0) startRow = 0;
      const needCells = cells.filter((cell: Cell) => cell.row === startRow)[0];

      let position = needCells?.position?.y;
      if (!position) {
        const maxRow = cells[maxCellIndex];
        position = maxRow.position.h;
      }

      const movedBlock = {
        ...block,
        realStartTime: block.startTime,
        realEndTime: block.endTime,
        top: position,
        height: withHeight
          ? block.height - (position - block.top)
          : block.height,
      };
      setBlocks(newBlocks.concat(movedBlock));
      handleHistory(newBlocks.concat(movedBlock));
    },
    //eslint-disable-next-line
    [blocks, msTime, cells, maxCellIndex],
  );

  /**
   * Moves timeblock to the nearest bottom cell after stopped move or resize it
   */
  const setBotPosition = useCallback(
    (block: TimeBlock) => {
      if (block.endTime - block.startTime < msTime) return;
      const newBlocks = blocks.filter((b) => b.id !== block.id);

      const endRow = Math.abs(Math.round(block.endTime / msTime));
      const needCells = cells.find((cell) => cell.row === endRow);
      let position = needCells?.position?.y;

      if (!position) {
        const maxRow = cells[maxCellIndex];
        position = maxRow.position.h;
      }

      const movedBlock = {
        ...block,
        realStartTime: block.startTime,
        realEndTime: block.endTime,
        height: position - block.top,
      };
      setBlocks(newBlocks.concat(movedBlock));
      handleHistory(newBlocks.concat(movedBlock));
    },
    //eslint-disable-next-line
    [blocks, cells, maxCellIndex, msTime],
  );

  /**
   * Block-merger - crossed blocks merge
   */
  useEffect(() => {
    if (isDrawing || isLocking) return;
    if (blocks.length < 2) return;
    const columns = [...new Set(blocks.map((cb) => cb.column))];
    columns.forEach((col) => {
      const timeBlocksInColumn = blocks.filter((cb) => cb.column === col);
      if (timeBlocksInColumn.length < 2) return;

      const sortedBlocks = timeBlocksInColumn.sort((prev, cur) => {
        if (prev.top <= cur.top) return -1;
        return 1;
      });

      for (let i = 0; i < sortedBlocks.length - 1; i++) {
        const current = sortedBlocks[i];
        const next = sortedBlocks[i + 1];
        const cEnd = current.top + current.height;
        const nEnd = next.top + next.height;

        const newSetBlocks = blocks.filter(
          (cb) => cb.id !== current.id && cb.id !== next.id,
        );
        if (cEnd <= nEnd + 1 && cEnd >= next.top - 1) {
          const object = {
            id: random(),
            startTime: current.startTime,
            endTime: next.endTime,
            width: current.width,
            height: next.top - current.top + next.height,
            top: current.top,
            left: current.left,
            column: col,
            isTemp: false,
            realStartTime: current.startTime,
            realEndTime: next.endTime,
          } as TimeBlock;
          setBlocks(newSetBlocks.concat(object));
          break;
        }
        if (next.top <= cEnd && next.top >= current.top) {
          const object = {
            ...current,
            id: random(),
          } as TimeBlock;
          setBlocks(newSetBlocks.concat(object));
          break;
        }
      }
    });
  }, [blocks, isDrawing, isLocking]);

  /**
   * Block-builder - visualize timeblock from selected cells
   */
  useEffect(() => {
    if (!cells) return;
    const selectedCells = cells.filter((cell: Cell) => cell.isSelected);
    if (selectedCells.length === 0) return;
    const columns = [...new Set(selectedCells.map((cell) => cell.column))];

    const newBlocks = columns.map((column) => {
      const rows = selectedCells.filter((cell) => cell.column === column);
      const startRow = rows[0];
      const endRow = rows[rows.length - 1];

      const timeFrameStart = startRow.row * msTime;
      const timeFrameEnd = (endRow.row + 1) * msTime;

      return {
        id: random(),
        startTime: timeFrameStart,
        endTime: timeFrameEnd,
        width: widthStep * 0.75,
        height: endRow.position.h - startRow.position.y,
        top: startRow.position.y,
        left: startRow.position.x + 5,
        column: column,
        isTemp: isDrawing,
        realStartTime: timeFrameStart,
        realEndTime: timeFrameEnd,
      } as TimeBlock;
    });

    if (!isDrawing) {
      setBlocks(blocks.concat(newBlocks));
      handleHistory(blocks.concat(newBlocks));
      setPreview([]);
    } else {
      setPreview(blocks.concat(newBlocks));
    }

    setCells(cells.map((cell) => ({ ...cell, isSelected: false })));
  }, [blocks, cells, isDrawing, preview, msTime, widthStep]);

  /**
   * Input-offseter - sets input schedule groups to required timezone
   */
  useEffect(() => {
    if (!defaultValue || !widthStep || !helperWidthProp) return;
    const correctedBlocks = inputOffset(
      inputParser(defaultValue, columns.length, tzOffset),
      columns.length,
    );

    const newBlocks = correctedBlocks.map(
      (ib) =>
        ({
          ...ib,
          id: random(),
          realStartTime: ib.startTime,
          realEndTime: ib.endTime,
          top: ib.startTime / millisPerPixel + headerHeightProp,
          left: widthStep * ib.column + 5 + helperWidthProp,
          width: widthStep * 0.75,
          height: (ib.endTime - ib.startTime) / millisPerPixel,
          isTemp: false,
        } as TimeBlock),
    );
    setBlocks(newBlocks);
    handleHistory(newBlocks);
  }, [
    columns?.length,
    defaultValue,
    headerHeightProp,
    helperWidthProp,
    millisPerPixel,
    tzOffset,
    widthStep,
  ]);

  /**
   * Output-offseter - sets output schedule groups to UTC+0 timezone
   */
  useEffect(() => {
    if (!onChange || isLocking) return;

    const mergedBlocks = outputMerger(
      outputOffset(blocks, tzOffset, columns),
      columns,
    );

    const unique = new Array<Time>();
    mergedBlocks.forEach((b) => {
      const find = unique.find(
        (u) => u.startTime === b.startTime && u.endTime === b.endTime,
      );
      if (find) return;
      unique.push({ startTime: b.startTime, endTime: b.endTime } as Time);
    });

    const shGroup = unique.map((u) => {
      const group = mergedBlocks.filter(
        (b) => b.startTime === u.startTime && b.endTime === u.endTime,
      );
      const mask = group.reduce((acc, m) => acc + m.column, 0);
      return {
        startTime: u.startTime,
        endTime: u.endTime,
        mask: mask,
      } as ScheduleGroup;
    });

    onChange(shGroup);
  }, [blocks, columns, isLocking, tzOffset]);

  return (
    <TimeBlockContext.Provider
      value={{
        undoHistory,
        blocks,
        setTopPosition,
        preview,
        setBotPosition,
        setBlocks,
        handleHistory,
      }}
    >
      {children}
    </TimeBlockContext.Provider>
  );
};

export default TimeBlockProvider;

import React, {
  FC,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { CanvasProps } from '../common';
import { useCells } from './CellsProvider';
import { useScheduler } from './Scheduler';

const CanvasContext = createContext<CanvasProps>({} as CanvasProps);
/**
 *  Drawer provider context hook
 *  @returns [CanvasProps]{@link CanvasProps}
 */
export const useCanvas = (): CanvasProps => useContext(CanvasContext);

/**
 * Drawing provider, used for timeblocks creation
 */
const CanvasProvider: FC = ({ children }) => {
  const { headerHeightProp, helperWidthProp, bottomHeightProp } =
    useScheduler();
  const { offsetWidth, offsetHeight, cells, setCells } = useCells();

  /**
   *  Drawing state
   */
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  /**
   * Canvas reference
   */
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /**
   * Context reference
   */
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  /**
   * Start point relative coordinates
   */
  const [start, setStart] = useState<[number, number]>([0, 0]);

  /**
   * End point relative coordinates
   */
  const [end, setEnd] = useState<[number, number] | undefined>(undefined);

  /**
   * Current position relative coordinates
   */
  const [current, setCurrent] = useState<[number, number] | undefined>(
    undefined,
  );

  /**
   * Drawing area init
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = offsetWidth * 2;
    canvas.height = offsetHeight * 2;
    canvas.style.width = `${offsetWidth}px`;
    canvas.style.height = `${offsetHeight}px`;
    canvas.draggable = false;

    const context = canvas.getContext('2d');
    if (!context) return;
    context.scale(2, 2);
    context.lineCap = 'round';
    context.strokeStyle = 'blue';
    context.lineWidth = 1;
    context.fillStyle = '#0000FF19';
    contextRef.current = context;
  }, [offsetHeight, offsetWidth]);

  /**
   * Start drawing callback
   */
  const startDrawing = useCallback(({ nativeEvent }: React.MouseEvent) => {
    const { offsetX, offsetY } = nativeEvent;
    if (!contextRef.current) return;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
    setStart([offsetX, offsetY]);
    setEnd(undefined);
  }, []);

  /**
   * Clearing canvas callback
   */
  const clearCanvas = useCallback(() => {
    if (!contextRef.current) {
      return;
    }
    contextRef.current.clearRect(0, 0, offsetWidth, offsetHeight);
  }, [offsetHeight, offsetWidth]);

  /**
   * End drawing callback
   */
  const finishDrawing = useCallback(
    ({ nativeEvent }: React.MouseEvent) => {
      if (!contextRef.current) return;
      if (!isDrawing) return;

      contextRef.current.closePath();
      setIsDrawing(false);
      setEnd([nativeEvent.offsetX, nativeEvent.offsetY]);
      setCurrent(undefined);
      clearCanvas();
    },
    //eslint-disable-next-line
    [isDrawing],
  );

  /**
   * Drawing process callback
   */
  const draw = useCallback(
    ({ nativeEvent }: React.MouseEvent) => {
      if (!isDrawing || !contextRef.current) {
        return;
      }
      setCurrent([nativeEvent.offsetX, nativeEvent.offsetY]);
      contextRef.current.clearRect(0, 0, offsetWidth, offsetHeight);
      contextRef.current.strokeRect(
        start[0],
        start[1],
        nativeEvent.offsetX - start[0],
        nativeEvent.offsetY - start[1],
      );
      contextRef.current.fillRect(
        start[0] + 1,
        start[1] + 1,
        nativeEvent.offsetX - start[0] - 1,
        nativeEvent.offsetY - start[1] - 1,
      );
    },
    [isDrawing, offsetHeight, offsetWidth, start],
  );

  /**
   * Finding cell index by coordinates
   */
  const findCell = useCallback(
    (position: [number, number] | undefined): number => {
      if (!position || !cells) return -1;
      if (position[0] >= offsetWidth - 5) position[0] = offsetWidth - 5;
      if (position[0] <= helperWidthProp) position[0] = helperWidthProp;
      if (position[1] <= headerHeightProp) position[1] = headerHeightProp;
      if (position[1] >= offsetHeight - bottomHeightProp)
        position[1] = offsetHeight - bottomHeightProp - 1;

      return cells.findIndex(
        (cell) =>
          cell.position.x <= position[0] &&
          position[0] <= cell.position.w &&
          cell.position.y <= position[1] &&
          position[1] <= cell.position.h,
      );
    },
    [
      offsetWidth,
      cells,
      helperWidthProp,
      headerHeightProp,
      offsetHeight,
      bottomHeightProp,
    ],
  );

  /**
   * Start, end, current coordinates changes watcher
   * Calculates selected cells area and set isSelected property to it
   */
  useEffect(() => {
    if (end === undefined && current === undefined) return;
    const startCell = findCell(start);
    if (startCell === -1) return;
    const endCell = findCell(current === undefined ? end : current);
    if (endCell === -1) return;
    const sCell = cells[startCell];
    const eCell = cells[endCell];
    const sRow = sCell.row < eCell.row ? sCell.row : eCell.row;
    const sCol = sCell.column < eCell.column ? sCell.column : eCell.column;
    const eRow = eCell.row > sCell.row ? eCell.row : sCell.row;
    const eCol = eCell.column > sCell.column ? eCell.column : sCell.column;

    const insertCells = cells.map((cell) => {
      if (
        cell.row >= sRow &&
        cell.row <= eRow &&
        cell.column >= sCol &&
        cell.column <= eCol
      ) {
        return { ...cell, isSelected: true };
      } else return cell;
    });
    setCells(insertCells);
    //eslint-disable-next-line
  }, [start, end, current]);

  return (
    <CanvasContext.Provider
      value={{
        canvasRef,
        startDrawing,
        finishDrawing,
        draw,
        isDrawing,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export default CanvasProvider;

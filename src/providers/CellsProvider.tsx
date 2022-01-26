import React, {
  FC,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { Cell, CellsProps, HOUR_24 } from '../common';
import { useScheduler } from './Scheduler';

const CellsContext = createContext<CellsProps>({} as CellsProps);
/**
 *  Virtual cells provider context hook
 *  @returns [CellsProps]{@link CellsProps}
 */
export const useCells = (): CellsProps => useContext(CellsContext);

/**
 * Virtual cells provider
 */
const CellsProvider: FC = ({ children }) => {
  const {
    parentRef,
    timeframe,
    columns,
    helperWidthProp,
    headerHeightProp,
    bottomHeightProp,
  } = useScheduler();

  /**
   * Main context state, setting by useEffect
   */
  const [cellsProps, setCellsProps] = useState<CellsProps>({} as CellsProps);

  /**
   * Main context updater
   */
  const setCells = useCallback(
    (update: Cell[]) => {
      setCellsProps({ ...cellsProps, cells: update });
    },
    [cellsProps],
  );

  /**
   * Ms count per timeframe
   */
  const msTime = useMemo(() => {
    return timeframe * 60 * 1000;
  }, [timeframe]);

  /**
   * Calculates context values and build virtual cells area
   */
  useEffect(() => {
    const parent = parentRef?.current;
    if (!parent) return;
    const widthStep = (parent.offsetWidth - helperWidthProp) / columns?.length;
    const areaHeight =
      parent.offsetHeight - headerHeightProp - bottomHeightProp;
    const heightStep = areaHeight / (1440 / timeframe);
    const millisPerPixel = HOUR_24 / areaHeight;
    const maxCellIndex = areaHeight / heightStep - 1;
    const cells = new Array<Cell>();
    let widthPos = helperWidthProp;
    for (let i = 0; i < columns?.length; i++) {
      let heightPos = headerHeightProp;
      for (let j = 0; j < areaHeight / heightStep; j++) {
        cells.push({
          isSelected: false,
          column: i,
          row: j,
          position: {
            x: widthPos,
            y: heightPos,
            w: widthPos + widthStep,
            h: heightPos + heightStep,
          },
        } as Cell);
        heightPos += heightStep;
      }
      widthPos += widthStep;
    }

    setCellsProps({
      widthStep,
      heightStep,
      millisPerPixel,
      cells,
      maxCellIndex,
      offsetWidth: parent.offsetWidth,
      offsetHeight: parent.offsetHeight,
    } as CellsProps);
  }, [
    parentRef?.current?.offsetWidth,
    parentRef?.current?.offsetHeight,
    columns?.length,
    bottomHeightProp,
    headerHeightProp,
    helperWidthProp,
    timeframe,
    parentRef,
  ]);

  return (
    <CellsContext.Provider
      value={{
        ...cellsProps,
        setCells: setCells,
        msTime,
      }}
    >
      {children}
    </CellsContext.Provider>
  );
};

export default CellsProvider;

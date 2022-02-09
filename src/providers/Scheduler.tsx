import React, {
  FC,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  BlockColorsProps,
  SchedulerInputProps,
  SchedulerProps,
  schedulerColumns,
  schedulerRows,
} from '../common';
import { Background, CustomTime, Popup, SchedulerLayout } from '../components';
import CanvasProvider from './CanvasProvider';
import CellsProvider from './CellsProvider';
import CustomTimeProvider from './CustomTimeProvider';
import PointerLockProvider from './PointerLockProvider';
import PopupProvider from './PopupProvider';
import TimeBlockProvider from './TimeBlockProvider';

const SchedulerContext = createContext<SchedulerProps>({} as SchedulerProps);
/**
 *  Scheduler provider context hook
 *  @returns [SchedulerProps]{@link SchedulerProps}
 */
export const useScheduler = (): SchedulerProps => useContext(SchedulerContext);

/**
 * Root scheduler components
 * @param props{@link SchedulerInputProps} initial props
 */
const Scheduler: FC<SchedulerInputProps> = (props: SchedulerInputProps) => {
  const [update, setUpdate] = useState<number>(0);

  useEffect(() => {
    window.addEventListener('resize', () => setUpdate((update) => update + 1));
    return () => {
      window.removeEventListener('resize', () =>
        setUpdate((update) => update + 1),
      );
    };
  }, []);

  return (
    <SchedulerContext.Provider
      value={{
        parentRef: props.parentRef,
        blockColors: props?.blockColors
          ? props.blockColors
          : ({
              common: '#ff5722',
              temp: '#c6a700',
              draw: '#ff8a50',
              hover: '#ff3d00',
            } as BlockColorsProps),
        headerHeightProp: props?.headerHeightProp ? props.headerHeightProp : 80,
        helperWidthProp: props?.helperWidthProp ? props.helperWidthProp : 80,
        bottomHeightProp: props?.bottomHeightProp ? props.bottomHeightProp : 20,
        baseZIndex: props?.baseZIndex ? props.baseZIndex : 0,
        timeframe: props?.timeframe ? props.timeframe : 60,
        columns: props?.columns ? props.columns : schedulerColumns,
        rows: props?.rows ? props.rows : schedulerRows,
        requiredTZOffset: props?.requiredTZOffset,
        mouseSpeed: props?.mouseSpeed ? props.mouseSpeed : 3,
        defaultValue: props?.defaultValue,
        onChange: props?.onChange,
      }}
    >
      <CellsProvider>
        <CanvasProvider>
          <PointerLockProvider>
            <TimeBlockProvider>
              <PopupProvider>
                <CustomTimeProvider>
                  <Background />
                  <SchedulerLayout />
                  <Popup />
                  <CustomTime />
                </CustomTimeProvider>
              </PopupProvider>
            </TimeBlockProvider>
          </PointerLockProvider>
        </CanvasProvider>
      </CellsProvider>
    </SchedulerContext.Provider>
  );
};

export default Scheduler;

import React, {
  FC,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';

import {
  CustomTimeProps,
  DisplayTime,
  HOUR_24,
  Position,
  TIME,
  Time,
  TimeBlock,
} from '../common';
import { useCells } from './CellsProvider';
import { useTimeBlock } from './TimeBlockProvider';

const CustomTimeContext = createContext<CustomTimeProps>({} as CustomTimeProps);

/**
 *  Custom time provider context hook
 *  @returns [CustomTimeProps]{@link CustomTimeProps}
 */
export const useCustomTime = (): CustomTimeProps =>
  useContext(CustomTimeContext);

/**
 * Custom time provider, used for setting time with second precision
 */
const CustomTimeProvider: FC = ({ children }) => {
  const { millisPerPixel } = useCells();
  const { blocks, setBlocks } = useTimeBlock();

  /**
   * Ms time state
   */
  const [time, setTime] = useState<Time>({} as Time);

  /**
   * Timers relative coordinates
   */
  const [position, setPosition] = useState<Position>();

  /**
   * Editing state
   * If active, other operations with timeblocks will be ignored
   */
  const [isEditing, setEditing] = useState<boolean>(false);

  /**
   * Prime timeblock state
   */
  const [oldBlock, setOldBlock] = useState<TimeBlock>();

  /**
   * Error state with description
   */
  const [isError, setError] = useState<string | undefined>(undefined);

  /**
   * Timers visible time
   */
  const [displayTime, setDisplayTime] = useState<DisplayTime>({
    startTime: '00:00:00',
    endTime: '00:00:00',
  } as DisplayTime);

  /**
   * Extracting timeblock properties and saving it
   */
  const handleObject = useCallback((block: TimeBlock) => {
    setOldBlock(block);
    setPosition({
      top: block.height > 20 ? block.height + block.top + 5 : block.top + 25,
      left: block.left,
    });
    setTime({
      startTime: block.startTime,
      endTime: block.endTime,
    });
    setDisplayTime({
      startTime: new Date(block.startTime).toISOString().substr(11, 8),
      endTime: new Date(block.endTime).toISOString().substr(11, 8),
    });
  }, []);

  /**
   * Timers data extraction
   */
  const handleTime = useCallback(
    (newTime: number, type: boolean) => {
      if (newTime === undefined || newTime === null) {
        setError('Time is null');
        return;
      }
      if (isNaN(newTime)) {
        newTime = 0;
      }
      setError(undefined);
      if (type === TIME.START) {
        setTime({ ...time, startTime: newTime });
        setDisplayTime({
          ...displayTime,
          startTime: new Date(newTime).toISOString().substr(11, 8),
        });
      } else {
        setTime({ ...time, endTime: newTime === 0 ? HOUR_24 : newTime });
        setDisplayTime({
          ...displayTime,
          endTime: new Date(newTime).toISOString().substr(11, 8),
        });
      }
    },
    [displayTime, time],
  );

  /**
   * Timers data reset
   */
  const resetTime = useCallback(() => {
    if (!oldBlock) return;
    setTime({
      startTime: oldBlock.startTime,
      endTime: oldBlock.endTime,
    });
    setDisplayTime({
      startTime: new Date(oldBlock.startTime).toISOString().substr(11, 8),
      endTime: new Date(oldBlock.endTime).toISOString().substr(11, 8),
    });
    setError(undefined);
  }, [oldBlock]);

  /**
   * Updating time to timeblock
   */
  const updateBlock = useCallback(() => {
    if (!oldBlock) return true;
    const filteredBlocks = blocks.filter((b) => b.id !== oldBlock.id);

    if (time.endTime - time.startTime < 1000 * 60) {
      setError('Range < 1 min');
      return true;
    }
    const topY = -(oldBlock.startTime - time.startTime) / millisPerPixel;
    const botY = -(oldBlock.endTime - time.endTime) / millisPerPixel;

    const newBlock = {
      ...oldBlock,
      startTime: time.startTime,
      endTime: time.endTime,
      realStartTime: time.startTime,
      realEndTime: time.endTime,
      top: oldBlock.top + topY,
      height: oldBlock.height + botY - topY,
    };
    setBlocks(filteredBlocks.concat(newBlock));
    return false;
    //eslint-disable-next-line
  }, [blocks, millisPerPixel, oldBlock, time.endTime, time.startTime]);

  return (
    <CustomTimeContext.Provider
      value={{
        isEditing,
        resetTime,
        setEditing,
        handleTime,
        updateBlock,
        position,
        handleObject,
        displayTime,
        isError,
      }}
    >
      {children}
    </CustomTimeContext.Provider>
  );
};

export default CustomTimeProvider;

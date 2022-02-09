import { HOUR_24, TimeBlock } from '../common';

/**
 * Calculates input blocks offset
 * @param inputBlocks - array of timeblocks after parsing
 * @param columnsLength - used day of week count
 * @returns array of timeblocks with corrected days of week visualization
 */
export const inputOffset = (
  inputBlocks: TimeBlock[],
  columnsLength: number,
): TimeBlock[] => {
  /**
   * Internal one day
   */
  const currentDayBlocks = inputBlocks.filter(
    (ib) => ib.startTime >= 0 && ib.endTime <= HOUR_24,
  );

  /**
   * Timeblock moving to next day
   */
  const nextDayBlocks = inputBlocks
    .filter((ib) => ib.endTime > HOUR_24 && ib.startTime >= 0)
    .reduce((acc: TimeBlock[], block: TimeBlock) => {
      const newCol = block.column + 1 >= columnsLength ? 0 : block.column + 1;
      const newEnd = block.endTime - HOUR_24;
      const newStart = block.startTime - HOUR_24;

      /**
       * Timeblock moving to next day
       */
      if (newStart > 0)
        return acc.concat({
          ...block,
          startTime: newStart,
          endTime: newEnd,
          realStartTime: newStart,
          realEndTime: newEnd,
          column: newCol,
        });

      /**
       * Split timeblock to 2 non-zero ranges
       */
      const secondBlock = {
        ...block,
        startTime: 0,
        endTime: newEnd,
        realStartTime: 0,
        realEndTime: newEnd,
        column: newCol,
      };

      if (block.startTime < HOUR_24) {
        return acc.concat(
          {
            ...block,
            startTime: block.startTime,
            endTime: HOUR_24,
            realStartTime: block.startTime,
            realEndTime: HOUR_24,
            column: block.column,
          },
          secondBlock,
        );
      }

      return acc.concat(secondBlock);
    }, []);

  /**
   * Timeblock moving to previously day
   */
  const prevDayBlocks = inputBlocks
    .filter((ib) => ib.startTime < 0 && ib.endTime <= HOUR_24)
    .reduce((acc: TimeBlock[], block: TimeBlock) => {
      const newCol =
        block.column - 1 < 0 ? columnsLength - 1 : block.column - 1;
      const newStart = HOUR_24 + block.startTime;
      const newEnd = HOUR_24 + block.endTime;

      /**
       * Full moving
       */
      if (newEnd < HOUR_24) {
        return acc.concat({
          ...block,
          startTime: newStart,
          endTime: newEnd,
          realStartTime: newStart,
          realEndTime: newEnd,
          column: newCol,
        });
      }

      /**
       * Split timeblock to 2 non-zero ranges
       */
      const ndEnd = HOUR_24 - (HOUR_24 - block.endTime);
      const firstBlock = {
        ...block,
        startTime: newStart,
        endTime: HOUR_24,
        realStartTime: newStart,
        realEndTime: HOUR_24,
        column: newCol,
      };

      if (ndEnd !== 0) {
        return acc.concat(firstBlock, {
          ...block,
          startTime: 0,
          endTime: ndEnd,
          realStartTime: 0,
          realEndTime: ndEnd,
          column: block.column,
        });
      }

      return acc.concat(firstBlock);
    }, []);

  return [...currentDayBlocks, ...nextDayBlocks, ...prevDayBlocks];
};

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
  const correctedBlocks: TimeBlock[] = [];
  inputBlocks.forEach((ib) => {
    /**
     * Timeblock moving to next day
     */
    if (ib.endTime > 86400 * 1000) {
      const newCol = ib.column + 1 >= columnsLength ? 0 : ib.column + 1;
      const newEnd = ib.endTime - HOUR_24;
      const newStart = ib.startTime - HOUR_24;
      /**
       * Full moving
       */
      if (newStart > 0) {
        correctedBlocks.push({
          ...ib,
          startTime: newStart,
          endTime: newEnd,
          realStartTime: newStart,
          realEndTime: newEnd,
          column: newCol,
        });
        return;
      }
      /**
       * Split timeblock to 2 non-zero ranges
       */
      if (ib.startTime < HOUR_24) {
        correctedBlocks.push({
          ...ib,
          startTime: ib.startTime,
          endTime: HOUR_24,
          realStartTime: ib.startTime,
          realEndTime: HOUR_24,
          column: ib.column,
        });
      }
      correctedBlocks.push({
        ...ib,
        startTime: 0,
        endTime: newEnd,
        realStartTime: 0,
        realEndTime: newEnd,
        column: newCol,
      });
      return;
    }
    /**
     * Timeblock moving to previously day
     */
    if (ib.startTime < 0) {
      const newCol = ib.column - 1 < 0 ? columnsLength - 1 : ib.column - 1;
      const newStart = HOUR_24 + ib.startTime;
      const newEnd = HOUR_24 + ib.endTime;
      /**
       * Full moving
       */
      if (newEnd < HOUR_24) {
        correctedBlocks.push({
          ...ib,
          startTime: newStart,
          endTime: newEnd,
          realStartTime: newStart,
          realEndTime: newEnd,
          column: newCol,
        });
        return;
      }
      /**
       * Split timeblock to 2 non-zero ranges
       */
      correctedBlocks.push({
        ...ib,
        startTime: newStart,
        endTime: HOUR_24,
        realStartTime: newStart,
        realEndTime: HOUR_24,
        column: newCol,
      });
      const ndEnd = HOUR_24 - (HOUR_24 - ib.endTime);
      if (ndEnd !== 0) {
        correctedBlocks.push({
          ...ib,
          startTime: 0,
          endTime: ndEnd,
          realStartTime: 0,
          realEndTime: ndEnd,
          column: ib.column,
        });
      }
      return;
    }
    /**
     * Internal day moving
     */
    correctedBlocks.push({
      ...ib,
    });
  });

  return correctedBlocks;
};

import { HOUR_24, SchedulerColumnsProps, TimeBlock } from '../common';

/**
 * Calculates timeblocks offset before output (UTC+0)
 * @param blocks - current timeblocks
 * @param tzOffset - current timezone offset in ms
 * @param columns - used day of week count
 * @returns TimeBlocks with applied offset and corrected days of week
 */
export const outputOffset = (
  blocks: TimeBlock[],
  tzOffset: number,
  columns: SchedulerColumnsProps[],
): TimeBlock[] => {
  const offsetsBlocks = new Array<TimeBlock>();
  blocks.forEach((b) => {
    const ofStart = b.startTime + tzOffset;
    const ofEnd = b.endTime + tzOffset;
    const columnWeight = columns[b.column].weight;

    /**
     * Timeblock moving to previously day
     */
    if (ofStart < 0) {
      const newCol = b.column - 1 < 0 ? columns.length - 1 : b.column - 1;
      const offsetWeight = columns[newCol].weight;
      const newStart = HOUR_24 + ofStart;
      const newEnd = HOUR_24 + ofEnd;
      /**
       * Full moving
       */
      if (newEnd < HOUR_24) {
        offsetsBlocks.push({
          ...b,
          startTime: newStart,
          endTime: newEnd,
          realStartTime: newStart,
          realEndTime: newEnd,
          column: offsetWeight,
        });
        return;
      }
      /**
       * Split timeblock to 2 non-zero ranges
       */
      offsetsBlocks.push({
        ...b,
        startTime: newStart,
        endTime: HOUR_24,
        realStartTime: newStart,
        realEndTime: HOUR_24,
        column: offsetWeight,
      });
      const ndEnd = HOUR_24 - (HOUR_24 - ofEnd);
      if (ndEnd !== 0) {
        offsetsBlocks.push({
          ...b,
          startTime: 0,
          endTime: ndEnd,
          realStartTime: 0,
          realEndTime: ndEnd,
          column: columnWeight,
        });
      }
      return;
    }

    /**
     * Timeblock moving to next day
     */
    if (ofEnd > HOUR_24) {
      const newCol = b.column + 1 >= columns.length ? 0 : b.column + 1;
      const offsetWeight = columns[newCol].weight;
      const newEnd = ofEnd - HOUR_24;
      const newStart = ofStart - HOUR_24;
      /**
       * Full moving
       */
      if (newStart > 0) {
        offsetsBlocks.push({
          ...b,
          startTime: newStart,
          endTime: newEnd,
          realStartTime: newStart,
          realEndTime: newEnd,
          column: offsetWeight,
        });
        return;
      }
      /**
       * Split timeblock to 2 non-zero ranges
       */
      if (ofStart !== HOUR_24) {
        offsetsBlocks.push({
          ...b,
          startTime: ofStart,
          endTime: HOUR_24,
          realStartTime: ofStart,
          realEndTime: HOUR_24,
          column: columnWeight,
        });
      }
      offsetsBlocks.push({
        ...b,
        startTime: 0,
        endTime: newEnd,
        realStartTime: 0,
        realEndTime: newEnd,
        column: offsetWeight,
      });
      return;
    }
    /**
     * Internal day moving
     */
    offsetsBlocks.push({
      ...b,
      startTime: ofStart,
      endTime: ofEnd,
      realStartTime: ofStart,
      realEndTime: ofEnd,
      column: columnWeight,
    });
  });

  return offsetsBlocks;
};

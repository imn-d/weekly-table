import { SchedulerColumnsProps, TimeBlock } from '../common';

/**
 * Timebloks merger after applying offset (for output)
 * @param offsetsBlocks - array of timeblocks with applied offset
 * @param columns - used day of week count
 * @returns ScheduleGroups output in UTC timezone
 */
export const outputMerger = (
  offsetsBlocks: TimeBlock[],
  columns: SchedulerColumnsProps[],
): TimeBlock[] => {
  const mergedBlocks = new Array<TimeBlock>();
  for (let i = 0; i < columns.length; i++) {
    const columnWeight = columns[i].weight;
    const columnBlocks = offsetsBlocks
      .filter((ob) => ob.column === columnWeight)
      .sort((prev, cur) => {
        if (prev.startTime <= cur.startTime) return -1;
        return 1;
      });
    for (let i = 0; i < columnBlocks.length; i++) {
      const current = columnBlocks[i];
      const next = columnBlocks[i + 1];
      if (!next) {
        mergedBlocks.push(current);
        break;
      }
      if (current.endTime !== next.startTime) {
        mergedBlocks.push(current);
        continue;
      }

      const merged = {
        ...current,
        endTime: next.endTime,
        realEndTime: next.realEndTime,
      };
      mergedBlocks.push(merged);
      i = i + 1;
    }
  }
  return mergedBlocks;
};

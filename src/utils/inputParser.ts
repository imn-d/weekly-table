import { ScheduleGroup, TimeBlock } from '../common';

/**
 * Schedule groups parser with setting offset
 * @param defaultValue - input groups
 * @param columnsLength - used day of week count
 * @param tzOffset - required offset in ms
 * @returns Timeblocks with offset
 */
export const inputParser = (
  defaultValue: ScheduleGroup[],
  columnsLength: number,
  tzOffset: number,
): TimeBlock[] => {
  return defaultValue.reduce<TimeBlock[]>(
    (acc: TimeBlock[], current: ScheduleGroup) => {
      let binMask = current.mask.toString(2);
      if (binMask.length < columnsLength) {
        binMask = '0'.repeat(columnsLength - binMask.length).concat(binMask);
      }

      const inputColumns = [...binMask].reverse();
      const ofStart = current.startTime - tzOffset;
      const ofEnd = current.endTime - tzOffset;

      const filtered = inputColumns.reduce<TimeBlock[]>(
        (acc: TimeBlock[], current: string, currentIndex: number) => {
          if (current === '0') return acc.concat();
          return acc.concat({
            startTime: ofStart,
            endTime: ofEnd,
            column: currentIndex,
          } as TimeBlock);
        },
        [],
      );
      return acc.concat(filtered);
    },
    [],
  );
};

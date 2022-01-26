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
  const inputBlocks: TimeBlock[] = [];
  defaultValue.forEach((df) => {
    let binMask = df.mask.toString(2);
    if (binMask.length < columnsLength)
      binMask = '0'.repeat(columnsLength - binMask.length).concat(binMask);

    const inputColumns = [...binMask].reverse();
    const ofStart = df.startTime - tzOffset;
    const ofEnd = df.endTime - tzOffset;
    for (let i = 0; i < inputColumns.length; i++) {
      if (inputColumns[i] === '0') continue;
      inputBlocks.push({
        startTime: ofStart,
        endTime: ofEnd,
        column: i,
      } as TimeBlock);
    }
  });

  return inputBlocks;
};

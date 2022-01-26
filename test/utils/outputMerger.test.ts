import { schedulerColumns } from '../../src';
import { outputMerger } from '../../src/utils';
import { offsettedTimeBlocks } from '../helpers';

describe('Output Merger Util', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Zero offset', () => {
    const res = outputMerger(offsettedTimeBlocks, schedulerColumns);
    expect(offsettedTimeBlocks).toHaveLength(5);
    expect(res).toHaveLength(4);
    expect(res).toEqual([
      {
        column: 1,
        endTime: 15000,
        realEndTime: 15000,
        realStartTime: 0,
        startTime: 0,
      },
      {
        column: 1,
        endTime: 190000,
        realEndTime: 190000,
        realStartTime: 90000,
        startTime: 90000,
      },
      {
        column: 8,
        endTime: 15000,
        realEndTime: 15000,
        realStartTime: 0,
        startTime: 0,
      },
      {
        column: 16,
        endTime: 15000,
        realEndTime: 15000,
        realStartTime: 0,
        startTime: 0,
      },
    ]);
  });
});

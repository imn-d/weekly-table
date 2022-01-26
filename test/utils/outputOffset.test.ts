import { schedulerColumns } from '../../src';
import { HOUR_24 } from '../../src/common';
import { outputOffset } from '../../src/utils';
import { timeBlockFirst, timeBlockSecond } from '../helpers';

describe('Output Offset Util', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Zero Offset', () => {
    const res = outputOffset(
      [{ ...timeBlockFirst, column: 5 }, timeBlockSecond],
      0,
      schedulerColumns,
    );
    expect(res).toEqual([
      { ...timeBlockFirst, column: 32 },
      { ...timeBlockSecond, column: 2 },
    ]);
    expect(res).toHaveLength(2);
  });

  it('Prev Day Full Block', () => {
    const res = outputOffset(
      [{ ...timeBlockFirst, column: 5 }, timeBlockSecond],
      -30000,
      schedulerColumns,
    );
    expect(res).toEqual([
      {
        column: 16,
        endTime: 86385000,
        realEndTime: 86385000,
        realStartTime: 86370000,
        startTime: 86370000,
      },
      {
        column: 1,
        endTime: 86385000,
        realEndTime: 86385000,
        realStartTime: 86370000,
        startTime: 86370000,
      },
    ]);
    expect(res).toHaveLength(2);
  });

  it('Prev Day Block slice', () => {
    const res = outputOffset(
      [{ ...timeBlockFirst, column: 5 }, timeBlockSecond],
      -5000,
      schedulerColumns,
    );
    expect(res).toEqual([
      {
        column: 16,
        endTime: 86400000,
        realEndTime: 86400000,
        realStartTime: 86395000,
        startTime: 86395000,
      },
      {
        column: 32,
        endTime: 10000,
        realEndTime: 10000,
        realStartTime: 0,
        startTime: 0,
      },
      {
        column: 1,
        endTime: 86400000,
        realEndTime: 86400000,
        realStartTime: 86395000,
        startTime: 86395000,
      },
      {
        column: 2,
        endTime: 10000,
        realEndTime: 10000,
        realStartTime: 0,
        startTime: 0,
      },
    ]);
    expect(res).toHaveLength(4);
  });

  it('Next Day Full Block', () => {
    const res = outputOffset(
      [{ ...timeBlockFirst, column: 5 }, timeBlockSecond],
      HOUR_24 + 1000,
      schedulerColumns,
    );
    expect(res).toEqual([
      {
        column: 64,
        endTime: 16000,
        realEndTime: 16000,
        realStartTime: 1000,
        startTime: 1000,
      },
      {
        column: 4,
        endTime: 16000,
        realEndTime: 16000,
        realStartTime: 1000,
        startTime: 1000,
      },
    ]);
    expect(res).toHaveLength(2);
  });

  it('Next Day Block Slice', () => {
    const res = outputOffset(
      [{ ...timeBlockFirst, column: 5 }, timeBlockSecond],
      HOUR_24 - 1000,
      schedulerColumns,
    );
    expect(res).toEqual([
      {
        column: 32,
        endTime: 86400000,
        realEndTime: 86400000,
        realStartTime: 86399000,
        startTime: 86399000,
      },
      {
        column: 64,
        endTime: 14000,
        realEndTime: 14000,
        realStartTime: 0,
        startTime: 0,
      },
      {
        column: 2,
        endTime: 86400000,
        realEndTime: 86400000,
        realStartTime: 86399000,
        startTime: 86399000,
      },
      {
        column: 4,
        endTime: 14000,
        realEndTime: 14000,
        realStartTime: 0,
        startTime: 0,
      },
    ]);
    expect(res).toHaveLength(4);
  });
});

import { inputOffset } from '../../src/utils';
import { timeBlockFirst, timeBlockSecond } from '../helpers';

describe('Inout Offset Util', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Normal Block', () => {
    const res = inputOffset([timeBlockFirst, timeBlockSecond], 2);
    expect(res).toEqual([timeBlockFirst, timeBlockSecond]);
    expect(res).toHaveLength(2);
  });

  it('Next Day Block Full', () => {
    const res = inputOffset(
      [
        {
          ...timeBlockFirst,
          startTime: 90000 * 1000, //>86400*1000
          endTime: 120000 * 1000, //>86400*1000
          realStartTime: 90000 * 1000,
          realEndTime: 120000 * 1000,
        },
        timeBlockSecond,
      ],
      2,
    );
    expect(res).toEqual([
      {
        column: 1,
        startTime: 3600000,
        endTime: 33600000,
        realStartTime: 3600000,
        realEndTime: 33600000,
      },
      timeBlockSecond,
    ]);
    expect(res).toHaveLength(2);
  });

  it('Next Day Block Slice', () => {
    const res = inputOffset(
      [
        {
          ...timeBlockFirst,
          startTime: 80000 * 1000, //<86400*1000
          endTime: 120000 * 1000, //>86400*1000
          realStartTime: 80000 * 1000,
          realEndTime: 120000 * 1000,
        },
        timeBlockSecond,
      ],
      2,
    );
    expect(res).toEqual([
      {
        column: 0,
        startTime: 80000 * 1000,
        endTime: 86400 * 1000,
        realStartTime: 80000 * 1000,
        realEndTime: 86400 * 1000,
      },
      {
        column: 1,
        startTime: 0,
        endTime: 33600000,
        realStartTime: 0,
        realEndTime: 33600000,
      },
      timeBlockSecond,
    ]);
    expect(res).toHaveLength(3);
  });

  it('Prev Day Block Full', () => {
    const res = inputOffset(
      [
        {
          ...timeBlockFirst,
          startTime: -5 * 60 * 60 * 1000, //<0
          endTime: -2 * 60 * 60 * 1000, //<0
          realStartTime: -5 * 60 * 60 * 1000,
          realEndTime: -2 * 60 * 60 * 1000,
        },
        timeBlockSecond,
      ],
      2,
    );
    expect(res).toEqual([
      {
        column: 1,
        startTime: 68400000,
        endTime: 79200000,
        realStartTime: 68400000,
        realEndTime: 79200000,
      },
      timeBlockSecond,
    ]);
    expect(res).toHaveLength(2);
  });

  it('Prev Day Block Slice', () => {
    const res = inputOffset(
      [
        {
          ...timeBlockFirst,
          startTime: -5 * 60 * 60 * 1000, //<0
          endTime: 2 * 60 * 60 * 1000, //>0
          realStartTime: -5 * 60 * 60 * 1000,
          realEndTime: 2 * 60 * 60 * 1000,
        },
        timeBlockSecond,
      ],
      2,
    );
    expect(res).toEqual([
      {
        column: 1,
        startTime: 68400000,
        endTime: 86400000,
        realStartTime: 68400000,
        realEndTime: 86400000,
      },
      {
        column: 0,
        startTime: 0,
        endTime: 7200000,
        realStartTime: 0,
        realEndTime: 7200000,
      },
      timeBlockSecond,
    ]);
    expect(res).toHaveLength(3);
  });
});

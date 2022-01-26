import { inputParser } from '../../src/utils';
import { scheduleGroup, timeBlockFirst, timeBlockSecond } from '../helpers';

describe('Input Parser Util', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Zero offset', () => {
    const res = inputParser(scheduleGroup, 7, 0);
    expect(res).toEqual([
      { ...timeBlockFirst, realEndTime: undefined, realStartTime: undefined },
      { ...timeBlockSecond, realEndTime: undefined, realStartTime: undefined },
    ]);
  });

  it('Plus offset', () => {
    const res = inputParser(scheduleGroup, 7, 300);
    expect(res).toEqual([
      {
        ...timeBlockFirst,
        startTime: -300,
        endTime: 14700,
        realEndTime: undefined,
        realStartTime: undefined,
      },
      {
        ...timeBlockSecond,
        startTime: -300,
        endTime: 14700,
        realEndTime: undefined,
        realStartTime: undefined,
      },
    ]);
  });

  it('Minus offset', () => {
    const res = inputParser(scheduleGroup, 7, -300);
    expect(res).toEqual([
      {
        ...timeBlockFirst,
        startTime: 300,
        endTime: 15300,
        realEndTime: undefined,
        realStartTime: undefined,
      },
      {
        ...timeBlockSecond,
        startTime: 300,
        endTime: 15300,
        realEndTime: undefined,
        realStartTime: undefined,
      },
    ]);
  });
});

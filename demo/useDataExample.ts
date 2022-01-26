import { useMemo } from 'react';

import { ScheduleGroup } from '../src';

export const useDataExample = () => {
  const fiveExample = useMemo<ScheduleGroup[]>(
    () => [
      {
        startTime: 1000 * 60 * 60 * 10,
        endTime: 1000 * 60 * 60 * 18,
        mask: 31,
      },
    ],
    [],
  );

  const weekendExample = useMemo<ScheduleGroup[]>(
    () => [
      {
        startTime: 1000 * 60 * 60 * 12,
        endTime: 1000 * 60 * 60 * 15,
        mask: 96,
      },
    ],
    [],
  );

  const complexExample = useMemo<ScheduleGroup[]>(
    () => [
      {
        startTime: 1000 * 60 * 60,
        endTime: 1000 * 60 * 60 * 4,
        mask: 63,
      },
      {
        startTime: 1000 * 60 * 60 * 8,
        endTime: 1000 * 60 * 60 * 12,
        mask: 3,
      },
      {
        startTime: 1000 * 60 * 60 * 14,
        endTime: 1000 * 60 * 60 * 16,
        mask: 3,
      },
      {
        startTime: 1000 * 60 * 60 * 18,
        endTime: 1000 * 60 * 60 * 19,
        mask: 19,
      },
      {
        startTime: 1000 * 60 * 60 * 22,
        endTime: 1000 * 60 * 60 * 23,
        mask: 1,
      },
      {
        startTime: 1000 * 60 * 60 * 20,
        endTime: 1000 * 60 * 60 * 22,
        mask: 6,
      },
      {
        startTime: 1000 * 60 * 60 * 6,
        endTime: 1000 * 60 * 60 * 7,
        mask: 28,
      },
      {
        startTime: 1000 * 60 * 60 * 8,
        endTime: 1000 * 60 * 60 * 17,
        mask: 4,
      },
      {
        startTime: 1000 * 60 * 60 * 9,
        endTime: 1000 * 60 * 60 * 18,
        mask: 8,
      },
      {
        startTime: 1000 * 60 * 60 * 21,
        endTime: 1000 * 60 * 60 * 23,
        mask: 24,
      },
      {
        startTime: 1000 * 60 * 60 * 9,
        endTime: 1000 * 60 * 60 * 16,
        mask: 16,
      },
      {
        startTime: 1000 * 60 * 60 * 5,
        endTime: 1000 * 60 * 60 * 6,
        mask: 32,
      },
      {
        startTime: 1000 * 60 * 60 * 8,
        endTime: 1000 * 60 * 60 * 13,
        mask: 32,
      },
      {
        startTime: 1000 * 60 * 60 * 14,
        endTime: 1000 * 60 * 60 * 15,
        mask: 96,
      },
      {
        startTime: 1000 * 60 * 60 * 17,
        endTime: 1000 * 60 * 60 * 22,
        mask: 96,
      },
      {
        startTime: 1000 * 60 * 60 * 3,
        endTime: 1000 * 60 * 60 * 9,
        mask: 64,
      },
      {
        startTime: 1000 * 60 * 60 * 11,
        endTime: 1000 * 60 * 60 * 12,
        mask: 64,
      },
    ],
    [],
  );

  return { fiveExample, weekendExample, complexExample };
};

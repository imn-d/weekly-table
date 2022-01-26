import { SchedulerColumnsProps } from './types';

/**
 * Default used columns descriptions
 * [SchedulerColumnsProps]{@link SchedulerColumnsProps}
 */
export const schedulerColumns: SchedulerColumnsProps[] = [
  { weight: 1, full: 'Monday', short: 'Mon' },
  { weight: 2, full: 'Tuesday', short: 'Tue' },
  { weight: 4, full: 'Wednesday', short: 'Wed' },
  { weight: 8, full: 'Thursday', short: 'Thu' },
  { weight: 16, full: 'Friday', short: 'Fri' },
  { weight: 32, full: 'Saturday', short: 'Sat' },
  { weight: 64, full: 'Sunday', short: 'Sun' },
];

/**
 * Default used time rows descriptions
 */
export const schedulerRows: string[] = [
  '01:00',
  '04:00',
  '07:00',
  '10:00',
  '13:00',
  '17:00',
  '20:00',
  '23:00',
];

/**
 * Describing time block moving direction
 */
export const DIR = {
  TOP: false,
  BOTTOM: true,
};

/**
 * Describing time block actions
 */
export const ACTION = {
  RESIZE_TOP: 0,
  RESIZE_BOT: 1,
  MOVE: 2,
};

/**
 * Describing which time was changes, using for custom time setter
 */
export const TIME = {
  START: true,
  END: false,
};

/**
 * ms count per 1 day
 */
export const HOUR_24 = 86400000;

import { Cell, ScheduleGroup, TimeBlock } from '../src/common';

export const cellsGenerator = (cellsMock: any, schedulerMock: any): Cell[] => {
  const generatedCells: Cell[] = [];
  const widthStep = (cellsMock.offsetWidth - schedulerMock.helperWidthProp) / 7;
  const areaHeight =
    cellsMock.offsetHeight -
    schedulerMock.headerHeightProp -
    schedulerMock.bottomHeightProp;

  const heightStep = areaHeight / (1440 / 60);

  let widthPos = schedulerMock.helperWidthProp;
  for (let i = 0; i < 7; i++) {
    let heightPos = schedulerMock.headerHeightProp;
    for (let j = 0; j < areaHeight / heightStep; j++) {
      generatedCells.push({
        isSelected: false,
        column: i,
        row: j,
        position: {
          x: widthPos,
          y: heightPos,
          w: widthPos + widthStep,
          h: heightPos + heightStep,
        },
      } as Cell);
      heightPos += heightStep;
    }
    widthPos += widthStep;
  }
  return generatedCells;
};

export const timeBlockFirst = {
  startTime: 0,
  endTime: 15000,
  realStartTime: 0,
  realEndTime: 15000,
  column: 0,
} as TimeBlock;

export const timeBlockSecond = {
  startTime: 0,
  endTime: 15000,
  realStartTime: 0,
  realEndTime: 15000,
  column: 1,
} as TimeBlock;

export const fullTimeBlock = {
  column: 0,
  startTime: 0,
  id: '1',
  endTime: 18000000,
  height: 210,
  realEndTime: 27818181.81818182,
  realStartTime: 7200000,
  top: 73,
  left: 0,
  isTemp: false,
  width: 20,
};

export const scheduleGroup: ScheduleGroup[] = [
  { startTime: 0, endTime: 15000, mask: 3 },
];

export const offsettedTimeBlocks: TimeBlock[] = [
  {
    startTime: 90000,
    endTime: 110000,
    realStartTime: 90000,
    realEndTime: 110000,
    column: 1,
  } as TimeBlock,
  {
    startTime: 0,
    endTime: 15000,
    realStartTime: 0,
    realEndTime: 15000,
    column: 16,
  } as TimeBlock,
  {
    startTime: 0,
    endTime: 15000,
    realStartTime: 0,
    realEndTime: 15000,
    column: 1,
  } as TimeBlock,
  {
    startTime: 0,
    endTime: 15000,
    realStartTime: 0,
    realEndTime: 15000,
    column: 8,
  } as TimeBlock,
  {
    startTime: 110000,
    endTime: 190000,
    realStartTime: 110000,
    realEndTime: 190000,
    column: 1,
  } as TimeBlock,
];

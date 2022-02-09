import { mount } from 'enzyme';
import React, { FC } from 'react';

import {
  CanvasProps,
  CellsProps,
  HOUR_24,
  PointerLockProps,
  SchedulerProps,
  TimeBlock,
  schedulerColumns,
} from '../../src/common';
import { useTimeBlock } from '../../src/providers';
import * as ucan from '../../src/providers/CanvasProvider';
import * as uc from '../../src/providers/CellsProvider';
import * as up from '../../src/providers/PointerLockProvider';
import * as us from '../../src/providers/Scheduler';
import TimeBlockProvider from '../../src/providers/TimeBlockProvider';
import * as rand from '../../src/utils/random';
import { cellsGenerator, fullTimeBlock, scheduleGroup } from '../helpers';

describe('TimeBlock Provider', () => {
  const useSchedulerMock = jest.spyOn(us, 'useScheduler');
  const useCellMock = jest.spyOn(uc, 'useCells');
  const useCanvasMock = jest.spyOn(ucan, 'useCanvas');
  const useLockMock = jest.spyOn(up, 'usePointerLock');

  jest.spyOn(rand, 'random').mockReturnValue('1111');

  const schedulerMock = {
    columns: schedulerColumns,
    defaultValue: undefined,
    onChange: undefined,
    helperWidthProp: 80,
    headerHeightProp: 80,
    bottomHeightProp: 20,
    requiredTZOffset: 0,
  } as SchedulerProps;

  const setCells = jest.fn();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const cellsMock = {
    cells: [],
    setCells,
    widthStep: (1000 - 80) / 7,
    millisPerPixel: HOUR_24 / (1000 - 120),
    msTime: 60 * 60 * 1000,
    maxCellIndex: 23,
    offsetWidth: 600,
    offsetHeight: 1000,
  } as CellsProps;

  const canvasMock = {
    isDrawing: false,
  } as CanvasProps;

  const lockMock = {
    isLocking: false,
  } as PointerLockProps;

  const TimeBlockTesting: FC<TimeBlock> = (block: TimeBlock) => {
    const {
      undoHistory,
      blocks,
      setTopPosition,
      preview,
      setBotPosition,
      setBlocks,
      handleHistory,
    } = useTimeBlock();
    return (
      <>
        <input
          id={'blocks'}
          type={'text'}
          defaultValue={JSON.stringify(blocks)}
        />
        <input
          id={'preview'}
          type={'text'}
          defaultValue={JSON.stringify(preview)}
        />
        <button id={'undoHistory'} onClick={() => undoHistory()} />
        <button
          id={'setTopPosition'}
          onClick={() => setTopPosition(block, false)}
        />
        <button
          id={'setTopPositionHeight'}
          onClick={() => setTopPosition(block, true)}
        />
        <button id={'setBotPosition'} onClick={() => setBotPosition(block)} />
        <button id={'setBlocks'} onClick={() => setBlocks([block])} />
        <button id={'handleHistory'} onClick={() => handleHistory([block])} />
      </>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Base Pipeline', async () => {
    const cells = cellsGenerator(cellsMock, schedulerMock);

    useSchedulerMock.mockReturnValue(schedulerMock);
    useCellMock.mockReturnValue({
      ...cellsMock,
      cells,
    });
    useLockMock.mockReturnValue(lockMock);
    useCanvasMock.mockReturnValue(canvasMock);

    const wrapper = mount(<TimeBlockTesting {...fullTimeBlock} />, {
      wrappingComponent: TimeBlockProvider,
    });

    expect(wrapper.find('#blocks').prop('defaultValue')).toEqual('[]');
    expect(wrapper.find('#preview').prop('defaultValue')).toEqual('[]');

    wrapper.unmount();
  });

  describe('setPosition Tests', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      useSchedulerMock.mockReturnValue(schedulerMock);
      useLockMock.mockReturnValue(lockMock);
      useCanvasMock.mockReturnValue(canvasMock);
    });

    it('Not Allowed TimeFrame TOP', async () => {
      const cells = cellsGenerator(cellsMock, schedulerMock);

      useCellMock.mockReturnValue({
        ...cellsMock,
        cells,
      });
      const wrapper = mount(
        <TimeBlockTesting
          {...{ ...fullTimeBlock, endTime: 5000, startTime: 1000 }}
        />,
        {
          wrappingComponent: TimeBlockProvider,
        },
      );

      wrapper.find('#setTopPosition').simulate('click');

      expect(wrapper.find('#blocks').prop('defaultValue')).toEqual('[]');

      wrapper.unmount();
    });

    it('Base Moving TOP', async () => {
      const cells = cellsGenerator(cellsMock, schedulerMock);

      useCellMock.mockReturnValue({
        ...cellsMock,
        cells,
      });
      const wrapper = mount(<TimeBlockTesting {...fullTimeBlock} />, {
        wrappingComponent: TimeBlockProvider,
      });

      wrapper.find('#setTopPosition').simulate('click');

      expect(wrapper.find('#blocks').prop('defaultValue')).toEqual(
        JSON.stringify([
          {
            column: 0,
            startTime: 0,
            id: '1',
            endTime: 18000000,
            height: 210,
            realEndTime: 18000000,
            realStartTime: 0,
            top: 80,
            left: 0,
            isTemp: false,
            width: 20,
          },
        ]),
      );

      wrapper.unmount();
    });

    it('Moving TOP with Height', async () => {
      const cells = cellsGenerator(cellsMock, schedulerMock);

      useCellMock.mockReturnValue({
        ...cellsMock,
        cells,
      });
      const wrapper = mount(<TimeBlockTesting {...fullTimeBlock} />, {
        wrappingComponent: TimeBlockProvider,
      });

      wrapper.find('#setTopPositionHeight').simulate('click');

      expect(wrapper.find('#blocks').prop('defaultValue')).toEqual(
        JSON.stringify([
          {
            column: 0,
            startTime: 0,
            id: '1',
            endTime: 18000000,
            height: 203,
            realEndTime: 18000000,
            realStartTime: 0,
            top: 80,
            left: 0,
            isTemp: false,
            width: 20,
          },
        ]),
      );

      wrapper.unmount();
    });

    it('Moving Bot', async () => {
      const cells = cellsGenerator(cellsMock, schedulerMock);

      useCellMock.mockReturnValue({
        ...cellsMock,
        cells,
      });
      const wrapper = mount(<TimeBlockTesting {...fullTimeBlock} />, {
        wrappingComponent: TimeBlockProvider,
      });

      wrapper.find('#setBotPosition').simulate('click');

      expect(wrapper.find('#blocks').prop('defaultValue')).toEqual(
        JSON.stringify([
          {
            column: 0,
            startTime: 0,
            id: '1',
            endTime: 18000000,
            height: 194.5,
            realEndTime: 18000000,
            realStartTime: 0,
            top: 73,
            left: 0,
            isTemp: false,
            width: 20,
          },
        ]),
      );

      wrapper.unmount();
    });
  });

  describe('Build Tests', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      useSchedulerMock.mockReturnValue(schedulerMock);
      useLockMock.mockReturnValue(lockMock);
    });

    it('Build Test Preview', () => {
      useCanvasMock.mockReturnValue({ ...canvasMock, isDrawing: true });

      const cells = cellsGenerator(cellsMock, schedulerMock);
      const emptyCells = cellsGenerator(cellsMock, schedulerMock);
      cells[1] = { ...cells[1], isSelected: true };
      cells[22] = { ...cells[22], isSelected: true };

      useCellMock
        .mockReturnValueOnce({
          ...cellsMock,
          cells,
        })
        .mockReturnValue({
          ...cellsMock,
          cells: emptyCells,
        });

      const wrapper = mount(<TimeBlockTesting {...fullTimeBlock} />, {
        wrappingComponent: TimeBlockProvider,
      });

      expect(setCells).toBeCalledTimes(1);
      expect(wrapper.find('#blocks').prop('defaultValue')).toEqual('[]');
      expect(wrapper.find('#preview').prop('defaultValue')).toEqual(
        JSON.stringify([
          {
            id: '1111',
            startTime: 3600000,
            endTime: 82800000,
            width: 98.57142857142856,
            height: 825,
            top: 117.5,
            left: 85,
            column: 0,
            isTemp: true,
            realStartTime: 3600000,
            realEndTime: 82800000,
          },
        ]),
      );

      wrapper.unmount();
    });

    it('Build Test Permanent', () => {
      useCanvasMock.mockReturnValue({ ...canvasMock, isDrawing: false });

      const cells = cellsGenerator(cellsMock, schedulerMock);
      const emptyCells = cellsGenerator(cellsMock, schedulerMock);
      cells[1] = { ...cells[1], isSelected: true };
      cells[22] = { ...cells[22], isSelected: true };

      useCellMock
        .mockReturnValueOnce({
          ...cellsMock,
          cells,
        })
        .mockReturnValue({
          ...cellsMock,
          cells: emptyCells,
        });

      const wrapper = mount(<TimeBlockTesting {...fullTimeBlock} />, {
        wrappingComponent: TimeBlockProvider,
      });

      expect(setCells).toBeCalledTimes(1);
      expect(wrapper.find('#preview').prop('defaultValue')).toEqual('[]');
      expect(wrapper.find('#blocks').prop('defaultValue')).toEqual(
        JSON.stringify([
          {
            id: '1111',
            startTime: 3600000,
            endTime: 82800000,
            width: 98.57142857142856,
            height: 825,
            top: 117.5,
            left: 85,
            column: 0,
            isTemp: false,
            realStartTime: 3600000,
            realEndTime: 82800000,
          },
        ]),
      );

      wrapper.unmount();
    });
  });

  describe('Merge Tests', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      useSchedulerMock.mockReturnValue(schedulerMock);
      useLockMock.mockReturnValue(lockMock);
      useCanvasMock.mockReturnValue(canvasMock);
    });

    it('Merge Test Full Cross', () => {
      const firstCells = cellsGenerator(cellsMock, schedulerMock);
      const secondCells = cellsGenerator(cellsMock, schedulerMock);
      const emptyCells = cellsGenerator(cellsMock, schedulerMock);

      firstCells[5] = { ...firstCells[5], isSelected: true };
      firstCells[15] = { ...firstCells[15], isSelected: true };
      secondCells[4] = { ...secondCells[4], isSelected: true };
      secondCells[18] = { ...secondCells[18], isSelected: true };

      useCellMock
        .mockReturnValueOnce({
          ...cellsMock,
          cells: firstCells,
        })
        .mockReturnValueOnce({
          ...cellsMock,
          cells: secondCells,
        })
        .mockReturnValue({
          ...cellsMock,
          cells: emptyCells,
        });

      const wrapper = mount(<TimeBlockTesting {...fullTimeBlock} />, {
        wrappingComponent: TimeBlockProvider,
      });

      wrapper.update();

      expect(wrapper.find('#blocks').prop('defaultValue')).toEqual(
        JSON.stringify([
          {
            id: '1111',
            startTime: 14400000,
            endTime: 68400000,
            width: 98.57142857142856,
            height: 562.5,
            top: 230,
            left: 85,
            column: 0,
            isTemp: false,
            realStartTime: 14400000,
            realEndTime: 68400000,
          },
        ]),
      );

      wrapper.unmount();
    });

    it('Merge Test Nearby Cross', () => {
      useCanvasMock.mockReturnValue(canvasMock);

      const firstCells = cellsGenerator(cellsMock, schedulerMock);
      const secondCells = cellsGenerator(cellsMock, schedulerMock);
      const emptyCells = cellsGenerator(cellsMock, schedulerMock);

      firstCells[1] = { ...firstCells[1], isSelected: true };
      firstCells[5] = { ...firstCells[5], isSelected: true };
      secondCells[6] = { ...secondCells[6], isSelected: true };
      secondCells[9] = { ...secondCells[9], isSelected: true };

      useCellMock
        .mockReturnValueOnce({
          ...cellsMock,
          cells: firstCells,
        })
        .mockReturnValueOnce({
          ...cellsMock,
          cells: secondCells,
        })
        .mockReturnValue({
          ...cellsMock,
          cells: emptyCells,
        });

      const wrapper = mount(<TimeBlockTesting {...fullTimeBlock} />, {
        wrappingComponent: TimeBlockProvider,
      });

      wrapper.update();

      expect(wrapper.find('#blocks').prop('defaultValue')).toEqual(
        JSON.stringify([
          {
            id: '1111',
            startTime: 3600000,
            endTime: 36000000,
            width: 98.57142857142856,
            height: 337.5,
            top: 117.5,
            left: 85,
            column: 0,
            isTemp: false,
            realStartTime: 3600000,
            realEndTime: 36000000,
          },
        ]),
      );

      wrapper.unmount();
    });
  });

  it('History Tests', () => {
    useSchedulerMock.mockReturnValue(schedulerMock);
    useLockMock.mockReturnValue(lockMock);
    useCanvasMock.mockReturnValue(canvasMock);

    const cells = cellsGenerator(cellsMock, schedulerMock);
    useCellMock.mockReturnValue({
      ...cellsMock,
      cells,
    });

    const wrapper = mount(<TimeBlockTesting {...fullTimeBlock} />, {
      wrappingComponent: TimeBlockProvider,
    });
    const handle = wrapper.find('#handleHistory').hostNodes();
    const undo = wrapper.find('#undoHistory').hostNodes();

    expect(wrapper.find('#blocks').prop('defaultValue')).toEqual(
      JSON.stringify([]),
    );

    handle.simulate('click');
    wrapper.update();

    handle.simulate('click');
    wrapper.update();

    undo.simulate('click');

    expect(wrapper.find('#blocks').prop('defaultValue')).toEqual(
      JSON.stringify([
        {
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
        },
      ]),
    );

    wrapper.unmount();
  });

  describe('In-Out Tests', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      useLockMock.mockReturnValue(lockMock);
      useCanvasMock.mockReturnValue(canvasMock);

      const cells = cellsGenerator(cellsMock, schedulerMock);
      useCellMock.mockReturnValue({
        ...cellsMock,
        cells,
      });
    });

    it('Input with zero TZ', () => {
      useSchedulerMock.mockReturnValue({
        ...schedulerMock,
        defaultValue: scheduleGroup,
        requiredTZOffset: 0,
      });

      const wrapper = mount(<TimeBlockTesting {...fullTimeBlock} />, {
        wrappingComponent: TimeBlockProvider,
      });

      expect(wrapper.find('#blocks').prop('defaultValue')).toEqual(
        JSON.stringify([
          {
            startTime: 0,
            endTime: 15000,
            column: 0,
            id: '1111',
            realStartTime: 0,
            realEndTime: 15000,
            top: 80,
            left: 85,
            width: 98.57142857142856,
            height: 0.1527777777777778,
            isTemp: false,
          },
          {
            startTime: 0,
            endTime: 15000,
            column: 1,
            id: '1111',
            realStartTime: 0,
            realEndTime: 15000,
            top: 80,
            left: 216.42857142857142,
            width: 98.57142857142856,
            height: 0.1527777777777778,
            isTemp: false,
          },
        ]),
      );

      wrapper.unmount();
    });

    it('Input with non-zero TZ', () => {
      useSchedulerMock.mockReturnValue({
        ...schedulerMock,
        defaultValue: scheduleGroup,
        requiredTZOffset: -1000,
      });

      const wrapper = mount(<TimeBlockTesting {...fullTimeBlock} />, {
        wrappingComponent: TimeBlockProvider,
      });

      expect(wrapper.find('#blocks').prop('defaultValue')).toEqual(
        JSON.stringify([
          {
            startTime: 1000,
            endTime: 16000,
            column: 0,
            id: '1111',
            realStartTime: 1000,
            realEndTime: 16000,
            top: 80.01018518518518,
            left: 85,
            width: 98.57142857142856,
            height: 0.1527777777777778,
            isTemp: false,
          },
          {
            startTime: 1000,
            endTime: 16000,
            column: 1,
            id: '1111',
            realStartTime: 1000,
            realEndTime: 16000,
            top: 80.01018518518518,
            left: 216.42857142857142,
            width: 98.57142857142856,
            height: 0.1527777777777778,
            isTemp: false,
          },
        ]),
      );

      wrapper.unmount();
    });

    it('Output with zero TZ', () => {
      const onChange = jest.fn();

      useSchedulerMock.mockReturnValue({
        ...schedulerMock,
        defaultValue: scheduleGroup,
        requiredTZOffset: 0,
        onChange,
      });

      const wrapper = mount(<TimeBlockTesting {...fullTimeBlock} />, {
        wrappingComponent: TimeBlockProvider,
      });

      expect(onChange).toBeCalledTimes(3);
      expect(onChange).lastCalledWith([
        { endTime: 15000, mask: 3, startTime: 0 },
      ]);

      wrapper.unmount();
    });

    it('Output with non-zero TZ', () => {
      const onChange = jest.fn();

      useSchedulerMock.mockReturnValue({
        ...schedulerMock,
        defaultValue: scheduleGroup,
        requiredTZOffset: -5000,
        onChange,
      });

      const wrapper = mount(<TimeBlockTesting {...fullTimeBlock} />, {
        wrappingComponent: TimeBlockProvider,
      });

      expect(onChange).toBeCalledTimes(3);
      expect(onChange).lastCalledWith([
        { endTime: 15000, mask: 3, startTime: 0 },
      ]);

      wrapper.unmount();
    });
  });
});

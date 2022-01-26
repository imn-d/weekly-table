import { mount } from 'enzyme';
import React, { FC, useCallback, useState } from 'react';

import {
  CellsProps,
  HOUR_24,
  TIME,
  TimeBlock,
  TimeBlockProps,
} from '../../src/common';
import { useCustomTime } from '../../src/providers';
import * as uc from '../../src/providers/CellsProvider';
import CustomTimeProvider from '../../src/providers/CustomTimeProvider';
import * as ut from '../../src/providers/TimeBlockProvider';
import { timeBlockFirst } from '../helpers';

describe('CustomTime Provider', () => {
  const useCellMock = jest.spyOn(uc, 'useCells');
  const useTimeMock = jest.spyOn(ut, 'useTimeBlock');

  const setBlocks = jest.fn();

  const cellsMock = {
    millisPerPixel: HOUR_24 / (1000 - 120),
  } as CellsProps;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const timeMock = {
    blocks: [timeBlockFirst],
    setBlocks,
  } as TimeBlockProps;

  const CustomTimeTesting: FC = () => {
    const {
      isEditing,
      displayTime,
      isError,
      position,

      resetTime,
      setEditing,
      handleTime,
      updateBlock,
      handleObject,
    } = useCustomTime();

    const handleEditing = useCallback(() => {
      setEditing((isEditing) => !isEditing);
    }, []);

    const [updateResult, setUpdateResult] = useState<boolean>();

    const objectHandler = useCallback(() => {
      handleObject({
        id: '3',
        startTime: 300000,
        realStartTime: 300000,
        endTime: 900000,
        realEndTime: 900000,
        column: 1,
        left: 10,
        top: 10,
        height: 50,
        isTemp: false,
        width: 20,
      } as TimeBlock);
    }, []);

    return (
      <>
        <input id={'isEditing'} type={'checkbox'} defaultChecked={isEditing} />
        <input
          id={'startTime'}
          type={'time'}
          value={displayTime.startTime}
          onChange={(event) =>
            handleTime(event?.target?.valueAsNumber, TIME.START)
          }
        />
        <input
          id={'endTime'}
          type={'time'}
          value={displayTime.endTime}
          onChange={(event) =>
            handleTime(event?.target?.valueAsNumber, TIME.END)
          }
        />
        <input id={'positionTop'} type={'text'} defaultValue={position?.top} />
        <input
          id={'positionLeft'}
          type={'text'}
          defaultValue={position?.left}
        />
        <input id={'isError'} type={'text'} defaultValue={isError} />

        <input
          id={'updateResult'}
          type={'checkbox'}
          defaultChecked={updateResult}
        />
        <button id={'resetTime'} onClick={resetTime} />
        <button id={'setEditing'} onClick={handleEditing} />
        <button
          id={'updateBlock'}
          onClick={() => setUpdateResult(updateBlock())}
        />
        <button id={'handleObject'} onClick={objectHandler} />
      </>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Base Pipeline', async () => {
    useCellMock.mockReturnValue(cellsMock);
    useTimeMock.mockReturnValue(timeMock);

    const wrapper = mount(<CustomTimeTesting />, {
      wrappingComponent: CustomTimeProvider,
    });

    /**
     * Initial Values
     */
    let isEditing = wrapper.find('#isEditing').hostNodes();
    expect(isEditing.prop('defaultChecked')).toEqual(false);

    let startTime = wrapper.find('#startTime').hostNodes();
    expect(startTime.prop('value')).toEqual('00:00:00');

    let endTime = wrapper.find('#endTime').hostNodes();
    expect(endTime.prop('value')).toEqual('00:00:00');

    let posTop = wrapper.find('#positionTop').hostNodes();
    expect(posTop.prop('defaultValue')).toEqual(undefined);

    let posLeft = wrapper.find('#positionLeft').hostNodes();
    expect(posLeft.prop('defaultValue')).toEqual(undefined);

    let isError = wrapper.find('#isError').hostNodes();
    expect(isError.prop('defaultValue')).toEqual(undefined);

    /**
     * Handle Object Update Values
     */
    wrapper.find('#handleObject').hostNodes().simulate('click');

    startTime = wrapper.find('#startTime').hostNodes();
    expect(startTime.prop('value')).toEqual('00:05:00');

    endTime = wrapper.find('#endTime').hostNodes();
    expect(endTime.prop('value')).toEqual('00:15:00');

    posTop = wrapper.find('#positionTop').hostNodes();
    expect(posTop.prop('defaultValue')).toEqual(65);

    posLeft = wrapper.find('#positionLeft').hostNodes();
    expect(posLeft.prop('defaultValue')).toEqual(10);

    /**
     * setEditing Handler
     */
    wrapper.find('#setEditing').hostNodes().simulate('click');

    isEditing = wrapper.find('#isEditing').hostNodes();
    expect(isEditing.prop('defaultChecked')).toEqual(true);

    /**
     * Handle Time is NaN Branch
     */
    startTime.simulate('change', { target: { valueAsNumber: 'null' } });

    startTime = wrapper.find('#startTime').hostNodes();
    expect(startTime.prop('value')).toEqual('00:00:00');

    isError = wrapper.find('#isError').hostNodes();
    expect(isError.prop('defaultValue')).toEqual(undefined);

    /**
     * Handle Time Error
     */
    startTime.simulate('change', { target: { valueAsNumber: undefined } });

    startTime = wrapper.find('#startTime').hostNodes();
    expect(startTime.prop('value')).toEqual('00:00:00');

    isError = wrapper.find('#isError').hostNodes();
    expect(isError.prop('defaultValue')).toEqual('Time is null');

    /**
     * Handle Time Success
     */
    startTime.simulate('change', { target: { valueAsNumber: 5000000 } });
    endTime.simulate('change', { target: { valueAsNumber: 10000000 } });

    startTime = wrapper.find('#startTime').hostNodes();
    expect(startTime.prop('value')).toEqual('01:23:20');

    endTime = wrapper.find('#endTime').hostNodes();
    expect(endTime.prop('value')).toEqual('02:46:40');

    isError = wrapper.find('#isError').hostNodes();
    expect(isError.prop('defaultValue')).toEqual(undefined);

    /**
     * Reset Time
     */
    startTime.simulate('change', { target: { valueAsNumber: undefined } });

    isError = wrapper.find('#isError').hostNodes();
    expect(isError.prop('defaultValue')).toEqual('Time is null');

    wrapper.find('#resetTime').simulate('click');

    startTime = wrapper.find('#startTime').hostNodes();
    expect(startTime.prop('value')).toEqual('00:05:00');

    endTime = wrapper.find('#endTime').hostNodes();
    expect(endTime.prop('value')).toEqual('00:15:00');

    isError = wrapper.find('#isError').hostNodes();
    expect(isError.prop('defaultValue')).toEqual(undefined);

    /**
     * Update Block Error
     */
    startTime.simulate('change', { target: { valueAsNumber: 900000 - 1000 } });

    let updateResult = wrapper.find('#updateResult').hostNodes();
    expect(updateResult.prop('defaultChecked')).toEqual(undefined);

    const updateBlock = wrapper.find('#updateBlock').hostNodes();
    updateBlock.simulate('click');

    isError = wrapper.find('#isError').hostNodes();
    expect(isError.prop('defaultValue')).toEqual('Range < 1 min');

    updateResult = wrapper.find('#updateResult').hostNodes();
    expect(updateResult.prop('defaultChecked')).toEqual(true);

    /**
     * Update Block Success
     */
    startTime.simulate('change', { target: { valueAsNumber: 150000 } });
    updateBlock.simulate('click');

    isError = wrapper.find('#isError').hostNodes();
    expect(isError.prop('defaultValue')).toEqual(undefined);

    updateResult = wrapper.find('#updateResult').hostNodes();
    expect(updateResult.prop('defaultChecked')).toEqual(false);

    expect(setBlocks).toBeCalledTimes(1);
    expect(setBlocks).toBeCalledWith([
      {
        column: 0,
        endTime: 15000,
        realEndTime: 15000,
        realStartTime: 0,
        startTime: 0,
      },
      {
        column: 1,
        endTime: 900000,
        height: 51.52777777777778,
        id: '3',
        isTemp: false,
        left: 10,
        realEndTime: 900000,
        realStartTime: 150000,
        startTime: 150000,
        top: 8.472222222222221,
        width: 20,
      },
    ]);

    wrapper.unmount();
  });
});

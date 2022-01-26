import { mount } from 'enzyme';
import React from 'react';
import { act } from 'react-dom/test-utils';

import {
  CellsProps,
  CustomTimeProps,
  DisplayTime,
  Position,
  SchedulerProps,
} from '../../src/common';
import { CustomTime } from '../../src/components';
import * as uc from '../../src/providers/CellsProvider';
import * as ut from '../../src/providers/CustomTimeProvider';
import * as us from '../../src/providers/Scheduler';

describe('CustomTime Component', () => {
  const useSchedulerMock = jest.spyOn(us, 'useScheduler');
  const useCellMock = jest.spyOn(uc, 'useCells');
  const useCustomMock = jest.spyOn(ut, 'useCustomTime');

  const customMock = {
    isEditing: true,
    position: { top: 0, left: 0 } as Position,
    displayTime: {
      startTime: '00:00:00',
      endTime: '18:00:00',
    } as DisplayTime,
    handleTime: (newTime, type) => console.log(newTime, type),
    isError: undefined,
  } as CustomTimeProps;

  beforeEach(() => {
    jest.clearAllMocks();

    useSchedulerMock.mockReturnValue({
      baseZIndex: 0,
    } as SchedulerProps);

    useCellMock.mockReturnValue({
      widthStep: 20,
    } as CellsProps);
  });

  it('Base Render; no Error', () => {
    useCustomMock.mockReturnValueOnce(customMock);

    const wrapper = mount(<CustomTime />);

    expect(wrapper.find('#customTimeError').hostNodes()).toHaveLength(0);

    expect(useSchedulerMock).toBeCalledTimes(1);
    expect(useCellMock).toBeCalledTimes(1);
    expect(useCustomMock).toBeCalledTimes(1);

    expect(wrapper).toMatchSnapshot('baseRender');
    wrapper.unmount();
  });

  it('Display Error Test', () => {
    useCustomMock.mockReturnValueOnce({ ...customMock, isError: 'MY_ERROR' });

    const wrapper = mount(<CustomTime />);
    const errorSpan = wrapper.find('#customTimeError').hostNodes();
    expect(errorSpan).toHaveLength(1);
    expect(errorSpan).toMatchInlineSnapshot(`
      <span
        className="custom-time-error"
        id="customTimeError"
        style={
          Object {
            "position": "absolute",
            "top": 55,
            "width": 20,
          }
        }
      >
        MY_ERROR
      </span>
    `);
    wrapper.unmount();
  });

  it('Handle Time Test', async () => {
    const spyHandler = jest.fn().mockImplementation(() => Promise.resolve());
    useCustomMock.mockReturnValueOnce({
      ...customMock,
      handleTime: spyHandler,
    });

    const wrapper = mount(<CustomTime />);

    const startInput = wrapper.find('#customTimeInputStart').hostNodes();
    const endInput = wrapper.find('#customTimeInputEnd').hostNodes();

    expect(startInput).toHaveLength(1);
    expect(endInput).toHaveLength(1);

    expect(spyHandler).toBeCalledTimes(0);

    await act(async () => {
      startInput.simulate('change', {
        target: { valueAsNumber: 900000, id: 'customTimeInputStart' },
      });
      expect(spyHandler).toBeCalledWith(900000, true);
      endInput.simulate('change', {
        target: { valueAsNumber: 1500000, id: 'customTimeInputEnd' },
      });
      expect(spyHandler).toBeCalledWith(1500000, false);
    });
    expect(spyHandler).toBeCalledTimes(2);
    wrapper.unmount();
  });

  it('Display Test', async () => {
    useCustomMock.mockReturnValueOnce(customMock);

    let wrapper = mount(<CustomTime />);
    let parent = wrapper.find('#customTimeWrapper').hostNodes();
    expect(parent.props()?.style?.display).toBe('flex');

    wrapper.unmount();

    useCustomMock.mockReturnValueOnce({ ...customMock, isEditing: false });

    wrapper = mount(<CustomTime />);
    parent = wrapper.find('#customTimeWrapper').hostNodes();
    expect(parent.props()?.style?.display).toBe('none');

    wrapper.unmount();
  });
});

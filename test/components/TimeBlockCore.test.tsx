import { mount } from 'enzyme';
import React from 'react';

import {
  BlockColorsProps,
  CanvasProps,
  CustomTimeProps,
  HOUR_24,
  PopupProps,
  PopupType,
  SchedulerProps,
  TimeBlock,
} from '../../src/common';
import { TimeBlockCore } from '../../src/components';
import * as uc from '../../src/providers/CanvasProvider';
import * as ut from '../../src/providers/CustomTimeProvider';
import * as up from '../../src/providers/PopupProvider';
import * as us from '../../src/providers/Scheduler';

describe('TimeBlock Component', () => {
  const useSchedulerMock = jest.spyOn(us, 'useScheduler');
  const useTimeMock = jest.spyOn(ut, 'useCustomTime');
  const usePopupMock = jest.spyOn(up, 'usePopup');
  const useCanvasMock = jest.spyOn(uc, 'useCanvas');

  const timeBlock = {
    id: '1',
    isTemp: false,
    realStartTime: 100000,
    realEndTime: 200000,
    startTime: 100000,
    endTime: 200000,
    column: 1,
    top: 0,
    height: 100,
    left: 20,
    width: 50,
  } as TimeBlock;

  const schedulerMock = {
    baseZIndex: 0,
    blockColors: {
      hover: 'hover',
      common: 'common',
      temp: 'temp',
      draw: 'draw',
    } as BlockColorsProps,
  } as SchedulerProps;

  const canvasMock = {
    isDrawing: false,
  } as CanvasProps;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const popupMock = {
    popup: undefined,
    showPopup: jest.fn(),
    hidePopup: jest.fn(),
  } as PopupProps;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const timeMock = {
    isEditing: false,
    handleObject: jest.fn(),
  } as CustomTimeProps;

  beforeEach(() => {
    jest.clearAllMocks();
    useSchedulerMock.mockReturnValue(schedulerMock);
  });

  it('Base Render', () => {
    useCanvasMock.mockReturnValueOnce(canvasMock);
    usePopupMock.mockReturnValueOnce(popupMock);
    useTimeMock.mockReturnValueOnce(timeMock);

    const wrapper = mount(<TimeBlockCore {...timeBlock} />);
    expect(wrapper).toMatchSnapshot('baseRender');

    expect(useSchedulerMock).toBeCalledTimes(1);
    expect(useCanvasMock).toBeCalledTimes(1);
    expect(usePopupMock).toBeCalledTimes(1);
    expect(useTimeMock).toBeCalledTimes(1);
    wrapper.unmount();
  });

  it('Block Color Test', () => {
    useTimeMock.mockReturnValue(timeMock);

    useCanvasMock.mockReturnValueOnce(canvasMock);
    usePopupMock.mockReturnValueOnce(popupMock);

    let wrapper = mount(<TimeBlockCore {...timeBlock} />);
    expect(
      wrapper.find('#timeBlock').hostNodes().props()?.style?.backgroundColor,
    ).toBe('common');
    wrapper.unmount();

    useCanvasMock.mockReturnValueOnce(canvasMock);
    usePopupMock.mockReturnValueOnce({
      ...popupMock,
      popup: { id: '1' } as PopupType,
    });

    wrapper = mount(<TimeBlockCore {...timeBlock} />);
    expect(
      wrapper.find('#timeBlock').hostNodes().props()?.style?.backgroundColor,
    ).toBe('hover');
    wrapper.unmount();

    useCanvasMock.mockReturnValueOnce(canvasMock);
    usePopupMock.mockReturnValueOnce(popupMock);

    wrapper = mount(<TimeBlockCore {...{ ...timeBlock, isTemp: true }} />);
    expect(
      wrapper.find('#timeBlock').hostNodes().props()?.style?.backgroundColor,
    ).toBe('temp');
    wrapper.unmount();

    useCanvasMock.mockReturnValueOnce({ ...canvasMock, isDrawing: true });
    usePopupMock.mockReturnValueOnce(popupMock);

    wrapper = mount(<TimeBlockCore {...timeBlock} />);
    expect(
      wrapper.find('#timeBlock').hostNodes().props()?.style?.backgroundColor,
    ).toBe('draw');
    wrapper.unmount();
  });

  it('End Time Test', () => {
    useCanvasMock.mockReturnValueOnce(canvasMock);
    usePopupMock.mockReturnValueOnce(popupMock);
    useTimeMock.mockReturnValueOnce(timeMock);

    const wrapper = mount(
      <TimeBlockCore {...{ ...timeBlock, endTime: HOUR_24 }} />,
    );
    expect(wrapper.find('#timeBlock').hostNodes()).toMatchSnapshot(
      'display24Hour',
    );
    wrapper.unmount();
  });

  it('UX Test', () => {
    const showPopup = jest.fn();
    const handleObject = jest.fn();
    const hidePopup = jest.fn();

    useCanvasMock.mockReturnValueOnce(canvasMock);
    usePopupMock.mockReturnValueOnce({ ...popupMock, showPopup, hidePopup });
    useTimeMock.mockReturnValueOnce({ ...timeMock, handleObject });

    const wrapper = mount(<TimeBlockCore {...timeBlock} />);
    const block = wrapper.find('#timeBlock').hostNodes();

    expect(showPopup).toBeCalledTimes(0);
    expect(handleObject).toBeCalledTimes(0);
    expect(hidePopup).toBeCalledTimes(0);

    block.simulate('mouseenter');
    expect(showPopup).toBeCalledTimes(1);
    expect(handleObject).toBeCalledTimes(1);
    expect(hidePopup).toBeCalledTimes(0);

    block.simulate('mousemove');
    expect(showPopup).toBeCalledTimes(2);
    expect(handleObject).toBeCalledTimes(2);
    expect(hidePopup).toBeCalledTimes(0);

    block.simulate('mouseleave');
    expect(showPopup).toBeCalledTimes(2);
    expect(handleObject).toBeCalledTimes(2);
    expect(hidePopup).toBeCalledTimes(1);

    wrapper.unmount();
  });

  it('isEditing Test', () => {
    const showPopup = jest.fn();
    const handleObject = jest.fn();
    const hidePopup = jest.fn();

    useCanvasMock.mockReturnValueOnce(canvasMock);
    usePopupMock.mockReturnValueOnce({ ...popupMock, showPopup, hidePopup });
    useTimeMock.mockReturnValueOnce({
      ...timeMock,
      handleObject,
      isEditing: true,
    });

    const wrapper = mount(<TimeBlockCore {...timeBlock} />);
    const block = wrapper.find('#timeBlock').hostNodes();

    block.simulate('mouseleave');
    block.simulate('mouseenter');
    block.simulate('mousemove');

    expect(showPopup).toBeCalledTimes(0);
    expect(handleObject).toBeCalledTimes(0);
    expect(hidePopup).toBeCalledTimes(0);

    wrapper.unmount();
  });
});

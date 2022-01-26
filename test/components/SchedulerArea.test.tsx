import { mount } from 'enzyme';
import React from 'react';

import {
  CanvasProps,
  CustomTimeProps,
  PointerLockProps,
  PopupProps,
  SchedulerProps,
  TimeBlock,
  TimeBlockProps,
} from '../../src/common';
import { SchedulerArea } from '../../src/components';
import * as uc from '../../src/providers/CanvasProvider';
import * as uct from '../../src/providers/CustomTimeProvider';
import * as ul from '../../src/providers/PointerLockProvider';
import * as up from '../../src/providers/PopupProvider';
import * as us from '../../src/providers/Scheduler';
import * as ut from '../../src/providers/TimeBlockProvider';

describe('SchedulerArea Component', () => {
  const useSchedulerMock = jest.spyOn(us, 'useScheduler');
  const useCanvasMock = jest.spyOn(uc, 'useCanvas');
  const useTimeBlockMock = jest.spyOn(ut, 'useTimeBlock');
  const usePopupMock = jest.spyOn(up, 'usePopup');
  const usePointerMock = jest.spyOn(ul, 'usePointerLock');
  const useCustomMock = jest.spyOn(uct, 'useCustomTime');

  const canvasMock = {
    startDrawing: jest.fn(),
    finishDrawing: jest.fn(),
    draw: jest.fn(),
    canvasRef: { current: null },
    isDrawing: false,
  } as CanvasProps;

  beforeEach(() => {
    jest.clearAllMocks();

    useSchedulerMock.mockReturnValue({
      baseZIndex: 0,
    } as SchedulerProps);

    useTimeBlockMock.mockReturnValue({
      blocks: new Array<TimeBlock>(),
    } as TimeBlockProps);
  });

  it('Base Render', () => {
    useCanvasMock.mockReturnValueOnce(canvasMock);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    usePopupMock.mockReturnValueOnce({
      hidePopup: jest.fn(),
    } as PopupProps);

    usePointerMock.mockReturnValueOnce({
      isLocking: false,
    } as PointerLockProps);

    useCustomMock.mockReturnValueOnce({
      isEditing: false,
    } as CustomTimeProps);

    const wrapper = mount(<SchedulerArea />);

    expect(useSchedulerMock).toBeCalledTimes(1);
    expect(useCanvasMock).toBeCalledTimes(1);
    expect(useTimeBlockMock).toBeCalledTimes(1);
    expect(usePopupMock).toBeCalledTimes(1);
    expect(usePointerMock).toBeCalledTimes(1);
    expect(useCustomMock).toBeCalledTimes(1);

    expect(wrapper).toMatchSnapshot('baseRender');
    wrapper.unmount();
  });

  it('UX Test', () => {
    const startDrawing = jest.fn();
    const finishDrawing = jest.fn();
    const draw = jest.fn();
    const hidePopup = jest.fn();

    useCanvasMock.mockReturnValueOnce({
      startDrawing,
      finishDrawing,
      draw,
      canvasRef: { current: null },
      isDrawing: false,
    } as CanvasProps);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    usePopupMock.mockReturnValueOnce({
      hidePopup,
    } as PopupProps);

    usePointerMock.mockReturnValueOnce({
      isLocking: false,
    } as PointerLockProps);

    useCustomMock.mockReturnValueOnce({
      isEditing: false,
    } as CustomTimeProps);

    expect(hidePopup).toBeCalledTimes(0);

    const wrapper = mount(<SchedulerArea />);
    const canvas = wrapper.find('#schedulerArea').hostNodes();
    expect(canvas).toHaveLength(1);
    expect(hidePopup).toBeCalledTimes(1);

    canvas.simulate('mousedown');
    expect(startDrawing).toBeCalledTimes(1);

    canvas.simulate('mousemove');
    expect(draw).toBeCalledTimes(1);

    canvas.simulate('mouseup');
    expect(finishDrawing).toBeCalledTimes(1);

    canvas.simulate('mouseleave');
    expect(finishDrawing).toBeCalledTimes(2);

    wrapper.unmount();
  });

  it('Drawing Lock', () => {
    const startDrawing = jest.fn();

    useCanvasMock.mockReturnValueOnce({
      ...canvasMock,
      startDrawing,
      isDrawing: true,
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    usePopupMock.mockReturnValueOnce({
      hidePopup: jest.fn(),
    } as PopupProps);

    usePointerMock.mockReturnValueOnce({
      isLocking: true,
    } as PointerLockProps);

    useCustomMock.mockReturnValueOnce({
      isEditing: true,
    } as CustomTimeProps);

    const wrapper = mount(<SchedulerArea />);
    const canvas = wrapper.find('#schedulerArea').hostNodes();
    expect(canvas).toHaveLength(1);

    canvas.simulate('mousedown');
    expect(startDrawing).toBeCalledTimes(0);

    wrapper.unmount();
  });
});

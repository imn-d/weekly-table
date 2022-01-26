import { mount } from 'enzyme';
import React from 'react';

import {
  ACTION,
  CanvasProps,
  CellsProps,
  CustomTimeProps,
  PointerLockProps,
  PopupProps,
  PopupType,
  SchedulerProps,
  TimeBlock,
  TimeBlockProps,
} from '../../src/common';
import { Popup } from '../../src/components';
import * as ucn from '../../src/providers/CanvasProvider';
import * as uc from '../../src/providers/CellsProvider';
import * as uct from '../../src/providers/CustomTimeProvider';
import * as upl from '../../src/providers/PointerLockProvider';
import * as up from '../../src/providers/PopupProvider';
import * as us from '../../src/providers/Scheduler';
import * as ut from '../../src/providers/TimeBlockProvider';

describe('Popup Component', () => {
  const useSchedulerMock = jest.spyOn(us, 'useScheduler');
  const useCellMock = jest.spyOn(uc, 'useCells');
  const useTimeBlockMock = jest.spyOn(ut, 'useTimeBlock');
  const usePopupMock = jest.spyOn(up, 'usePopup');
  const useCustomMock = jest.spyOn(uct, 'useCustomTime');
  const useCanvasMock = jest.spyOn(ucn, 'useCanvas');
  const useLockMock = jest.spyOn(upl, 'usePointerLock');

  const setTopPositionMock = jest.fn();
  const setBotPositionMock = jest.fn();

  const showPopup = jest.fn();
  const hidePopup = jest.fn();
  const deleteBlock = jest.fn();

  const setEditing = jest.fn();
  const updateBlock = jest.fn();
  const resetTime = jest.fn();

  const startDrawing = jest.fn();
  const finishDrawing = jest.fn();
  const draw = jest.fn();

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

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const popupMock = {
    popup: { id: '1', block: timeBlock } as PopupType,
    showPopup,
    hidePopup,
    deleteBlock,
    isAllowing: true,
  } as PopupProps;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const customMock = {
    isEditing: false,
    setEditing,
    updateBlock,
    resetTime,
  } as CustomTimeProps;

  const canvasMock = {
    isDrawing: false,
  } as CanvasProps;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const lockMock = {
    moveRef: { current: null },
    resBotRef: { current: null },
    resTopRef: { current: null },
    startDrawing,
    finishDrawing,
    draw,
    isLocking: false,
  } as PointerLockProps;

  beforeEach(() => {
    jest.clearAllMocks();

    useSchedulerMock.mockReturnValue({ baseZIndex: 0 } as SchedulerProps);
    useCellMock.mockReturnValue({
      widthStep: 50,
      heightStep: 50,
    } as CellsProps);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    useTimeBlockMock.mockReturnValue({
      setTopPosition: setTopPositionMock,
      setBotPosition: setBotPositionMock,
    } as TimeBlockProps);
  });

  describe('Base Operations', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      usePopupMock.mockReturnValue(popupMock);
      useCustomMock.mockReturnValue(customMock);
      useCanvasMock.mockReturnValue(canvasMock);
      useLockMock.mockReturnValue(lockMock);
    });

    it('Base Render', () => {
      const wrapper = mount(<Popup />);

      expect(useSchedulerMock).toBeCalledTimes(1);
      expect(useCellMock).toBeCalledTimes(1);
      expect(useTimeBlockMock).toBeCalledTimes(1);
      expect(usePopupMock).toBeCalledTimes(1);
      expect(useCustomMock).toBeCalledTimes(1);
      expect(useCanvasMock).toBeCalledTimes(1);
      expect(useLockMock).toBeCalledTimes(1);

      expect(wrapper).toMatchSnapshot('baseRender');
      wrapper.unmount();
    });

    it('Wrapper Actions Default', () => {
      const wrapper = mount(<Popup />);
      const parentDiv = wrapper.find('#popupWrapper').hostNodes();

      expect(parentDiv).toHaveLength(1);
      expect(showPopup).toBeCalledTimes(0);
      expect(hidePopup).toBeCalledTimes(0);
      expect(finishDrawing).toBeCalledTimes(0);

      parentDiv.simulate('mouseenter');
      parentDiv.simulate('mousemove');
      expect(showPopup).toBeCalledTimes(1);
      expect(showPopup).toBeCalledWith('1');

      parentDiv.simulate('mouseleave');
      expect(hidePopup).toBeCalledTimes(1);
      expect(finishDrawing).toBeCalledTimes(1);

      wrapper.unmount();
    });

    it('Popup Top Default', () => {
      const wrapper = mount(<Popup />);
      const parentDiv = wrapper.find('#popupTop').hostNodes();

      expect(parentDiv).toHaveLength(1);
      expect(setTopPositionMock).toBeCalledTimes(0);
      expect(startDrawing).toBeCalledTimes(0);
      expect(finishDrawing).toBeCalledTimes(0);
      expect(draw).toBeCalledTimes(0);

      parentDiv.simulate('mousemove');
      expect(draw).toBeCalledTimes(1);

      parentDiv.simulate('mousedown');
      expect(startDrawing).toBeCalledTimes(1);
      expect(startDrawing).toBeCalledWith(ACTION.RESIZE_TOP);

      parentDiv.simulate('mouseup');
      expect(finishDrawing).toBeCalledTimes(1);
      expect(setTopPositionMock).toBeCalledTimes(1);
      expect(setTopPositionMock).toBeCalledWith(timeBlock, true);

      wrapper.unmount();
    });

    it('Popup Center Default', () => {
      const wrapper = mount(<Popup />);
      const parentDiv = wrapper.find('#popupCenter').hostNodes();

      expect(parentDiv).toHaveLength(1);
      expect(setTopPositionMock).toBeCalledTimes(0);
      expect(startDrawing).toBeCalledTimes(0);
      expect(finishDrawing).toBeCalledTimes(0);
      expect(draw).toBeCalledTimes(0);

      parentDiv.simulate('mousemove');
      expect(draw).toBeCalledTimes(1);

      parentDiv.simulate('mousedown');
      expect(startDrawing).toBeCalledTimes(1);
      expect(startDrawing).toBeCalledWith(ACTION.MOVE);

      parentDiv.simulate('mouseup');
      expect(finishDrawing).toBeCalledTimes(1);
      expect(setTopPositionMock).toBeCalledTimes(1);
      expect(setTopPositionMock).toBeCalledWith(timeBlock, false);

      wrapper.unmount();
    });

    it('Popup Bot Default', () => {
      const wrapper = mount(<Popup />);
      const parentDiv = wrapper.find('#popupBot').hostNodes();

      expect(parentDiv).toHaveLength(1);
      expect(setBotPositionMock).toBeCalledTimes(0);
      expect(startDrawing).toBeCalledTimes(0);
      expect(finishDrawing).toBeCalledTimes(0);
      expect(draw).toBeCalledTimes(0);

      parentDiv.simulate('mousemove');
      expect(draw).toBeCalledTimes(1);

      parentDiv.simulate('mousedown');
      expect(startDrawing).toBeCalledTimes(1);
      expect(startDrawing).toBeCalledWith(ACTION.RESIZE_BOT);

      parentDiv.simulate('mouseup');
      expect(finishDrawing).toBeCalledTimes(1);
      expect(setBotPositionMock).toBeCalledTimes(1);
      expect(setBotPositionMock).toBeCalledWith(timeBlock);

      wrapper.unmount();
    });
  });

  it('Null Render', () => {
    usePopupMock.mockReturnValueOnce({ ...popupMock, popup: undefined });
    useCustomMock.mockReturnValueOnce(customMock);
    useCanvasMock.mockReturnValueOnce(canvasMock);
    useLockMock.mockReturnValueOnce(lockMock);

    const wrapper = mount(<Popup />);
    expect(wrapper).toMatchInlineSnapshot(`<Popup />`);
    wrapper.unmount();
  });

  it('Wrapper Actions True', () => {
    usePopupMock.mockReturnValueOnce(popupMock);
    useCustomMock.mockReturnValueOnce({ ...customMock, isEditing: true });
    useCanvasMock.mockReturnValueOnce(canvasMock);
    useLockMock.mockReturnValueOnce({ ...lockMock, isLocking: true });

    const wrapper = mount(<Popup />);
    const parentDiv = wrapper.find('#popupWrapper').hostNodes();

    expect(parentDiv).toHaveLength(1);

    parentDiv.simulate('mouseenter');
    expect(showPopup).toBeCalledWith('1');

    parentDiv.simulate('mousemove');
    parentDiv.simulate('mouseleave');

    expect(showPopup).toBeCalledTimes(2);
    expect(hidePopup).toBeCalledTimes(0);
    expect(finishDrawing).toBeCalledTimes(0);

    wrapper.unmount();
  });

  describe('Popup Display Tests', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      useCanvasMock.mockReturnValue(canvasMock);
      useLockMock.mockReturnValue(lockMock);
    });

    it('Popup Top Display', () => {
      usePopupMock.mockReturnValueOnce(popupMock);
      useCustomMock.mockReturnValueOnce(customMock);

      let wrapper = mount(<Popup />);
      let parentDiv = wrapper.find('#popupTop').hostNodes();
      expect(parentDiv.props()?.style?.display).toBe('flex');
      wrapper.unmount();

      usePopupMock.mockReturnValueOnce(popupMock);
      useCustomMock.mockReturnValueOnce({ ...customMock, isEditing: true });

      wrapper = mount(<Popup />);
      parentDiv = wrapper.find('#popupTop').hostNodes();
      expect(parentDiv.props()?.style?.display).toBe('none');
      wrapper.unmount();

      usePopupMock.mockReturnValueOnce({ ...popupMock, isAllowing: false });
      useCustomMock.mockReturnValueOnce(customMock);

      wrapper = mount(<Popup />);
      parentDiv = wrapper.find('#popupTop').hostNodes();
      expect(parentDiv.props()?.style?.display).toBe('none');
      wrapper.unmount();
    });

    it('Popup Center Display', () => {
      usePopupMock.mockReturnValueOnce(popupMock);
      useCustomMock.mockReturnValueOnce(customMock);

      let wrapper = mount(<Popup />);
      let parentDiv = wrapper.find('#popupCenter').hostNodes();
      expect(parentDiv.props()?.style?.display).toBe('block');
      wrapper.unmount();

      usePopupMock.mockReturnValueOnce(popupMock);
      useCustomMock.mockReturnValueOnce({ ...customMock, isEditing: true });

      wrapper = mount(<Popup />);
      parentDiv = wrapper.find('#popupCenter').hostNodes();
      expect(parentDiv.props()?.style?.display).toBe('none');
      wrapper.unmount();

      usePopupMock.mockReturnValueOnce({ ...popupMock, isAllowing: false });
      useCustomMock.mockReturnValueOnce(customMock);

      wrapper = mount(<Popup />);
      parentDiv = wrapper.find('#popupCenter').hostNodes();
      expect(parentDiv.props()?.style?.display).toBe('none');
      wrapper.unmount();
    });

    it('Popup Bot Display', () => {
      usePopupMock.mockReturnValueOnce(popupMock);
      useCustomMock.mockReturnValueOnce(customMock);

      let wrapper = mount(<Popup />);
      let parentDiv = wrapper.find('#popupBot').hostNodes();
      expect(parentDiv.props()?.style?.display).toBe('flex');
      wrapper.unmount();

      usePopupMock.mockReturnValueOnce(popupMock);
      useCustomMock.mockReturnValueOnce({ ...customMock, isEditing: true });

      wrapper = mount(<Popup />);
      parentDiv = wrapper.find('#popupBot').hostNodes();
      expect(parentDiv.props()?.style?.display).toBe('none');
      wrapper.unmount();

      usePopupMock.mockReturnValueOnce({ ...popupMock, isAllowing: false });
      useCustomMock.mockReturnValueOnce(customMock);

      wrapper = mount(<Popup />);
      parentDiv = wrapper.find('#popupBot').hostNodes();
      expect(parentDiv.props()?.style?.display).toBe('none');
      wrapper.unmount();
    });
  });

  describe('Popup Right Tests', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      usePopupMock.mockReturnValue(popupMock);
      useCanvasMock.mockReturnValue(canvasMock);
    });

    it('Popup Right Display', () => {
      useCustomMock.mockReturnValue(customMock);
      useLockMock.mockReturnValueOnce(lockMock);

      let wrapper = mount(<Popup />);
      let parentDiv = wrapper.find('#popupRight').hostNodes();
      expect(parentDiv.props()?.style?.display).toBe('flex');
      wrapper.unmount();

      useLockMock.mockReturnValueOnce({ ...lockMock, isLocking: true });

      wrapper = mount(<Popup />);
      parentDiv = wrapper.find('#popupRight').hostNodes();
      expect(parentDiv.props()?.style?.display).toBe('none');
      wrapper.unmount();
    });

    it('Popup Right isEditing Test', () => {
      useCustomMock.mockReturnValueOnce(customMock);
      useLockMock.mockReturnValueOnce(lockMock);

      let wrapper = mount(<Popup />);
      let parentDiv = wrapper.find('#popupCheckIcon').hostNodes();
      expect(parentDiv).toHaveLength(0);
      wrapper.unmount();

      useCustomMock.mockReturnValueOnce({
        ...customMock,
        isEditing: true,
        updateBlock: jest
          .fn()
          .mockReturnValueOnce(false)
          .mockReturnValueOnce(true),
      });

      wrapper = mount(<Popup />);
      parentDiv = wrapper.find('#popupCheckIcon').hostNodes();
      expect(parentDiv).toHaveLength(1);

      expect(setEditing).toBeCalledTimes(0);
      parentDiv.simulate('click');
      expect(setEditing).toBeCalledTimes(1);
      expect(setEditing).toBeCalledWith(false);
      setEditing.mockClear();

      parentDiv.simulate('click');
      expect(setEditing).toBeCalledTimes(1);
      expect(setEditing).toBeCalledWith(true);

      wrapper.unmount();
    });

    it('Popup Right CEIcon Test', () => {
      useLockMock.mockReturnValueOnce(lockMock);
      useCustomMock.mockReturnValueOnce(customMock);

      const wrapper = mount(<Popup />);
      const parentDiv = wrapper.find('#popupCEIcon').hostNodes();
      expect(parentDiv).toHaveLength(1);

      expect(resetTime).toBeCalledTimes(0);
      expect(setEditing).toBeCalledTimes(0);

      parentDiv.simulate('click');
      expect(resetTime).toBeCalledTimes(1);
      expect(setEditing).toBeCalledTimes(1);
      wrapper.unmount();
    });

    it('Popup Right DeleteIcon Test', () => {
      useLockMock.mockReturnValueOnce(lockMock);
      useCustomMock.mockReturnValueOnce(customMock);

      const wrapper = mount(<Popup />);
      const parentDiv = wrapper.find('#popupDeleteIcon').hostNodes();
      expect(parentDiv).toHaveLength(1);

      expect(deleteBlock).toBeCalledTimes(0);

      parentDiv.simulate('click');
      expect(deleteBlock).toBeCalledTimes(1);
      expect(deleteBlock).toBeCalledWith('1');
      wrapper.unmount();
    });

    it('Popup Right DeleteIcon Visibility Test', () => {
      useLockMock.mockReturnValue(lockMock);
      useCustomMock.mockReturnValueOnce({ ...customMock, isEditing: false });

      let wrapper = mount(<Popup />);
      let parentDiv = wrapper.find('#popupDeleteIcon').hostNodes();
      expect(parentDiv.props()?.style?.display).toBe('block');
      wrapper.unmount();

      useCustomMock.mockReturnValueOnce({ ...customMock, isEditing: true });

      wrapper = mount(<Popup />);
      parentDiv = wrapper.find('#popupDeleteIcon').hostNodes();
      expect(parentDiv.props()?.style?.display).toBe('none');
      wrapper.unmount();
    });
  });
});

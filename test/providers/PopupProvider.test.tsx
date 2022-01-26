import { mount } from 'enzyme';
import React, { FC } from 'react';
import { act } from 'react-dom/test-utils';

import {
  ACTION,
  CellsProps,
  HOUR_24,
  PointerLockProps,
  TimeBlockProps,
} from '../../src/common';
import * as uc from '../../src/providers/CellsProvider';
import * as up from '../../src/providers/PointerLockProvider';
import PopupProvider, { usePopup } from '../../src/providers/PopupProvider';
import * as ut from '../../src/providers/TimeBlockProvider';
import { timeBlockFirst, timeBlockSecond } from '../helpers';

describe('Popup Provider', () => {
  const useCellMock = jest.spyOn(uc, 'useCells');
  const useLockMock = jest.spyOn(up, 'usePointerLock');
  const useTimeMock = jest.spyOn(ut, 'useTimeBlock');

  const setBlocks = jest.fn();
  const handleHistory = jest.fn();
  const undoHistory = jest.fn();

  const cellsMock = {
    millisPerPixel: HOUR_24 / (1000 - 120),
    msTime: 60 * 60 * 1000,
  } as CellsProps;

  const lockMock = {
    isLocking: false,
    movement: 0,
    action: ACTION.MOVE,
  } as PointerLockProps;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const timeMock = {
    blocks: [timeBlockFirst],
    setBlocks,
    handleHistory,
    undoHistory,
  } as TimeBlockProps;

  type TestInput = {
    blockId: string;
  };

  type Events = {
    type: string;
    callback: (event: KeyboardEvent) => void;
  };

  const PopupTesting: FC<TestInput> = ({ blockId }) => {
    const { isAllowing, popup, hidePopup, deleteBlock, showPopup } = usePopup();

    return (
      <div id={'wrap'}>
        <input
          id={'isAllowing'}
          type={'checkbox'}
          defaultChecked={isAllowing}
        />
        <input
          id={'popup'}
          type={'text'}
          defaultValue={JSON.stringify(popup)}
        />
        <button id={'hidePopup'} onClick={hidePopup} />
        <button id={'deleteBlock'} onClick={() => deleteBlock(blockId)} />
        <button id={'showPopup'} onClick={() => showPopup(blockId)} />
      </div>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useCellMock.mockReturnValue(cellsMock);
  });

  describe('isAllowing Test', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      useLockMock.mockReturnValue(lockMock);
    });

    it('isAllowing true', async () => {
      useTimeMock.mockReturnValue({
        ...timeMock,
        blocks: [
          {
            ...timeBlockFirst,
            id: '1',
            startTime: 0,
            endTime: 9000 + 60 * 60 * 1000,
          },
        ],
      });

      const wrapper = mount(<PopupTesting blockId={'1'} />, {
        wrappingComponent: PopupProvider,
      });

      let isAllowing = wrapper.find('#isAllowing').hostNodes();
      expect(isAllowing.prop('defaultChecked')).toEqual(true);

      wrapper.find('#showPopup').hostNodes().simulate('click');

      isAllowing = wrapper.find('#isAllowing').hostNodes();
      expect(isAllowing.prop('defaultChecked')).toEqual(true);

      wrapper.unmount();
    });

    it('isAllowing false', async () => {
      useTimeMock.mockReturnValue({
        ...timeMock,
        blocks: [
          { ...timeBlockFirst, id: '1', startTime: 8000, endTime: 8500 },
        ],
      });

      const wrapper = mount(<PopupTesting blockId={'1'} />, {
        wrappingComponent: PopupProvider,
      });

      let isAllowing = wrapper.find('#isAllowing').hostNodes();
      expect(isAllowing.prop('defaultChecked')).toEqual(true);

      wrapper.find('#showPopup').hostNodes().simulate('click');

      isAllowing = wrapper.find('#isAllowing').hostNodes();
      expect(isAllowing.prop('defaultChecked')).toEqual(false);

      wrapper.unmount();
    });
  });

  describe('Show and Hide Popup Test', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      useLockMock.mockReturnValue(lockMock);
      useTimeMock.mockReturnValue({
        ...timeMock,
        blocks: [{ ...timeBlockFirst, id: '1' }],
      });
    });

    it('Show Failed', () => {
      const wrapper = mount(<PopupTesting blockId={'2'} />, {
        wrappingComponent: PopupProvider,
      });

      wrapper.find('#showPopup').hostNodes().simulate('click');

      expect(
        wrapper.find('#popup').hostNodes().prop('defaultValue'),
      ).toBeUndefined();

      wrapper.unmount();
    });

    it('Show Success && Hide', () => {
      const wrapper = mount(<PopupTesting blockId={'1'} />, {
        wrappingComponent: PopupProvider,
      });

      wrapper.find('#showPopup').hostNodes().simulate('click');

      expect(wrapper.find('#popup').hostNodes().prop('defaultValue')).toEqual(
        JSON.stringify({
          id: '1',
          block: {
            startTime: 0,
            endTime: 15000,
            realStartTime: 0,
            realEndTime: 15000,
            column: 0,
            id: '1',
          },
        }),
      );

      wrapper.find('#hidePopup').hostNodes().simulate('click');
      expect(
        wrapper.find('#popup').hostNodes().prop('defaultValue'),
      ).toBeUndefined();

      wrapper.unmount();
    });
  });

  describe('DeleteBlock and Undo History Test', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      useLockMock.mockReturnValue(lockMock);
      useTimeMock.mockReturnValue({
        ...timeMock,
        blocks: [{ ...timeBlockFirst, id: '1' }, timeBlockSecond],
      });
    });

    it('Delete By Button', () => {
      const wrapper = mount(<PopupTesting blockId={'1'} />, {
        wrappingComponent: PopupProvider,
      });

      wrapper.find('#showPopup').hostNodes().simulate('click');
      expect(
        wrapper.find('#popup').hostNodes().prop('defaultValue'),
      ).toHaveLength(108);

      expect(setBlocks).toBeCalledTimes(0);
      expect(handleHistory).toBeCalledTimes(0);

      wrapper.find('#deleteBlock').hostNodes().simulate('click');

      expect(setBlocks).toBeCalledTimes(1);
      expect(setBlocks).toBeCalledWith([timeBlockSecond]);

      expect(handleHistory).toBeCalledTimes(1);
      expect(handleHistory).toBeCalledWith([timeBlockSecond]);

      expect(
        wrapper.find('#popup').hostNodes().prop('defaultValue'),
      ).toBeUndefined();

      wrapper.unmount();
    });

    it('Delete By HotKey', () => {
      const events: Events[] = [];
      jest
        .spyOn(document, 'addEventListener')
        .mockImplementation((type: string, callback: any) => {
          events.push({ type, callback });
        });

      const wrapper = mount(<PopupTesting blockId={'1'} />, {
        wrappingComponent: PopupProvider,
      });

      wrapper.find('#showPopup').hostNodes().simulate('click');
      expect(
        wrapper.find('#popup').hostNodes().prop('defaultValue'),
      ).toBeDefined();

      const handler = events.find((ev) => ev.type === 'keydown');

      act(() => {
        handler?.callback({ code: 'Delete', ctrlKey: false } as KeyboardEvent);
      });
      wrapper.update();

      expect(setBlocks).toBeCalledTimes(1);
      expect(setBlocks).toBeCalledWith([timeBlockSecond]);

      expect(handleHistory).toBeCalledTimes(1);
      expect(handleHistory).toBeCalledWith([timeBlockSecond]);

      expect(
        wrapper.find('#popup').hostNodes().prop('defaultValue'),
      ).toBeUndefined();

      wrapper.unmount();
    });

    it('Test Undo History Hotkey', () => {
      const events: Events[] = [];
      jest
        .spyOn(document, 'addEventListener')
        .mockImplementation((type: string, callback: any) => {
          events.push({ type, callback });
        });

      const wrapper = mount(<PopupTesting blockId={'1'} />, {
        wrappingComponent: PopupProvider,
      });

      wrapper.find('#showPopup').hostNodes().simulate('click');
      expect(
        wrapper.find('#popup').hostNodes().prop('defaultValue'),
      ).toBeDefined();

      const handler = events.find((ev) => ev.type === 'keydown');

      expect(undoHistory).toBeCalledTimes(0);

      act(() => {
        handler?.callback({ code: 'KeyZ', ctrlKey: true } as KeyboardEvent);
      });

      expect(undoHistory).toBeCalledTimes(1);

      wrapper.unmount();
    });
  });

  describe('Block Moving Test', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      useTimeMock.mockReturnValue({
        ...timeMock,
        blocks: [
          {
            ...timeBlockFirst,
            id: '1',
            top: 73,
            height: 110,
            realStartTime: 7200000, //2
            realEndTime: 18000000, //5
          },
          timeBlockSecond,
        ],
      });
    });

    it('Handle Move Test Leave from Area', () => {
      useLockMock.mockReturnValue({
        ...lockMock,
        isLocking: true,
        movement: -100,
        action: ACTION.MOVE,
      });

      const wrapper = mount(<PopupTesting blockId={'1'} />, {
        wrappingComponent: PopupProvider,
      });

      wrapper.find('#showPopup').hostNodes().simulate('click');
      expect(
        wrapper.find('#popup').hostNodes().prop('defaultValue'),
      ).toBeDefined();

      expect(setBlocks).toBeCalledTimes(0);

      wrapper.unmount();
    });

    it('Handle Move Test', () => {
      useLockMock.mockReturnValue({
        ...lockMock,
        isLocking: true,
        movement: -50,
        action: ACTION.MOVE,
      });

      const wrapper = mount(<PopupTesting blockId={'1'} />, {
        wrappingComponent: PopupProvider,
      });

      wrapper.find('#showPopup').hostNodes().simulate('click');
      expect(
        wrapper.find('#popup').hostNodes().prop('defaultValue'),
      ).toBeDefined();

      expect(setBlocks).toBeCalledTimes(1);
      expect(setBlocks).toBeCalledWith([
        timeBlockSecond,
        {
          id: '1',
          column: 0,
          realEndTime: 13090909.09090909,
          realStartTime: 2290909.090909091,
          startTime: 7200000,
          top: 23,
          endTime: 18000000,
          height: 110,
        },
      ]);

      wrapper.unmount();
    });

    it('Handle Resize Bot Test Leave From Area', () => {
      useLockMock.mockReturnValue({
        ...lockMock,
        isLocking: true,
        movement: 1500,
        action: ACTION.RESIZE_BOT,
      });

      const wrapper = mount(<PopupTesting blockId={'1'} />, {
        wrappingComponent: PopupProvider,
      });

      wrapper.find('#showPopup').hostNodes().simulate('click');
      expect(
        wrapper.find('#popup').hostNodes().prop('defaultValue'),
      ).toBeDefined();

      expect(setBlocks).toBeCalledTimes(0);

      wrapper.unmount();
    });

    it('Handle Resize Bot Test Not Allowed Timeframe', () => {
      useLockMock.mockReturnValue({
        ...lockMock,
        isLocking: true,
        movement: -100,
        action: ACTION.RESIZE_BOT,
      });

      const wrapper = mount(<PopupTesting blockId={'1'} />, {
        wrappingComponent: PopupProvider,
      });

      wrapper.find('#showPopup').hostNodes().simulate('click');
      expect(
        wrapper.find('#popup').hostNodes().prop('defaultValue'),
      ).toBeDefined();

      expect(setBlocks).toBeCalledTimes(0);

      wrapper.unmount();
    });

    it('Handle Resize Bot Test', () => {
      useLockMock.mockReturnValue({
        ...lockMock,
        isLocking: true,
        movement: 100,
        action: ACTION.RESIZE_BOT,
      });

      const wrapper = mount(<PopupTesting blockId={'1'} />, {
        wrappingComponent: PopupProvider,
      });

      wrapper.find('#showPopup').hostNodes().simulate('click');
      expect(
        wrapper.find('#popup').hostNodes().prop('defaultValue'),
      ).toBeDefined();

      expect(setBlocks).toBeCalledTimes(1);
      expect(setBlocks).toBeCalledWith([
        timeBlockSecond,
        {
          column: 0,
          startTime: 0,
          id: '1',
          endTime: 18000000,
          height: 210,
          realEndTime: 27818181.81818182,
          realStartTime: 7200000,
          top: 73,
        },
      ]);

      wrapper.unmount();
    });

    it('Handle Resize Top Test Leave From Area', () => {
      useLockMock.mockReturnValue({
        ...lockMock,
        isLocking: true,
        movement: -10000,
        action: ACTION.RESIZE_TOP,
      });

      const wrapper = mount(<PopupTesting blockId={'1'} />, {
        wrappingComponent: PopupProvider,
      });

      wrapper.find('#showPopup').hostNodes().simulate('click');
      expect(
        wrapper.find('#popup').hostNodes().prop('defaultValue'),
      ).toBeDefined();

      expect(setBlocks).toBeCalledTimes(0);

      wrapper.unmount();
    });

    it('Handle Resize Top Test Leave Not Allowed TimeFrame', () => {
      useLockMock.mockReturnValue({
        ...lockMock,
        isLocking: true,
        movement: 75,
        action: ACTION.RESIZE_TOP,
      });

      const wrapper = mount(<PopupTesting blockId={'1'} />, {
        wrappingComponent: PopupProvider,
      });

      wrapper.find('#showPopup').hostNodes().simulate('click');
      expect(
        wrapper.find('#popup').hostNodes().prop('defaultValue'),
      ).toBeDefined();

      expect(setBlocks).toBeCalledTimes(0);

      wrapper.unmount();
    });

    it('Handle Resize Top Test', () => {
      useLockMock.mockReturnValue({
        ...lockMock,
        isLocking: true,
        movement: 50,
        action: ACTION.RESIZE_TOP,
      });

      const wrapper = mount(<PopupTesting blockId={'1'} />, {
        wrappingComponent: PopupProvider,
      });

      wrapper.find('#showPopup').hostNodes().simulate('click');
      expect(
        wrapper.find('#popup').hostNodes().prop('defaultValue'),
      ).toBeDefined();

      expect(setBlocks).toBeCalledTimes(1);
      expect(setBlocks).toBeCalledWith([
        timeBlockSecond,
        {
          column: 0,
          endTime: 15000,
          id: '1',
          height: 60,
          realEndTime: 18000000,
          realStartTime: 12109090.90909091,
          startTime: 7200000,
          top: 123,
        },
      ]);

      wrapper.unmount();
    });
  });
});

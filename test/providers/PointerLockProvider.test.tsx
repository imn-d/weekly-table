import { mount } from 'enzyme';
import React, { FC } from 'react';

import { ACTION } from '../../src/common';
import PointerLockProvider, {
  usePointerLock,
} from '../../src/providers/PointerLockProvider';

describe('PointerLock Provider', () => {
  const reactMock = jest.spyOn(React, 'useRef');

  const rpl = jest.fn();
  const epl = jest.fn();

  const PointerLockTesting: FC = () => {
    const { draw, isLocking, movement, startDrawing, finishDrawing, action } =
      usePointerLock();

    return (
      <>
        <div
          id={'moveRef'}
          onMouseDown={() => startDrawing(ACTION.MOVE)}
          onMouseUp={() => finishDrawing()}
          onMouseMove={(event) => draw(event)}
        />
        <div
          id={'resBotRef'}
          onMouseDown={() => startDrawing(ACTION.RESIZE_BOT)}
          onMouseUp={() => finishDrawing()}
          onMouseMove={(event) => draw(event)}
        />
        <div
          id={'resTopRef'}
          onMouseDown={() => startDrawing(ACTION.RESIZE_TOP)}
          onMouseUp={() => finishDrawing()}
          onMouseMove={(event) => draw(event)}
        />
        <div id={'unknownAction'} onMouseDown={() => startDrawing(99)} />
        <input id={'isLocking'} type={'checkbox'} defaultChecked={isLocking} />
        <input id={'movement'} type={'number'} defaultValue={movement} />
        <input id={'action'} type={'number'} defaultValue={action} />
      </>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Base Pipeline', async () => {
    Object.assign(document, { exitPointerLock: epl });

    reactMock.mockReturnValue({ current: { requestPointerLock: rpl } });

    const wrapper = mount(<PointerLockTesting />, {
      wrappingComponent: PointerLockProvider,
    });

    let isLocking = wrapper.find('#isLocking').hostNodes();
    let movement = wrapper.find('#movement').hostNodes();
    let action = wrapper.find('#action').hostNodes();

    expect(isLocking.prop('defaultChecked')).toEqual(false);
    expect(movement.prop('defaultValue')).toEqual(0);
    expect(action.prop('defaultValue')).toEqual(ACTION.MOVE);

    /**
     * Draw without locking
     */
    wrapper
      .find('#resTopRef')
      .hostNodes()
      .simulate('mousemove', { nativeEvent: { movementY: 100 } });
    movement = wrapper.find('#movement').hostNodes();
    expect(movement.prop('defaultValue')).toEqual(0);

    /**
     * Actions Tests; Move
     */
    expect(rpl).toBeCalledTimes(0);
    expect(epl).toBeCalledTimes(0);

    wrapper.find('#moveRef').hostNodes().simulate('mousedown');

    action = wrapper.find('#action').hostNodes();
    isLocking = wrapper.find('#isLocking').hostNodes();
    expect(action.prop('defaultValue')).toEqual(ACTION.MOVE);
    expect(isLocking.prop('defaultChecked')).toEqual(true);

    expect(rpl).toBeCalledTimes(1);

    wrapper
      .find('#moveRef')
      .hostNodes()
      .simulate('mousemove', { nativeEvent: { movementY: 100 } });

    movement = wrapper.find('#movement').hostNodes();
    expect(movement.prop('defaultValue')).toEqual(100);

    wrapper.find('#moveRef').hostNodes().simulate('mouseup');

    isLocking = wrapper.find('#isLocking').hostNodes();
    expect(isLocking.prop('defaultChecked')).toEqual(false);

    expect(epl).toBeCalledTimes(1);

    rpl.mockClear();

    /**
     * ResizeBot
     */
    wrapper.find('#resBotRef').hostNodes().simulate('mousedown');

    action = wrapper.find('#action').hostNodes();
    isLocking = wrapper.find('#isLocking').hostNodes();
    expect(action.prop('defaultValue')).toEqual(ACTION.RESIZE_BOT);
    expect(isLocking.prop('defaultChecked')).toEqual(true);

    expect(rpl).toBeCalledTimes(1);

    wrapper.find('#resBotRef').hostNodes().simulate('mouseup');

    isLocking = wrapper.find('#isLocking').hostNodes();
    expect(isLocking.prop('defaultChecked')).toEqual(false);

    expect(epl).toBeCalledTimes(2);

    /**
     * ResizeTop
     */
    rpl.mockClear();

    wrapper.find('#resTopRef').hostNodes().simulate('mousedown');

    action = wrapper.find('#action').hostNodes();
    isLocking = wrapper.find('#isLocking').hostNodes();
    expect(action.prop('defaultValue')).toEqual(ACTION.RESIZE_TOP);
    expect(isLocking.prop('defaultChecked')).toEqual(true);

    expect(rpl).toBeCalledTimes(1);

    wrapper.find('#resTopRef').hostNodes().simulate('mouseup');

    isLocking = wrapper.find('#isLocking').hostNodes();
    expect(isLocking.prop('defaultChecked')).toEqual(false);

    expect(epl).toBeCalledTimes(3);

    /**
     * Unknown Action
     */
    rpl.mockClear();

    wrapper.find('#unknownAction').hostNodes().simulate('mousedown');

    isLocking = wrapper.find('#isLocking').hostNodes();
    expect(isLocking.prop('defaultChecked')).toEqual(false);

    expect(rpl).toBeCalledTimes(0);

    wrapper.unmount();
  });
});

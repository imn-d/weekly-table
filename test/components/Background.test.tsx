import { mount } from 'enzyme';
import React from 'react';

import { CellsProps, SchedulerProps } from '../../src/common';
import { Background } from '../../src/components';
import * as uc from '../../src/providers/CellsProvider';
import * as us from '../../src/providers/Scheduler';

describe('Background Component', () => {
  const useSchedulerMock = jest.spyOn(us, 'useScheduler');
  const useCellMock = jest.spyOn(uc, 'useCells');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Base Render', () => {
    useSchedulerMock.mockReturnValueOnce({
      helperWidthProp: 80,
      headerHeightProp: 80,
      baseZIndex: 0,
      bottomHeightProp: 20,
    } as SchedulerProps);

    useCellMock.mockReturnValueOnce({
      widthStep: 20,
      heightStep: 10,
      offsetHeight: 100,
      offsetWidth: 200,
    } as CellsProps);

    const wrapper = mount(<Background />);

    expect(useSchedulerMock).toBeCalledTimes(1);
    expect(useCellMock).toBeCalledTimes(1);

    expect(wrapper).toMatchSnapshot('baseRender');
    wrapper.unmount();
  });
});

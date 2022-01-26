import { mount } from 'enzyme';
import React from 'react';

import { CellsProps, SchedulerProps } from '../../src/common';
import { SchedulerHelper } from '../../src/components';
import * as uc from '../../src/providers/CellsProvider';
import * as us from '../../src/providers/Scheduler';

describe('SchedulerHelper Component', () => {
  const useSchedulerMock = jest.spyOn(us, 'useScheduler');
  const useCellMock = jest.spyOn(uc, 'useCells');

  beforeEach(() => {
    jest.clearAllMocks();

    useCellMock.mockReturnValue({
      offsetHeight: 20,
    } as CellsProps);
  });

  it('Base Render && Columns Count Test', () => {
    useSchedulerMock.mockReturnValueOnce({
      helperWidthProp: 100,
      rows: ['First', 'Second'],
      headerHeightProp: 50,
      bottomHeightProp: 50,
    } as SchedulerProps);

    const wrapper = mount(<SchedulerHelper />);

    expect(useSchedulerMock).toBeCalledTimes(1);
    expect(useCellMock).toBeCalledTimes(1);

    expect(wrapper).toMatchSnapshot('baseRender');
    expect(wrapper.find('#schedulerHelperRow').hostNodes()).toHaveLength(2);
    wrapper.unmount();
  });

  it('Rows Undefined', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    useSchedulerMock.mockReturnValueOnce({
      helperWidthProp: 100,
      rows: undefined,
      headerHeightProp: 50,
      bottomHeightProp: 50,
    } as SchedulerProps);

    const wrapper = mount(<SchedulerHelper />);
    expect(wrapper).toHaveLength(1);
    expect(wrapper.find('#schedulerHelperRow').hostNodes()).toHaveLength(0);
    wrapper.unmount();
  });
});

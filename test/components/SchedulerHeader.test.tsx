import { mount } from 'enzyme';
import React from 'react';

import {
  CellsProps,
  SchedulerColumnsProps,
  SchedulerProps,
} from '../../src/common';
import { SchedulerHeader } from '../../src/components';
import * as uc from '../../src/providers/CellsProvider';
import * as us from '../../src/providers/Scheduler';

describe('SchedulerHeader Component', () => {
  const useSchedulerMock = jest.spyOn(us, 'useScheduler');
  const useCellMock = jest.spyOn(uc, 'useCells');

  beforeEach(() => {
    jest.clearAllMocks();

    useCellMock.mockReturnValue({
      widthStep: 20,
    } as CellsProps);
  });

  it('Base Render && Columns Count Test', () => {
    useSchedulerMock.mockReturnValueOnce({
      headerHeightProp: 80,
      columns: new Array<SchedulerColumnsProps>(
        {
          weight: 1,
          full: 'First',
          short: 'F',
        },
        {
          weight: 2,
          full: 'Second',
          short: 'S',
        },
      ),
    } as SchedulerProps);

    const wrapper = mount(<SchedulerHeader />);

    expect(useSchedulerMock).toBeCalledTimes(1);
    expect(useCellMock).toBeCalledTimes(1);

    expect(wrapper).toMatchSnapshot('baseRender');
    expect(wrapper.find('#schedulerHeaderColumn').hostNodes()).toHaveLength(2);
    wrapper.unmount();
  });

  it('Columns Undefined', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    useSchedulerMock.mockReturnValueOnce({
      headerHeightProp: 80,
      columns: undefined,
    } as SchedulerProps);

    const wrapper = mount(<SchedulerHeader />);
    expect(wrapper).toHaveLength(1);
    expect(wrapper.find('#schedulerHeaderColumn').hostNodes()).toHaveLength(0);
    wrapper.unmount();
  });
});

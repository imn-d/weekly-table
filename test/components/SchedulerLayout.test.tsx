import { mount } from 'enzyme';
import React from 'react';

import {
  CellsProps,
  SchedulerProps,
  TimeBlock,
  TimeBlockProps,
} from '../../src/common';
import { SchedulerLayout } from '../../src/components';
import * as scArea from '../../src/components/SchedulerArea';
import * as scHeader from '../../src/components/SchedulerHeader';
import * as scHelper from '../../src/components/SchedulerHelper';
import * as tBlock from '../../src/components/TimeBlockCore';
import * as uc from '../../src/providers/CellsProvider';
import * as us from '../../src/providers/Scheduler';
import * as ut from '../../src/providers/TimeBlockProvider';

describe('SchedulerLayout Component', () => {
  const useSchedulerMock = jest.spyOn(us, 'useScheduler');
  const useCellMock = jest.spyOn(uc, 'useCells');
  const useTimeMock = jest.spyOn(ut, 'useTimeBlock');
  const schedulerArea = jest.spyOn(scArea, 'SchedulerArea');
  const schedulerHeader = jest.spyOn(scHeader, 'SchedulerHeader');
  const schedulerHelper = jest.spyOn(scHelper, 'SchedulerHelper');
  const schedulerBlock = jest.spyOn(tBlock, 'TimeBlockCore');

  beforeEach(() => {
    jest.clearAllMocks();

    useSchedulerMock.mockReturnValue({
      headerHeightProp: 80,
      helperWidthProp: 80,
      bottomHeightProp: 20,
      baseZIndex: 0,
    } as SchedulerProps);

    useCellMock.mockReturnValue({
      offsetHeight: 100,
      offsetWidth: 200,
    } as CellsProps);

    schedulerArea.mockReturnValue(<div id={'area'}>Area</div>);
    schedulerHeader.mockReturnValue(<div id={'header'}>Header</div>);
    schedulerHelper.mockReturnValue(<div id={'helper'}>Helper</div>);
    schedulerBlock.mockReturnValue(<div id={'block'}>Block</div>);
  });

  it('Base Render', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    useTimeMock.mockReturnValueOnce({
      blocks: undefined,
      preview: undefined,
    } as TimeBlockProps);

    const wrapper = mount(<SchedulerLayout />);

    expect(useSchedulerMock).toBeCalledTimes(1);
    expect(useCellMock).toBeCalledTimes(1);
    expect(useTimeMock).toBeCalledTimes(1);

    expect(wrapper).toMatchSnapshot('baseRender');
    expect(wrapper.find('#area').hostNodes()).toHaveLength(1);
    expect(wrapper.find('#header').hostNodes()).toHaveLength(1);
    expect(wrapper.find('#helper').hostNodes()).toHaveLength(1);
    expect(wrapper.find('#block').hostNodes()).toHaveLength(0);
    wrapper.unmount();
  });

  it('Time Blocks Count Test', () => {
    useTimeMock.mockReturnValueOnce({
      blocks: new Array<TimeBlock>(
        { id: '1', isTemp: false } as TimeBlock,
        { id: '2', isTemp: false } as TimeBlock,
      ),
      preview: new Array<TimeBlock>(
        { id: '1', isTemp: true } as TimeBlock,
        { id: '2', isTemp: true } as TimeBlock,
      ),
    } as TimeBlockProps);

    const wrapper = mount(<SchedulerLayout />);

    const blocks = wrapper.find('#block').hostNodes();
    expect(blocks).toHaveLength(4);
    wrapper.unmount();
  });
});

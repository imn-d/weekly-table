import { mount } from 'enzyme';
import React, { FC } from 'react';

import Scheduler, {
  ScheduleGroup,
  SchedulerColumnsProps,
  schedulerColumns,
  schedulerRows,
} from '../../src';
import { SchedulerProps } from '../../src/common';
import { useScheduler } from '../../src/providers';
import * as cp from '../../src/providers/CellsProvider';

describe('Scheduler Provider', () => {
  const cellsProviderMock = jest.spyOn(cp, 'default');

  const SchedulerTesting: FC = () => {
    const {
      parentRef,
      blockColors,
      headerHeightProp,
      helperWidthProp,
      bottomHeightProp,
      baseZIndex,
      timeframe,
      columns,
      rows,
      requiredTZOffset,
      defaultValue,
      onChange,
    } = useScheduler();
    return (
      <>
        <input
          id={'parentRef'}
          type={'text'}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          defaultValue={parentRef.current}
        />
        <input
          id={'blockColors'}
          type={'text'}
          defaultValue={JSON.stringify(blockColors)}
        />
        <input
          id={'headerHeightProp'}
          type={'number'}
          defaultValue={headerHeightProp}
        />
        <input
          id={'helperWidthProp'}
          type={'number'}
          defaultValue={helperWidthProp}
        />
        <input
          id={'bottomHeightProp'}
          type={'number'}
          defaultValue={bottomHeightProp}
        />
        <input id={'baseZIndex'} type={'number'} defaultValue={baseZIndex} />
        <input id={'timeframe'} type={'number'} defaultValue={timeframe} />

        <input
          id={'columns'}
          type={'text'}
          defaultValue={JSON.stringify(columns)}
        />
        <input id={'rows'} type={'text'} defaultValue={JSON.stringify(rows)} />

        <input
          id={'requiredTZOffset'}
          type={'number'}
          defaultValue={requiredTZOffset}
        />

        <input
          id={'defaultValue'}
          type={'text'}
          defaultValue={JSON.stringify(defaultValue)}
        />

        <input
          id={'onChangeTxt'}
          type={'text'}
          defaultValue={onChange?.toString()}
        />

        <button
          id={'onChangeBtn'}
          onClick={() =>
            onChange
              ? onChange([
                  {
                    startTime: 111,
                    endTime: 222,
                    mask: 50,
                  } as ScheduleGroup,
                ])
              : null
          }
        />
      </>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();

    cellsProviderMock.mockReturnValue(<SchedulerTesting />);
  });

  it('Default Values', async () => {
    const minProps = {
      parentRef: { current: 'MY_PARENT' },
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const wrapper = mount(<Scheduler {...minProps} />);

    expect(wrapper.find('#parentRef').prop('defaultValue')).toEqual(
      'MY_PARENT',
    );

    expect(wrapper.find('#blockColors').prop('defaultValue')).toEqual(
      JSON.stringify({
        common: '#ff5722',
        temp: '#c6a700',
        draw: '#ff8a50',
        hover: '#ff3d00',
      }),
    );

    expect(wrapper.find('#headerHeightProp').prop('defaultValue')).toEqual(80);
    expect(wrapper.find('#helperWidthProp').prop('defaultValue')).toEqual(80);
    expect(wrapper.find('#bottomHeightProp').prop('defaultValue')).toEqual(20);
    expect(wrapper.find('#baseZIndex').prop('defaultValue')).toEqual(0);
    expect(wrapper.find('#timeframe').prop('defaultValue')).toEqual(60);

    expect(wrapper.find('#columns').prop('defaultValue')).toEqual(
      JSON.stringify(schedulerColumns),
    );
    expect(wrapper.find('#rows').prop('defaultValue')).toEqual(
      JSON.stringify(schedulerRows),
    );
    expect(wrapper.find('#requiredTZOffset').prop('defaultValue')).toEqual(
      undefined,
    );
    expect(wrapper.find('#defaultValue').prop('defaultValue')).toEqual(
      undefined,
    );

    expect(wrapper.find('#onChangeTxt').prop('defaultValue')).toEqual(
      undefined,
    );

    wrapper.unmount();
  });

  it('Custom Input Values', async () => {
    const onChange = jest.fn();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const maxProps = {
      parentRef: { current: 'MY_PARENT_CUSTOM' },
      blockColors: {
        common: '#ff00ff',
        temp: '#ffff00',
        draw: '#00ff00',
        hover: '#0000ff',
      },
      headerHeightProp: 199,
      helperWidthProp: 177,
      bottomHeightProp: 122,
      baseZIndex: 89,
      timeframe: 15,
      columns: schedulerColumns.concat({
        short: 'NN',
        full: 'NEW',
        weight: 128,
      } as SchedulerColumnsProps),
      rows: schedulerRows.concat('NEW ROW'),
      requiredTZOffset: -9000,
      defaultValue: [
        {
          startTime: 888,
          endTime: 999,
          mask: 150,
        } as ScheduleGroup,
      ],
      onChange,
    } as SchedulerProps;

    const wrapper = mount(<Scheduler {...maxProps} />);

    expect(wrapper.find('#parentRef').prop('defaultValue')).toEqual(
      'MY_PARENT_CUSTOM',
    );

    expect(wrapper.find('#blockColors').prop('defaultValue')).toEqual(
      JSON.stringify({
        common: '#ff00ff',
        temp: '#ffff00',
        draw: '#00ff00',
        hover: '#0000ff',
      }),
    );

    expect(wrapper.find('#headerHeightProp').prop('defaultValue')).toEqual(199);
    expect(wrapper.find('#helperWidthProp').prop('defaultValue')).toEqual(177);
    expect(wrapper.find('#bottomHeightProp').prop('defaultValue')).toEqual(122);
    expect(wrapper.find('#baseZIndex').prop('defaultValue')).toEqual(89);
    expect(wrapper.find('#timeframe').prop('defaultValue')).toEqual(15);

    expect(wrapper.find('#columns').prop('defaultValue')).toEqual(
      JSON.stringify(
        schedulerColumns.concat({
          short: 'NN',
          full: 'NEW',
          weight: 128,
        } as SchedulerColumnsProps),
      ),
    );
    expect(wrapper.find('#rows').prop('defaultValue')).toEqual(
      JSON.stringify(schedulerRows.concat('NEW ROW')),
    );
    expect(wrapper.find('#requiredTZOffset').prop('defaultValue')).toEqual(
      -9000,
    );
    expect(wrapper.find('#defaultValue').prop('defaultValue')).toEqual(
      JSON.stringify([
        {
          startTime: 888,
          endTime: 999,
          mask: 150,
        } as ScheduleGroup,
      ]),
    );

    expect(wrapper.find('#onChangeTxt').prop('defaultValue')).toEqual(
      'function () {\n' +
        '        return fn.apply(this, arguments);\n' +
        '      }',
    );

    expect(onChange).toBeCalledTimes(0);
    wrapper.find('#onChangeBtn').simulate('click');

    expect(onChange).toBeCalledTimes(1);
    expect(onChange).toBeCalledWith([
      { endTime: 222, mask: 50, startTime: 111 },
    ]);

    wrapper.unmount();
  });
});

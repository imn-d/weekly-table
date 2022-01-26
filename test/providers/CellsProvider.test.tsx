import { mount } from 'enzyme';
import React, { FC, useCallback } from 'react';

import {
  Cell,
  HOUR_24,
  SchedulerProps,
  schedulerColumns,
} from '../../src/common';
import { useCells } from '../../src/providers';
import CellsProvider from '../../src/providers/CellsProvider';
import * as us from '../../src/providers/Scheduler';
import { cellsGenerator } from '../helpers';

describe('Cells Provider', () => {
  const useSchedulerMock = jest.spyOn(us, 'useScheduler');

  const schedulerMock = {
    parentRef: { current: { offsetWidth: 600, offsetHeight: 1000 } },
    timeframe: 60,
    columns: schedulerColumns,
    helperWidthProp: 100,
    headerHeightProp: 100,
    bottomHeightProp: 20,
  } as SchedulerProps;

  const CellsTesting: FC = () => {
    const {
      offsetWidth,
      offsetHeight,
      widthStep,
      heightStep,
      millisPerPixel,
      cells,
      setCells,
      msTime,
      maxCellIndex,
    } = useCells();

    const cellsHandler = useCallback(() => {
      setCells([{ position: { x: -10, y: -10, w: -10, h: -10 } } as Cell]);
    }, []);

    return (
      <>
        <input id={'offsetWidth'} type={'number'} defaultValue={offsetWidth} />
        <input
          id={'offsetHeight'}
          type={'number'}
          defaultValue={offsetHeight}
        />
        <input id={'widthStep'} type={'number'} defaultValue={widthStep} />
        <input id={'heightStep'} type={'number'} defaultValue={heightStep} />
        <input
          id={'millisPerPixel'}
          type={'number'}
          defaultValue={millisPerPixel}
        />
        <input id={'msTime'} type={'number'} defaultValue={msTime} />
        <input
          id={'maxCellIndex'}
          type={'number'}
          defaultValue={maxCellIndex}
        />
        <input id={'cell'} defaultValue={JSON.stringify(cells)} />

        <button id={'setCells'} onClick={cellsHandler} />
      </>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Base Pipeline', async () => {
    useSchedulerMock.mockReturnValue(schedulerMock);

    const wrapper = mount(<CellsTesting />, {
      wrappingComponent: CellsProvider,
    });

    expect(
      wrapper.find('#offsetWidth').hostNodes().prop('defaultValue'),
    ).toEqual(600);
    expect(
      wrapper.find('#offsetHeight').hostNodes().prop('defaultValue'),
    ).toEqual(1000);
    expect(wrapper.find('#widthStep').hostNodes().prop('defaultValue')).toEqual(
      (600 - 100) / 7,
    );
    expect(
      wrapper.find('#heightStep').hostNodes().prop('defaultValue'),
    ).toEqual((1000 - 120) / (1440 / 60));
    expect(
      wrapper.find('#millisPerPixel').hostNodes().prop('defaultValue'),
    ).toEqual(HOUR_24 / (1000 - 120));
    expect(wrapper.find('#msTime').hostNodes().prop('defaultValue')).toEqual(
      3600000,
    );
    expect(
      wrapper.find('#maxCellIndex').hostNodes().prop('defaultValue'),
    ).toEqual(23);

    const cells = cellsGenerator(
      { offsetWidth: 600, offsetHeight: 1000 },
      schedulerMock,
    );
    expect(wrapper.find('#cell').hostNodes().prop('defaultValue')).toEqual(
      JSON.stringify(cells),
    );
    expect(cells).toHaveLength(168);

    wrapper.find('#setCells').hostNodes().simulate('click');
    expect(wrapper.find('#cell').hostNodes().prop('defaultValue')).toEqual(
      JSON.stringify([{ position: { x: -10, y: -10, w: -10, h: -10 } }]),
    );

    wrapper.unmount();
  });
});

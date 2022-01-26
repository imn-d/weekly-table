import { mount } from 'enzyme';
import React, { FC } from 'react';

import { CellsProps, SchedulerProps } from '../../src/common';
import CanvasProvider, { useCanvas } from '../../src/providers/CanvasProvider';
import * as uc from '../../src/providers/CellsProvider';
import * as us from '../../src/providers/Scheduler';
import { cellsGenerator } from '../helpers';

describe('Canvas Provider', () => {
  const useSchedulerMock = jest.spyOn(us, 'useScheduler');
  const useCellMock = jest.spyOn(uc, 'useCells');

  const setCells = jest.fn();

  const schedulerMock = {
    headerHeightProp: 100,
    helperWidthProp: 100,
    bottomHeightProp: 20,
  } as SchedulerProps;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const cellsMock = {
    offsetWidth: 1000,
    offsetHeight: 600,
    cells: [],
    setCells,
  } as CellsProps;

  const CanvasTesting: FC = () => {
    const { canvasRef, startDrawing, finishDrawing, draw, isDrawing } =
      useCanvas();
    return (
      <>
        <canvas
          id={'schedulerArea'}
          className={'scheduler-area'}
          style={{
            position: 'absolute',
            zIndex: 4,
          }}
          onMouseDown={startDrawing}
          onMouseUp={finishDrawing}
          onMouseMove={draw}
          ref={canvasRef}
        />
        <button id={'isDraw'} disabled={isDrawing} />
      </>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useSchedulerMock.mockReturnValue(schedulerMock);
  });

  it('Base Pipeline', async () => {
    const cells = cellsGenerator(cellsMock, schedulerMock);
    useCellMock.mockReturnValue({
      ...cellsMock,
      cells: cells,
    });

    const expectedCells = cells.map((cell) => {
      if (cell.column < 2 && cell.row < 3) return { ...cell, isSelected: true };
      return cell;
    });

    const wrapper = mount(<CanvasTesting />, {
      wrappingComponent: CanvasProvider,
    });

    const canvas = wrapper.find('#schedulerArea').hostNodes();
    let isDrawButton = wrapper.find('#isDraw').hostNodes();
    expect(canvas).toHaveLength(1);
    expect(isDrawButton).toHaveLength(1);

    expect(setCells).toBeCalledTimes(0);
    expect(isDrawButton.props().disabled).toBe(false);
    canvas.simulate('mousedown', { nativeEvent: { offsetX: 10, offsetY: 10 } });

    isDrawButton = wrapper.find('#isDraw').hostNodes();
    expect(isDrawButton.props().disabled).toBe(true);

    canvas.simulate('mousemove', {
      nativeEvent: { offsetX: 250, offsetY: 150 },
    });

    expect(setCells).toBeCalledTimes(1);
    expect(setCells).toBeCalledWith(expectedCells);
    setCells.mockClear();

    canvas.simulate('mouseup', {
      nativeEvent: { offsetX: 249, offsetY: 151 },
    });

    expect(setCells).toBeCalledTimes(1);
    expect(setCells).toBeCalledWith(expectedCells);
    setCells.mockClear();

    isDrawButton = wrapper.find('#isDraw').hostNodes();
    expect(isDrawButton.props().disabled).toBe(false);

    /**
     * Reversed cell
     */
    canvas.simulate('mousedown', {
      nativeEvent: { offsetX: 250, offsetY: 150 },
    });
    canvas.simulate('mouseup', {
      nativeEvent: { offsetX: 10, offsetY: 10 },
    });
    expect(setCells).toBeCalledTimes(1);
    expect(setCells).toBeCalledWith(expectedCells);
    setCells.mockClear();

    /**
     * Minimum cell grid
     */
    canvas.simulate('mousedown', {
      nativeEvent: { offsetX: -50, offsetY: -150 },
    });
    canvas.simulate('mouseup', {
      nativeEvent: { offsetX: 10, offsetY: 10 },
    });
    expect(setCells).toBeCalledTimes(1);
    expect(setCells).toBeCalledWith(
      cells.map((cell) =>
        cell.column === 0 && cell.row === 0
          ? { ...cell, isSelected: true }
          : cell,
      ),
    );
    setCells.mockClear();

    /**
     * Maximum cell grid
     */
    canvas.simulate('mousedown', {
      nativeEvent: { offsetX: 2000, offsetY: 2000 },
    });
    canvas.simulate('mouseup', {
      nativeEvent: { offsetX: 1000, offsetY: 600 },
    });
    expect(setCells).toBeCalledTimes(1);
    expect(setCells).toBeCalledWith(
      cells.map((cell) =>
        cell.column === 6 && cell.row === 23
          ? { ...cell, isSelected: true }
          : cell,
      ),
    );
    wrapper.unmount();
  });
});

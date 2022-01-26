import { mount } from 'enzyme';
import React from 'react';

import {
  CancelIcon,
  CheckIcon,
  DeleteIcon,
  DragIcon,
  EditIcon,
} from '../src/assests';

describe('Assets Components', () => {
  it('Base Render', () => {
    const cancelIcon = mount(<CancelIcon />);
    expect(cancelIcon).toBeDefined();
    expect(cancelIcon).toHaveLength(1);
    cancelIcon.unmount();

    const checkIcon = mount(<CheckIcon />);
    expect(checkIcon).toBeDefined();
    expect(checkIcon).toHaveLength(1);
    checkIcon.unmount();

    const deleteIcon = mount(<DeleteIcon />);
    expect(deleteIcon).toBeDefined();
    expect(deleteIcon).toHaveLength(1);
    deleteIcon.unmount();

    const dragIcon = mount(<DragIcon />);
    expect(dragIcon).toBeDefined();
    expect(dragIcon).toHaveLength(1);
    dragIcon.unmount();

    const editIcon = mount(<EditIcon />);
    expect(editIcon).toBeDefined();
    expect(editIcon).toHaveLength(1);
    editIcon.unmount();
  });
});

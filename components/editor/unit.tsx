import React from 'react';

import { useDrag } from 'react-dnd';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as t from '../../database/types.d';
import TextInput from './text_input';
import NumberInput from './number_input';
import * as Actions from '../../lib/actions';

interface Props {
  unit: t.Unit;
}

function Unit({ unit, updateUnitName, updateUnitPax }: Props & PropsFromRedux) {
  const [{ opacity }, dragRef] = useDrag({
    item: { type: 'Unit', id: unit.id },
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.5 : 1,
    }),
  });

  const onChange = (value: number) => updateUnitPax({ id: unit.id, value });

  return (
    <div
      className="border border-gray-600 rounded shadow p-2 my-2 flex"
      ref={dragRef}
      style={{ opacity }}
    >
      <div className="cursor-move">
        <FontAwesomeIcon icon="grip-vertical" className="text-gray-400 mr-2" />
      </div>
      <div className="flex-grow">
        <TextInput id={unit.id} value={unit.name} action={updateUnitName} />
        <div className="inline">
          <span className="text-gray-700 font-bold pr-1">Passagers&nbsp;:</span>
          <NumberInput onChange={onChange} value={unit.pax} />
        </div>
      </div>
    </div>
  );
}

const connector = connect(null, {
  updateUnitName: Actions.updateUnitName,
  updateUnitPax: Actions.updateUnitPax,
});

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Unit);

import React from 'react';

import { useDrag } from 'react-dnd';
import * as t from '../../database/types.d';

interface Props {
  unit: t.Unit;
}

function Unit({ unit }: Props) {
  const [{ opacity }, dragRef] = useDrag({
    item: { type: 'Unit', id: unit.id },
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.5 : 1,
    }),
  });
  return (
    <div className="border p-2 my-2" ref={dragRef} style={{ opacity }}>
      <span>{unit.name}</span>
      <span className="px-1">{`${unit.pax} pax`}</span>
    </div>
  );
}

export default Unit;

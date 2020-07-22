import React from 'react';

import { connect, ConnectedProps } from 'react-redux';
import { useDrop } from 'react-dnd';
import * as Actions from '../../lib/actions';
import * as t from '../../database/types.d';

interface Props extends PropsFromRedux {
  car: t.Car;
}

function Car(props: Props) {
  const { car, units, appendUnit, updateCarName } = props;
  const [, drop] = useDrop<{ type: string; id: string }, void, any>({
    accept: 'Unit',
    drop: ({ id }) => {
      appendUnit({ carId: car.id, unitId: id });
    },
  });

  const onChange = (event) =>
    updateCarName({
      id: car.id,
      name: event.target.value,
    });

  return (
    <div className="border p-2 my-2">
      <input
        className="font-normal focus:font-bold hover:font-bold border"
        value={car.name}
        type="text"
        onChange={onChange}
      />
      <h4 className="font-medium">Unités</h4>
      <ul className="border p-2" ref={drop}>
        {car.units.map(({ id, count }) => (
          <li key={id}>
            {units.find((u) => u.id === id).name}
            {`(× ${count})`}
          </li>
        ))}
      </ul>
    </div>
  );
}

const mapStateToProps = ({ units }: { units: t.Unit[] }) => ({ units });
const connector = connect(mapStateToProps, {
  updateCarName: Actions.updateCarName,
  appendUnit: Actions.appendUnit,
});

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Car);

import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect, ConnectedProps } from 'react-redux';
import * as Actions from '../../lib/actions';
import * as t from '../../database/types.d';
import Car from './car';

interface Props extends PropsFromRedux {
  cars: t.Car[];
}

function CarList({ cars, createCar }: Props) {
  return (
    <div>
      <button
        type="button"
        className="btn btn-blue"
        onClick={() => createCar()}
      >
        <FontAwesomeIcon icon="plus-square" />
        Nouveau
      </button>
      {cars.map((car) => (
        <Car key={car.id} car={car} />
      ))}
    </div>
  );
}

const carsMapSateToProps = ({ cars }) => ({ cars });
const connector = connect(carsMapSateToProps, { createCar: Actions.createCar });
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(CarList);

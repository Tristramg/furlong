import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import * as Actions from '../../lib/actions';
import * as t from '../../database/types.d';
import Car from './car';
import Add from './add';

interface Props {
  cars: t.Car[];
}

function CarList({ cars, createCar }: Props & PropsFromRedux) {
  return (
    <div>
      <Add action={createCar} />
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

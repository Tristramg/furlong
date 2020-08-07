import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useDrop } from 'react-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';

import * as t from '../../database/types.d';
import * as Actions from '../../lib/actions';
import TextInput from './text_input';
import NumberInput from './number_input';

function Train({
  units,
  train,
  cars,
  appendCar,
  updateTrainName,
  updateTrainCarCount,
  deleteTrainCar,
}: { train: t.Train } & PropsFromRedux) {
  const [{ display, opacity }, drop] = useDrop<
    { type: string; id: string },
    void,
    any
  >({
    accept: 'Car',
    drop: ({ id }) => {
      appendCar({ trainId: train.id, carId: id });
    },
    collect: (monitor) => ({
      display: monitor.canDrop() ? 'block' : 'none',
      opacity: monitor.canDrop() ? 0.5 : 1,
    }),
  });

  const onChangeCount = (carId: string) => (value: number) => {
    updateTrainCarCount({ carId, trainId: train.id, value });
  };

  const unitPax = (unitId: string): number =>
    units.find((u: t.Unit) => u.id === unitId).pax;

  const carPax = (carId: string): number => {
    const carUnits = cars.find((c: t.Car) => c.id === carId).units;
    return _.sumBy(carUnits, ({ id, count }) => unitPax(id) * count);
  };

  const carPrice = (carId: string): number => {
    const carUnits = cars.find((c: t.Car) => c.id === carId).units;
    return _.sumBy(carUnits, ({ count, price }) => count * price);
  };

  const carWeight = (carId: string): number =>
    cars.find((c: t.Car) => c.id === carId).weight;

  return (
    <div className="border rounded border-gray-600 shadow p-2 my-2 relative">
      <div
        className="absolute border-4 border-dotted m-auto p-0 left-0 right-0 w-24 h-24 top-0 bottom-0 border-gray-600 center align-middle"
        style={{ display }}
      >
        <FontAwesomeIcon
          className="absolute m-auto left-0 right-0 top-0 bottom-0 text-gray-600"
          icon="plus"
          size="4x"
        />
      </div>
      <div style={{ opacity }}>
        <TextInput id={train.id} value={train.name} action={updateTrainName} />

        <div className="pt-3">
          <dl className="grid grid-cols-2 m-1">
            <dt className="text-gray-700 font-bold">Capacité max</dt>
            <dd>
              {_.sumBy(train.cars, ({ id, count }) => carPax(id) * count)}
            </dd>

            <dt className="text-gray-700 font-bold">Chiffre d’affaires max</dt>
            <dd>
              {_.sumBy(train.cars, ({ id, count }) => carPrice(id) * count)}
            </dd>

            <dt className="text-gray-700 font-bold">Masse (t)</dt>
            <dd>
              {_.sumBy(train.cars, ({ id, count }) => carWeight(id) * count)}
            </dd>
          </dl>
        </div>

        <h4 className="font-medium pt-3">Voitures</h4>
        <ul className="border rounded p-2" ref={drop}>
          {train.cars.map(({ id, count }) => (
            <li>
              <div className="flex inline py-2">
                <span className="w-1/4">
                  {cars.find((u) => u.id === id).name}
                </span>
                <div className="w-1/4">
                  <span className="text-gray-700 font-bold pr-1">&nbsp;×</span>
                  <NumberInput onChange={onChangeCount(id)} value={count} />
                </div>
                <div className="w-1/4 text-right" />
                <div className="w-1/4 text-right">
                  <button
                    type="button"
                    onClick={() => {
                      deleteTrainCar({ carId: id, trainId: train.id });
                    }}
                  >
                    <FontAwesomeIcon icon="trash" className="text-gray-400" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const connector = connect(
  ({ cars, units }: { units: t.Unit[]; cars: t.Car[] }) => ({ cars, units }),
  {
    updateTrainName: Actions.updateTrainName,
    appendCar: Actions.appendCar,
    updateTrainCarCount: Actions.updateTrainCarCount,
    deleteTrainCar: Actions.deleteTrainCar,
  }
);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Train);

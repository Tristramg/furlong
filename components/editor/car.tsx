import React from 'react';

import { connect, ConnectedProps } from 'react-redux';
import { useDrop, useDrag } from 'react-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';
import * as Actions from '../../lib/actions';
import * as t from '../../database/types.d';
import TextInput from './text_input';
import NumberInput from './number_input';

interface Props {
  car: t.Car;
}

type DropType = { type: string; id: string };

function Car({
  car,
  units,
  appendUnit,
  updateCarName,
  updateCarUnitCount,
  updateCarUnitPrice,
  deleteCarUnit,
  updateCarWeight,
}: Props & PropsFromRedux) {
  const [{ display, collectOpacity }, drop] = useDrop<DropType, void, any>({
    accept: 'Unit',
    drop: ({ id }) => {
      appendUnit({ carId: car.id, unitId: id });
    },
    collect: (monitor) => ({
      display: monitor.canDrop() ? 'block' : 'none',
      collectOpacity: monitor.canDrop() ? 0.5 : 1,
    }),
  });

  const [{ opacity }, dragRef] = useDrag({
    item: { type: 'Car', id: car.id },
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.5 : 1,
    }),
  });

  const onChangeCount = (unitId: string) => (value: number) => {
    updateCarUnitCount({ value, id: car.id, unitId });
  };

  const onChangePrice = (unitId: string) => (value: number) => {
    updateCarUnitPrice({ value, id: car.id, unitId });
  };

  return (
    <div
      className="border border-gray-600 p-2 my-2 shadow rounded flex relative"
      ref={dragRef}
      style={{ opacity }}
    >
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
      <div className="cursor-move">
        <FontAwesomeIcon icon="grip-vertical" className="text-gray-400 mr-2" />
      </div>
      <div className="flex-grow" ref={drop} style={{ opacity: collectOpacity }}>
        <TextInput id={car.id} value={car.name} action={updateCarName} />
        <div className="inline">
          <span className="text-gray-700 font-bold pr-1">Masse&nbsp;:</span>
          <NumberInput
            value={car.weight}
            onChange={(value) => updateCarWeight({ id: car.id, value })}
          />
          <span>t</span>
        </div>

        <div className="pt-3">
          <dl className="grid grid-cols-2 m-1">
            <dt className="text-gray-700 font-bold">Capacité max</dt>
            <dd>
              {_.sumBy(
                car.units,
                (unit) => unit.count * units.find((u) => u.id === unit.id).pax
              )}
            </dd>

            <dt className="text-gray-700 font-bold">Chiffre d’affaires max</dt>
            <dd>{_.sumBy(car.units, (unit) => unit.count * unit.price)}</dd>
          </dl>
        </div>

        <h4 className="font-medium pt-3">Unités</h4>
        <ul className="border rounded p-2">
          {car.units.map(({ id, count, price }) => (
            <li key={id}>
              <div className="inline flex w-full py-2">
                <span className="w-3/12">
                  {units.find((u) => u.id === id).name}
                </span>
                <div className="w-3/12">
                  <span className="text-gray-700 font-bold pr-1">&nbsp;×</span>
                  <NumberInput onChange={onChangeCount(id)} value={count} />
                </div>
                <div className="w-5/12">
                  <NumberInput onChange={onChangePrice(id)} value={price} />
                  <span className="text-gray-700 font-bold pr-1">
                    &nbsp;€/unité
                  </span>
                </div>
                <div className="w-1/12 text-right">
                  <button
                    type="button"
                    onClick={() => deleteCarUnit({ carId: car.id, unitId: id })}
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

const mapStateToProps = ({ units }: { units: t.Unit[] }) => ({ units });
const connector = connect(mapStateToProps, {
  updateCarName: Actions.updateCarName,
  updateCarWeight: Actions.updateCarWeight,
  appendUnit: Actions.appendUnit,
  updateCarUnitCount: Actions.updateCarUnitCount,
  updateCarUnitPrice: Actions.updateCarUnitPrice,
  deleteCarUnit: Actions.deleteCarUnit,
});

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Car);

import { createReducer } from '@reduxjs/toolkit';
import _ from 'lodash';
import * as actions from '../lib/actions';
import * as t from './types.d';

const initialState: t.State = {
  units: [
    {
      name: 'Siège',
      pax: 1,
      id: '0',
    },
    {
      name: 'Cabine',
      pax: 2,
      id: '1',
    },
  ],
  cars: [
    {
      name: 'Passager',
      id: _.uniqueId(),
      weight: 45,
      units: [
        { id: '0', count: 10, price: 100 },
        { id: '1', count: 5, price: 150 },
      ],
    },
  ],
  trains: [
    {
      name: 'Super train',
      cars: [],
      id: _.uniqueId(),
    },
  ],
};

function update(set: any[], id: string, prop: string, value: string) {
  const index = set.findIndex((unit) => unit.id === id);
  if (index !== -1) {
    const element = set[index];
    element[prop] = value;
  }
}

const reducer = createReducer(initialState, {
  [actions.appendUnit.type]: (state, { payload }) => {
    const { carId, unitId } = payload;
    const carIndex = state.cars.findIndex((c) => c.id === carId);
    const { units } = state.cars[carIndex];
    const index = units.findIndex((u) => u.id === unitId);
    if (index === -1) {
      units.push({ id: unitId, count: 1, price: 100 });
    } else {
      units[index].count += 1;
    }
  },
  [actions.updateCarName.type]: (state, { payload }) => {
    update(state.cars, payload.id, 'name', payload.name);
  },
  [actions.updateUnitName.type]: (state, { payload }) => {
    update(state.units, payload.id, 'name', payload.name);
  },
  [actions.updateUnitPax.type]: (state, { payload }) => {
    update(state.units, payload.id, 'pax', payload.value);
  },
  [actions.createCar.type]: (state) => {
    state.cars.push({
      name: '',
      weight: 45,
      units: [],
      id: _.uniqueId(),
    });
  },
  [actions.createUnit.type]: (state) => {
    state.units.push({
      name: '',
      pax: 1,
      id: _.uniqueId(),
    });
  },
  [actions.updateCarWeight.type]: (state, { payload }) => {
    update(state.cars, payload.id, 'weight', payload.value);
  },
  [actions.updateCarUnitCount.type]: (state, { payload }) => {
    const index = state.cars.findIndex((car) => car.id === payload.id);
    if (index !== -1) {
      const car = state.cars[index];
      update(car.units, payload.unitId, 'count', payload.value);
    }
  },
  [actions.updateCarUnitPrice.type]: (state, { payload }) => {
    const index = state.cars.findIndex((car) => car.id === payload.id);
    if (index !== -1) {
      const car = state.cars[index];
      update(car.units, payload.unitId, 'price', payload.value);
    }
  },
  [actions.deleteCarUnit.type]: (state, { payload }) => {
    const index = state.cars.findIndex((car) => car.id === payload.carId);
    if (index !== -1) {
      const car = state.cars[index];
      car.units = car.units.filter((unit) => unit.id === payload.unitId);
    }
  },
});

export default reducer;

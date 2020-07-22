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
    const { id, name } = payload;
    const index = state.cars.findIndex((car) => car.id === id);
    if (index !== -1) {
      const car = state.cars[index];
      car.name = name;
    }
  },
  [actions.createCar.type]: (state) => {
    state.cars.push({
      name: '',
      units: [],
      id: _.uniqueId(),
    });
  },
});

export default reducer;

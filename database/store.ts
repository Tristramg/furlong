import { createReducer } from '@reduxjs/toolkit';
import _ from 'lodash';
import * as actions from '../lib/actions';
import initialState from './initial_state';

function update(set: any[], id: string, prop: string, value: string) {
  const index = set.findIndex((unit) => unit.id === id);
  if (index !== -1) {
    const element = set[index];
    element[prop] = value;
  }
}
/* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["state"] }] */
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
      car.units = car.units.filter((unit) => unit.id !== payload.unitId);
    }
  },
  [actions.createTrain.type]: (state) => {
    state.trains.push({
      name: '',
      cars: [],
      id: _.uniqueId(),
    });
  },
  [actions.updateTrainName.type]: (state, { payload }) => {
    update(state.trains, payload.id, 'name', payload.name);
  },
  [actions.appendCar.type]: (state, { payload }) => {
    const { trainId, carId } = payload;
    const trainIndex = state.trains.findIndex((train) => train.id === trainId);
    const { cars } = state.trains[trainIndex];
    const index = cars.findIndex((c) => c.id === carId);
    if (index === -1) {
      cars.push({ id: carId, count: 1 });
    } else {
      cars[index].count += 1;
    }
  },
  [actions.updateTrainCarCount.type]: (state, { payload }) => {
    const index = state.trains.findIndex(
      (train) => train.id === payload.trainId
    );
    if (index !== -1) {
      const train = state.trains[index];
      update(train.cars, payload.carId, 'count', payload.value);
    }
  },
  [actions.deleteTrainCar.type]: (state, { payload }) => {
    const idx = state.trains.findIndex((train) => train.id === payload.trainId);
    if (idx !== -1) {
      const train = state.trains[idx];
      train.cars = train.cars.filter((car) => car.id !== payload.carId);
    }
  },
  [actions.addStation.type]: ({ line }, { payload }) => {
    line.stations.push(payload);
  },
  [actions.deleteStation.type]: (state, { payload }) => {
    state.line.stations = state.line.stations.filter(
      (s) => s.node !== payload.node
    );
  },
  [actions.addRoute.fulfilled.type]: (state, { payload }) => {
    // Add user to the state array
    state.line.segments = state.line.segments.concat(payload);
  },
});

export default reducer;

import { createAction } from '@reduxjs/toolkit';

export const appendUnit = createAction<{ carId: string; unitId: string }>(
  'car/append/unit'
);
export const updateUnitName = createAction<{ id: string; name: string }>(
  'unit/update/name'
);
export const updateUnitPax = createAction<{ id: string; value: number }>(
  'unit/update/pax'
);
export const updateCarName = createAction<{ id: string; name: string }>(
  'car/update/name'
);
export const updateCarWeight = createAction<{ id: string; value: number }>(
  'car/update/weight'
);
export const updateCarUnitCount = createAction<{
  id: string;
  value: number;
  unitId: string;
}>('car/update/unitCount');
export const updateCarUnitPrice = createAction<{
  id: string;
  value: number;
  unitId: string;
}>('car/update/unitPrice');
export const deleteCarUnit = createAction<{
  carId: string;
  unitId: string;
}>('car/delete/unit');
export const createCar = createAction('car/create');
export const createUnit = createAction('unit/create');
export const createTrain = createAction('train/create');
export const updateTrainName = createAction<{ id: string; name: string }>(
  'train/update/name'
);
export const appendCar = createAction<{ trainId: string; carId: string }>(
  'train/append/car'
);
export const updateTrainCarCount = createAction<{
  trainId: string;
  carId: string;
  value: number;
}>('train/update/carCount');
export const deleteTrainCar = createAction<{
  trainId: string;
  carId: string;
}>('train/delete/car');

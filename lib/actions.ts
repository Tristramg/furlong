import { createAction } from '@reduxjs/toolkit';

export const appendUnit = createAction<{ carId: string; unitId: string }>(
  'car/append/unit'
);
export const updateCarName = createAction<{ id: string; name: string }>(
  'car/update/name'
);
export const createCar = createAction('car/create');

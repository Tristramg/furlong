import Train, { Car } from '../lib/train';
import { CarType } from '../lib/types.d';

const tracva: Car = {
  weight: 72,
  passengers: 0,
  length: 19,
  type: CarType.Locomotive,
};

const talgo230Coach: Car = {
  weight: 17,
  passengers: 20,
  length: 13,
  type: CarType.Passenger,
};

const talgo230Restaurant: Car = {
  weight: 17,
  passengers: 0,
  length: 13,
  type: CarType.Restaurant,
};

const talgo230 = new Train({
  label: 'Talgo tracté',
  highSpeed: false,
  gaugeChange: true,
  cars: [
    [tracva, 1],
    [talgo230Coach, 12],
    [talgo230Restaurant, 2],
  ],
  multipleUnit: false,
});

const talgo250: Train = new Train({
  label: 'Talgo 250',
  highSpeed: true,
  gaugeChange: true,
  cars: [
    [tracva, 2],
    [talgo230Coach, 10],
    [talgo230Restaurant, 2],
  ],
  multipleUnit: false,
});

export { talgo230, talgo250 };

import Train, { Car } from '../lib/train';
import { CarType } from '../lib/types.d';

const tracva: Car = {
  weight: 72,
  passengers: 0,
  length: 19.4,
  type: CarType.Locomotive,
};

const talgo230Coach: Car = {
  weight: 17,
  passengers: 16,
  length: 13.14,
  type: CarType.Passenger,
};

const talgo230Restaurant: Car = {
  weight: 17,
  passengers: 0,
  length: 13.14,
  type: CarType.Restaurant,
};

const vectron: Car = {
  weight: 92,
  passengers: 0,
  length: 18.96,
  type: CarType.Locomotive,
};

const viaggioClassic: Car = {
  weight: 47,
  passengers: 34,
  length: 26.4,
  type: CarType.Passenger,
};

const viaggioRestaurant: Car = {
  weight: 47,
  passengers: 0,
  length: 26.4,
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

const halfViaggio: Train = new Train({
  label: 'Viaggio 200m',
  highSpeed: false,
  gaugeChange: false,
  cars: [
    [vectron, 1],
    [viaggioClassic, 6],
    [viaggioRestaurant, 1],
  ],
  multipleUnit: false,
});

const fullViaggio: Train = new Train({
  label: 'Viaggio 400m',
  highSpeed: false,
  gaugeChange: false,
  cars: [
    [vectron, 1],
    [viaggioClassic, 12],
    [viaggioRestaurant, 2],
  ],
  multipleUnit: false,
});

const empty: Train = new Train({
  label: 'Train fantôme 👻',
  highSpeed: false,
  gaugeChange: false,
  cars: [],
  multipleUnit: false,
});

export default { talgo230, talgo250, halfViaggio, fullViaggio, empty };

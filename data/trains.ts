import Train from '../lib/train';
import { CarType } from '../lib/types.d';
import Car from '../lib/car';

const tracva = new Car({
  weight: 72,
  passengers: 0,
  length: 19.4,
  type: CarType.Locomotive,
  value: 4_000_000,
  maintenancePerKm: 0.4,
  heavyMaintenancePerKm: 0.2,
});

const talgo230Coach = new Car({
  weight: 17,
  passengers: 16,
  length: 13.14,
  type: CarType.Passenger,
  value: 1_500_000,
  maintenancePerKm: 0.1,
  heavyMaintenancePerKm: 0.05,
});

const talgo230Restaurant = new Car({
  weight: 17,
  passengers: 0,
  length: 13.14,
  type: CarType.Restaurant,
  value: 1_500_000,
  maintenancePerKm: 0.1,
  heavyMaintenancePerKm: 0.05,
});

const vectron = new Car({
  weight: 92,
  passengers: 0,
  length: 18.96,
  type: CarType.Locomotive,
  value: 4_500_000,
  maintenancePerKm: 0.4,
  heavyMaintenancePerKm: 0.2,
});

const viaggioClassic = new Car({
  weight: 47,
  passengers: 34,
  length: 26.4,
  type: CarType.Passenger,
  value: 2_500_000,
  maintenancePerKm: 0.2,
  heavyMaintenancePerKm: 0.1,
});

const viaggioOnlyDouble = new Car({
  weight: 47,
  passengers: 30,
  length: 26.4,
  type: CarType.Passenger,
  value: 2_500_000,
  maintenancePerKm: 0.2,
  heavyMaintenancePerKm: 0.1,
});

const viaggioRestaurant = new Car({
  weight: 47,
  passengers: 0,
  length: 26.4,
  type: CarType.Restaurant,
  value: 2_500_000,
  maintenancePerKm: 0.2,
  heavyMaintenancePerKm: 0.1,
});

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

const double: Train = new Train({
  label: 'Doubles uniquement',
  highSpeed: false,
  gaugeChange: false,
  cars: [
    [vectron, 1],
    [viaggioOnlyDouble, 11],
    [viaggioRestaurant, 1],
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

export default {
  talgo230,
  talgo250,
  halfViaggio,
  fullViaggio,
  empty,
  vectron,
  viaggioRestaurant,
  double,
};

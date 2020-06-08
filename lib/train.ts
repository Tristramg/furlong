import _ from 'lodash';
import { CarType } from './types.d';

interface Car {
  weight: number;
  passengers: number;
  length: number;
  type: CarType;
}

interface TrainInterface {
  label: string;
  highSpeed: boolean;
  gaugeChange: boolean;
  cars: [Car, number][];
  multipleUnit: boolean;
}

export default class Train implements TrainInterface {
  label: string;

  highSpeed: boolean;

  gaugeChange: boolean;

  cars: [Car, number][];

  multipleUnit: boolean;

  constructor(p: TrainInterface) {
    this.label = p.label;
    this.highSpeed = p.highSpeed;
    this.gaugeChange = p.gaugeChange;
    this.cars = p.cars;
    this.multipleUnit = p.multipleUnit;
  }

  capacity(): number {
    return _(this.cars).sumBy(([car, count]) => car.passengers * count);
  }

  weight(): number {
    return _(this.cars).sumBy(([car, count]) => car.weight * count);
  }

  length(): number {
    return _(this.cars).sumBy(([car, count]) => car.weight * count);
  }
}

export type { Car };

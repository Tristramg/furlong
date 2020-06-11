import _ from 'lodash';
import { CarType } from './types.d';
import { fmt } from './helpers';

interface Car {
  weight: number;
  passengers: number;
  length: number;
  type: CarType;
  value: number;
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

  fmtCapacity(): string {
    return `${fmt(this.capacity(), 3)} pax`;
  }

  weight(): number {
    return _(this.cars).sumBy(([car, count]) => car.weight * count);
  }

  fmtWeight(): string {
    return `${fmt(this.weight(), 3)} t`;
  }

  length(): number {
    return _(this.cars).sumBy(([car, count]) => car.length * count);
  }

  fmtLength(): string {
    return `${fmt(this.length(), 3)} m`;
  }

  maintenance(): number {
    return _(this.cars).sumBy(([car, count]) => car.value * 0.004 * count * 12);
  }

  heavyMaintenance(): number {
    return _(this.cars).sumBy(([car, count]) => car.value * 0.002 * count * 12);
  }

  renting(): number {
    return _(this.cars).sumBy(([car, count]) => car.value * 0.007 * count * 12);
  }
}

export type { Car };

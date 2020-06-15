import _ from 'lodash';
import { fmt } from './helpers';
import Car from './car';

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

  maintenance(distance: number): number {
    return _(this.cars)
      .map(([car, count]) => car.maintenance(distance) * count)
      .sum();
  }

  heavyMaintenance(distance: number): number {
    return _(this.cars).sumBy(
      ([car, count]) => car.heavyMaintenance(distance) * count
    );
  }

  renting(): number {
    return _(this.cars).sumBy(([car, count]) => car.value * 0.007 * count * 12);
  }
}

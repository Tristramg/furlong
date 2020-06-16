import { CarType } from './types.d';

class Car {
  weight: number;

  passengers: number;

  length: number;

  type: CarType;

  value: number;

  maintenancePerKm: number;

  heavyMaintenancePerKm: number;

  constructor(params: {
    weight: number;
    passengers: number;
    length: number;
    type: CarType;
    value: number;
    maintenancePerKm: number;
    heavyMaintenancePerKm: number;
  }) {
    this.weight = params.weight;
    this.passengers = params.passengers;
    this.length = params.length;
    this.type = params.type;
    this.value = params.value;
    this.maintenancePerKm = params.maintenancePerKm;
    this.heavyMaintenancePerKm = params.heavyMaintenancePerKm;
  }

  maintenance(distance: number): number {
    return distance * this.maintenancePerKm;
  }

  heavyMaintenance(distance: number): number {
    return distance * this.heavyMaintenancePerKm;
  }

  renting(): number {
    return this.value * 0.007 * 12;
  }
}

export default Car;

import { rules } from '../data/countries';
import _ from 'lodash';

interface Rule {
  per_ton_and_km: number;
  per_km: number;
  per_kWh: number;
  label: string;
}

interface Train {
  label: string;
  highSpeed: boolean;
  gaugeChange: boolean;
  weight: number;
  cars: number;
  multipleUnit: boolean;
}

interface VehicleJourney {
  label: string;
  edges: TrainEdge[];
  price: number;
  distance: number;
  energy: number;
}

interface Line {
  class: string;
  highSpeed: boolean;
  label: string;
  gauge: string;
  signaling: string;
  current: string;
}

function ccCurent(line: Line): boolean {
  return /CC/.test(line.current);
}

class InfraEdge {
  start: string;
  end: string;
  label: string;
  distance: number;
  country: string;
  line: Line;
}
class Edge extends InfraEdge {
  departureTime: number;
  arrivalTime: number;
}

class TrainEdge {
  edge: Edge;
  weight: number;
  energy: number;
  price: number;
  rules: Rule[];

  constructor(edge: Edge, train: Train) {
    this.edge = edge;
    this.weight = train.weight;
    this.energy = edge.distance * 10;
    this.rules = rules(edge, train);
    this.price = _(this.rules).map(r => this.singlePrice(r)).sum();
  }

  singlePrice(rule: Rule): number {
    return this.weight * this.edge.distance * rule.per_ton_and_km +
      this.edge.distance * rule.per_km +
      this.energy * rule.per_kWh;
  }
}

interface Route {
  label: string;
  segments: Edge[];
}

export type { Rule, Train, VehicleJourney, Edge, Route, Line };
export { TrainEdge, ccCurent };

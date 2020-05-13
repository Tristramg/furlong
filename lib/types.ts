import { rules } from '../data/countries';
import { RuleCategory } from './types.d';
import _ from 'lodash';

class Rule {
  perTonAndKm: number;
  perKm: number;
  perkWh: number;
  fixed: number;
  label: string;
  category: RuleCategory;

  static perKm(perKm: number, label: string, category: RuleCategory): Rule {
    return {
      perKm,
      label,
      category,
      perTonAndKm: 0,
      fixed: 0,
      perkWh: 0,
    };
  }

  static perkWh(perkWh: number, label: string): Rule {
    return {
      perkWh,
      label,
      category: RuleCategory.Energy,
      perTonAndKm: 0,
      fixed: 0,
      perKm: 0,
    };
  }

  static station(fixed: number, label): Rule {
    return {
      fixed,
      label,
      category: RuleCategory.Station,
      perTonAndKm: 0,
      perKm: 0,
      perkWh: 0,
    };
  }
}

interface Train {
  label: string;
  highSpeed: boolean;
  gaugeChange: boolean;
  weight: number;
  cars: number;
  multipleUnit: boolean;
  capacity: number;
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
  return /DC/.test(line.current);
}

interface StopTime {
  label: string;
  time: number;
  commercial: boolean;
  station: number;
  track: number;
  adifClass: number;
}

class Edge {
  departure: StopTime;
  arrival: StopTime;
  label: string;
  distance: number;
  country: string;
  line: Line;
}

class TrainEdge {
  edge: Edge;
  weight: number;
  energy: number;
  price: number;
  rules: Rule[];

  constructor(edge: Edge, train: Train, edges: Edge[], index: number) {
    this.edge = edge;
    this.weight = train.weight;
    this.energy = edge.distance * 10;
    this.rules = rules(edge, train, edges, index);
    this.price = _(this.rules).map(r => this.singlePrice(r)).sum();
  }

  singlePrice(rule: Rule): number {
    return this.weight * this.edge.distance * rule.perTonAndKm +
      this.edge.distance * rule.perKm +
      this.energy * rule.perkWh +
      rule.fixed;
  }

  pricesByCategory() {
    const sumPrices = (rules: Rule[]): number => _(rules).map(r => this.singlePrice(r)).sum();
    return _(this.rules).groupBy('category').mapValues(sumPrices).value();
  }
}

interface Route {
  label: string;
  segments: Edge[];
}

export type { Train, VehicleJourney, Edge, Route, Line, StopTime };
export { Rule, TrainEdge, ccCurent };

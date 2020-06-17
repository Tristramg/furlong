import _ from 'lodash';
import Edge from './edge';
import Train from './train';
import { Day, Countries, RuleCategory } from './types.d';
import { Rule } from './rule';
import { rules } from '../data/countries';

export default class TrainEdge {
  edge: Edge;

  weight: number;

  energy: number;

  price: number;

  rules: Rule[];

  constructor(
    edge: Edge,
    train: Train,
    edges: Edge[],
    index: number,
    day: Day,
    pax?: number
  ) {
    this.edge = edge;
    this.weight = train.weight();
    this.energy = edge.distance * (3 + 0.02 * train.weight());
    this.rules = rules({
      edge,
      train,
      edges,
      index,
      day,
      pax: pax || train.capacity(),
    });
    this.price = _(this.rules)
      .map((r) => this.singlePrice(r))
      .sum();
  }

  singlePrice(rule: Rule): number {
    return (
      this.weight * this.edge.distance * rule.perTonAndKm +
      this.edge.distance * rule.perKm +
      this.energy * rule.perkWh +
      rule.fixed
    );
  }

  pricesByCategory(): { [category: string]: number } {
    const sumPrices = (r: Rule[]): number =>
      _(r)
        .map((rule) => this.singlePrice(rule))
        .sum();
    return _(this.rules).groupBy('category').mapValues(sumPrices).value();
  }

  duration(): number {
    return this.edge.arrival.time - this.edge.departure.time;
  }

  startReduction(year: number, highspeed: boolean): number {
    if (this.edge.country === Countries.FR && year <= 1) {
      const value = highspeed ? 0.1 : 0.2;
      return this.pricesByCategory()[RuleCategory.Tracks] * value;
    }
    if (this.edge.country === Countries.DE && year === 0) {
      return this.pricesByCategory()[RuleCategory.Tracks] * 0.2;
    }
    return 0;
  }
}

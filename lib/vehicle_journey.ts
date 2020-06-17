import _ from 'lodash';
import Train from './train';
import Line from './line';
import { Day } from './types.d';
import TrainEdge from './train_edge';
import { gen } from './helpers';
import { Infra } from '../data/airtable_importer';

export default class VehicleJourney {
  label: string;

  edges: TrainEdge[];

  price: number;

  distance: number;

  energy: number;

  train: Train;

  constructor(
    line: Line,
    day: Day,
    forward: boolean,
    infra: Infra,
    train?: Train,
    pax?: number
  ) {
    const edges = gen(line.steps, infra, forward);

    this.edges = edges.map(
      (s, i) => new TrainEdge(s, train || line.train, edges, i, day, pax)
    );
    this.label = line.label;
    this.price = _(this.edges).map('price').sum();
    this.distance = _(this.edges).map('edge.distance').sum();
    this.energy = _(this.edges).map('energy').sum();
    this.train = train || line.train;
  }

  highspeed(): boolean {
    return this.train.highSpeed && _.some(this.edges, 'edge.line.highSpeed');
  }

  startReduction(year: number): number {
    return _(this.edges).sumBy((e) => e.startReduction(year, this.highspeed()));
  }
}

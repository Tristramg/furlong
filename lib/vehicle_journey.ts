import _ from 'lodash';
import { Train } from './types';
import { Day } from './types.d';
import TrainEdge from './train_edge';
import Edge from './edge';

interface Route {
  label: string;
  segments: Edge[];
}

export default class VehicleJourney {
  label: string;

  edges: TrainEdge[];

  price: number;

  distance: number;

  energy: number;

  train: Train;

  constructor(route: Route, train: Train, day: Day) {
    this.edges = route.segments.map((s, i) => new TrainEdge(s, train, route.segments, i, day));
    this.label = route.label;
    this.price = _(this.edges).map('price').sum();
    this.distance = _(this.edges).map('edge.distance').sum();
    this.energy = _(this.edges).map('energy').sum();
    this.train = train;
  }

  highspeed(): boolean {
    return this.train.highSpeed && _.some(this.edges, 'edge.line.highSpeed');
  }
}

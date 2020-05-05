import _ from 'lodash';
import { Route, Edge, TrainEdge, Train, VehicleJourney } from './types';

function gen(list, infra) : Edge[] {
  return _.zipWith(_.drop(list), _.dropRight(list), (start, end) => {
    const edge = edgeId(start[0], end[0]);
    const e = infra.edges[edge];

    e.departureTime = end[1];
    e.arrivalTime = start[1];
    return e;
  });
}

function vehicleJourney(route: Route, infra, train: Train): VehicleJourney {
  const edges = route.segments.map(s => new TrainEdge(s, train, route.segments));

  return {
    edges,
    label: route.label,
    price: _(edges).map('price').sum(),
    distance: _(edges).map('edge.distance').sum(),
    energy: _(edges).map('energy').sum(),
  };
}

const fmt = (val: number): string => val === 0.0 ? '—' : String(Number(val.toPrecision(3)));
const grey = (val: number): string => val === 0.0 ? 'text-gray-500' : '';

const h = (hours: number, minutes: number): number => {
  if (hours < 12) {
    return (24 + hours) * 60 + minutes;
  }
  return hours * 60 + minutes;
};

const fh = (time: number): string => {
  const h = String(Math.floor(time / 60) % 24).padStart(2, '0');
  const m = String(time % 60).padStart(2, '0');
  return `${h}:${m}`;
};

const edgeId = (from: string, to: string): string => from < to ? `${from}-${to}` : `${to}-${from}`;

function in_period(time: number, start: number, end: number) {
  return time % (24 * 60) > start % (24 * 60) &&
       time % (24 * 60) < end % (24 * 60);
}

function included(edge: Edge, start: number, end: number) {
  return in_period(edge.arrivalTime, start, end) || in_period(edge.departureTime, start, end);
}

export { fmt, grey, vehicleJourney, h, fh, edgeId, gen, included };

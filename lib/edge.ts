import { StopTime, Line } from './types';

export default class Edge {
  departure: StopTime;

  arrival: StopTime;

  label: string;

  distance: number;

  country: string;

  line: Line;
}

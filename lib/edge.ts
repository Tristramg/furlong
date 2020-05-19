import { Line } from './types';
import StopTime from './stop_time';

export default class Edge {
  departure: StopTime;

  arrival: StopTime;

  label: string;

  distance: number;

  country: string;

  line: Line;
}

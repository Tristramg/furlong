import { RailLine } from './types';
import { Countries } from './types.d';
import StopTime from './stop_time';

export default class Edge {
  departure: StopTime;

  arrival: StopTime;

  label: string;

  distance: number;

  country: Countries;

  line: RailLine;
}

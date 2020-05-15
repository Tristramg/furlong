import Routes from '../data/lines';
import { gen } from './helpers';
import { VehicleJourney} from './types';
import { Day } from './types.d';
import _ from 'lodash';

export default function(line: string|string[], day: string|string[], infra): VehicleJourney {
  const l = typeof line === 'string' ? line : line[0];
  const d = typeof day === 'string' ? day : day[0];
  console.log(d, Day[d])
  const route = Routes[l];
  const edges = gen(route.steps, infra);
  return new VehicleJourney({ label: route.label, segments: edges }, route.train, Day[d]);
}

import Lines from '../data/lines';
import { gen } from './helpers';
import VehicleJourney from './vehicle_journey';
import { Day } from './types.d';

const reverse = {
  Lundi: Day.Monday,
  Mardi: Day.Tuesday,
  Mercredi: Day.Wednesday,
  Jeudi: Day.Thursday,
  Samedi: Day.Saturday,
  Vendredi: Day.Friday,
  Dimanche: Day.Sunday,
};

export default function VJ(
  line: string | string[],
  day: string | string[],
  infra,
  forward: boolean
): VehicleJourney {
  const l = typeof line === 'string' ? line : line[0];
  const d = typeof day === 'string' ? day : day[0];
  const route = Lines[l];
  const edges = gen(route.steps, infra, forward);
  return new VehicleJourney(
    { label: route.label, segments: edges },
    route.train,
    reverse[d]
  );
}

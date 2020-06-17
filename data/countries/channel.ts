import { h, included, weekEnd } from '../../lib/helpers';
import { Rule } from '../../lib/rule';
import Edge from '../../lib/edge';
import { RuleCategory, Day } from '../../lib/types.d';

enum Period {
  OffPeak = 'Heure creuse',
  Intermediate = 'Heure intermédiaire',
  Peak = 'Heure de pointe',
  Maintenance = 'Maintenance',
}
const reservation = {
  [Period.OffPeak]: 3730,
  [Period.Intermediate]: 4145,
  [Period.Peak]: 4559,
  [Period.Maintenance]: 6217,
};

function period(edge: Edge, day: Day): Period {
  if (included(edge, h(23, 0), h(7, 0))) {
    return !weekEnd(edge, day) ? Period.OffPeak : Period.Maintenance;
  }
  if (day !== Day.Sunday && included(edge, h(7, 0), h(11, 0))) {
    return Period.Peak;
  }
  if (day !== Day.Saturday && included(edge, h(17, 0), h(23, 0))) {
    return Period.Peak;
  }
  return Period.Intermediate;
}

export default function rules({ edge, train, day }): Rule[] {
  const p = period(edge, day);
  const perPassenger = 17.68;
  const loadFactor = 0.8;

  return [
    {
      perTonAndKm: 0,
      perKm: 0,
      perkWh: 0,
      fixed: reservation[p],
      label: `Réservation période ${p}`,
      category: RuleCategory.Tracks,
    },
    {
      perTonAndKm: 0,
      perKm: 0,
      perkWh: 0,
      fixed: train.capacity() * 0.8 * perPassenger,
      label: `Accès ${perPassenger} € par passager,  train de ${train.capacity()} passagers, facteur de charge ${loadFactor}`,
      category: RuleCategory.Tracks,
    },
  ];
}

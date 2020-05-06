import { h, included } from '../../lib/helpers';
import { Train, Edge, Rule } from '../../lib/types';

const use = {
  smallCapa: {
    lowSpeed: {
      offPeak: 786.80,
      medium: 957.60,
      peak: 1313.20,
    },
    highSpeed: {
      offPeak: 1011.60,
      medium: 1231.20,
      peak: 1688.40,
    },
  },
  highCapa: {
    lowSpeed: {
      offPeak: 910.00,
      medium: 1108.80,
      peak: 1517.60,
    },
    highSpeed: {
      offPeak: 1170.00,
      medium: 1425.60,
      peak: 1951.20,
    },
  },
};

const labels = {
  smallCapa: 'capa < 300 pax',
  highCapa: 'capa ≥ 300 pax',
  lowSpeed: 'V ≤ 230 km/h',
  highSpeed: 'V > 230 km/h',
  offPeak: 'heure creuse',
  medium: 'heure moyenne',
  peak: 'heure de pointe',
};

const booking = {
  per_ton_and_km: 0,
  per_km: 0,
  per_kWh: 0,
  fixed: 200,
  label: 'Réservation Ligne Figueres-Perpignan',
};

const elec = {
  per_ton_and_km: 0,
  per_km: 0,
  per_kWh: 0.1,
  fixed: 0,
  label: 'Électricité (estimation)',
};

function period(edge: Edge): string {
  if (included(edge, h(5, 30), h(6, 30))) {
    return 'offPeak';
  }
  if (included(edge, h(6, 30), h(9, 0)) || included(edge, h(17, 0), h(20, 0))) {
    return 'peak';
  }
  return 'medium';
}

export default function (edge: Edge, train: Train): Rule[] {
  const p = period(edge);
  const s = train.highSpeed ? 'highSpeed' : 'lowSpeed';
  const c = train.capacity > 300 ? 'highCapa' : 'smallCapa';

  const useRule = {
    per_ton_and_km: 0,
    per_km: 0,
    per_kWh: 0,
    fixed: use[c][s][p],
    label: `Utilisation du tunnel ${labels[c]}, ${labels[s]}, ${labels[p]}`,
  };

  return [useRule, booking, elec];
}

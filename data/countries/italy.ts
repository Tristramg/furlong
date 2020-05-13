import { Edge, Rule, Train, StopTime } from '../../lib/types';
import { RuleCategory } from '../../lib/types.d';
import _ from 'lodash';

function ta1(train: Train): Rule {
  if (train.weight < 500) {
    return {
      per_kWh: 0,
      per_km: 0.128,
      per_ton_and_km: 0,
      fixed: 0,
      label: 'Ta1: Weight class < 500t',
      category: RuleCategory.Tracks,
    };
  }
  if (train.weight < 1000) {
    return {
      per_kWh: 0,
      per_km: 0.372,
      per_ton_and_km: 0,
      fixed: 0,
      label: 'Ta1: Weight class 500—1000t',
      category: RuleCategory.Tracks,
    };
  }
  if (train.weight < 1500) {
    return {
      per_kWh: 0,
      per_km: 0.616,
      per_ton_and_km: 0,
      fixed: 0,
      label: 'Ta1: Weight class 1000–1500t',
      category: RuleCategory.Tracks,
    };
  }
  return {
    per_kWh: 0,
    per_km: 0.860,
    per_ton_and_km: 0,
    fixed: 0,
    label: 'Ta1: Weight class > 1500t',
    category: RuleCategory.Tracks,
  };
}

function ta2(edges: Edge[]): Rule {
  const distance = _.sumBy(edges, 'distance');
  const duration = _.sumBy(edges, e => e.arrival.time - e.departure.time);
  const average = distance * 60 / duration;

  if (average < 100) {
    return {
      per_kWh: 0,
      per_km: 0.117,
      per_ton_and_km: 0,
      fixed: 0,
      label: 'Ta2: vitesse moyenne < 100km/h',
      category: RuleCategory.Tracks,
    };
  }
  if (average < 150) {
    return {
      per_kWh: 0,
      per_km: 0.117,
      per_ton_and_km: 0,
      fixed: 0,
      label: 'Ta2: vitesse moyenne 100—150km/h',
      category: RuleCategory.Tracks,
    };
  }
  return {
    per_kWh: 0,
    per_km: 1.056,
    per_ton_and_km: 0,
    fixed: 0,
    label: 'Ta2: vitesse moyenne > 150km/h',
    category: RuleCategory.Tracks,
  };
}

function ta3(train: Train): Rule {
  if (train.highSpeed) {
    return {
      per_kWh: 0,
      per_km: 0.046,
      per_ton_and_km: 0,
      fixed: 0,
      label: 'Ta3: utilisation caténaire grande vitesse',
      category: RuleCategory.Energy,
    };
  }
  return {
    per_kWh: 0,
    per_km: 0.023,
    per_ton_and_km: 0,
    fixed: 0,
    label: 'Ta3: utilisation caténaire vitesse classique',
    category: RuleCategory.Energy,
  };
}

enum Segment {
  TopPlus = 'Top Plus : Premium avec arrêt à Milan ET Rome, > 700 places',
  Top = 'Top: Premium avec un arrêt à Milan ET Rome, < 700 places',
  TopSPlus = 'Top-S Plus : Premium avec arrêt à Milan ET Rome, > 700 places (Samedi)',
  TopS = 'Top-S: Premium avec un arrêt à Milan ET Rome, < 700 places (Samedi)',
  PBasePlus = 'P Base Plus : Premium avec un arrêt à Milan OU Rome > 700 places',
  PBase = 'P Base Plus : Premium avec un arrêt à Milan OU Rome, < 700 places',
  PLightPlus = 'P Light Plus : moins de 30% de ligne High Service, > 700 places',
  PLight = 'P Light Plus : moins de 30% de ligne High Service, < 700 places',
  International =  'International : pas d’utilisation de grande vitesse',
  Basic = 'National open access sans grande vitesse',
}

const prices = {
  [Segment.TopPlus]: 5.890,
  [Segment.Top]: 5.371,
  [Segment.TopSPlus]: 4.847,
  [Segment.TopS]: 4.416,
  [Segment.PBasePlus]: 4.524,
  [Segment.PBase]: 4.150,
  [Segment.PLightPlus]: 4.385,
  [Segment.PLight]: 4.023,
  [Segment.International]: 4.099,
  [Segment.Basic]: 3.412,
};

const cityInStopTime = (stop: StopTime, city: string): boolean => stop.label.includes(city) &&
                                                                  stop.commercial;

const hasCity = (edge: Edge, city: string): boolean => cityInStopTime(edge.arrival, city) ||
                                                       cityInStopTime(edge.departure, city);

function segment(edges: Edge[], train: Train): Segment {
  const itEdges = _.filter(edges, e => e.country === 'IT');
  const roma: boolean = _.some(itEdges, e => hasCity(e, 'Roma'));
  const milano: boolean = _.some(itEdges, e => hasCity(e, 'Milano'));
  const distance: number = _.sumBy(itEdges, 'distance');
  const highServiceDistance: number = _(itEdges).filter(e => e.line.highSpeed).sumBy('distance');

  // Never use === on floats
  if (highServiceDistance < 1.0 && _(edges).uniqBy('country').size() > 1) {
    return Segment.International;
  }
  if (roma && milano) {
    return train.capacity > 700 ? Segment.TopPlus : Segment.Top;
  }
  if (roma || milano) {
    if (distance * 100 / highServiceDistance > 30.0) {
      return train.capacity > 700 ? Segment.PBasePlus : Segment.PBase;
    }
    return train.capacity > 700 ? Segment.PLightPlus : Segment.PBase;
  }
  return Segment.Basic;
}

function tb(edges: Edge[], train: Train): Rule {
  const seg: Segment = segment(edges, train);

  return {
    per_km: prices[seg],
    per_kWh: 0,
    per_ton_and_km: 0,
    fixed: 0,
    category: RuleCategory.Tracks,
    label: seg,
  };
}

const elec: Rule = {
  per_km: 0,
  per_kWh: 0.06,
  per_ton_and_km: 0,
  fixed: 0,
  category: RuleCategory.Energy,
  label: 'Énergie (estimation)',
};

function rules(edge: Edge, train: Train, edges: Edge[]): Rule[] {
  return [
    ta1(train),
    ta2(edges),
    ta3(train),
    tb(edges, train),
    elec,
  ];
}

export default rules;

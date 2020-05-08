import { Rule, Edge, Train, ccCurent, StopTime } from '../../lib/types';
import { RuleCategory } from '../../lib/types.d';
import _ from 'lodash';

const prices = {
  VL1: {
    A: 1.9275,
    B: 4.7931,
    C: 0.8020,
  },
  VL2: {
    A: 0.9258,
    B: 2.3017,
    C: 0.3835,
  },
  VL3: {
    A: 1.9275,
    B: 2.3017,
    C: 0.8020,
  },
  other: {
    A: 0.5133,
    B: 0.7320,
    C: 0.2039,
  },
  // TODO those values are per bunch of 100 seats
  // Those prices are for VL1, VL2, and VL3, not A, B C
  'LAV Madrid-Barcelona-Frontera': {
    A: 1.7611,
    B: 0.2317,
    C: 0.3023,
  },
  'LAV Madrid-Sevilla': {
    A: 0.8647,
    B: 0.1504,
    C: 0.1962,
  },
};

function market(edges: Edge[]): string {
  const broadGauge =
    _(edges).
      filter(e => e.country === 'ES' && e.line.gauge.includes('1668')).
      sumBy('distance');

  const standardGauge =
    _(edges).
      filter(e => e.country === 'ES' && e.line.gauge.includes('1435')).
      sumBy('distance');

  const madrid = (label: string): boolean => label.includes('Madrid');
  if (_.some(edges, e => madrid(e.departure.label) || madrid(e.arrival.label))) {
    // More than 10% is in broad gauge
    if (broadGauge / (broadGauge + standardGauge) > 0.1) {
      return 'VL2';
    }
    return 'VL1';
  }

  return 'VL3';
}

const stations = {
  1: {
    destination: 164,
    intermediate: 63.78,
    departure: 182.22,
  },
  2: {
    destination: 78.11,
    intermediate: 30.38,
    departure: 86.79,
  },
};

const stationRule = (station: StopTime, position: string): Rule => ({
  per_km:0,
  per_kWh: 0,
  per_ton_and_km: 0,
  fixed: stations[station.adifClass][position],
  label: `Gare classe ${station.adifClass} ${position}`,
  category: RuleCategory.Station,
});

function stationRules(edge: Edge, len: number, index: number): Rule[] {
  const result = [];
  if (index === 0 && edge.departure.commercial) {
    result.push(stationRule(edge.departure, 'departure'));
  }

  if (index > 0 && index < len - 1 && edge.departure.commercial) {
    result.push(stationRule(edge.departure, 'intermediate'));
  }

  if (index === len - 1 && edge.arrival.commercial) {
    result.push(stationRule(edge.arrival, 'destination'));
  }

  return result;
}

function rules(edge: Edge, train: Train, edges: Edge[], index: number): Rule[] {

  const cat = edge.line && edge.line.class === 'A' ? market(edges) : 'other';

  const result = [
    {
      per_km: prices[cat]['A'],
      per_kWh: 0,
      per_ton_and_km: 0,
      fixed: 0,
      label: `Modalidad A (réservaton sillon) ${cat}`,
      category: RuleCategory.Tracks,
    },
    {
      per_km: prices[cat]['B'],
      per_kWh: 0,
      per_ton_and_km: 0,
      fixed: 0,
      label: `Modalidad B (utilisation sillon) ${cat}`,
      category: RuleCategory.Tracks,
    },
    {
      per_km: prices[cat]['C'],
      per_kWh: 0,
      per_ton_and_km: 0,
      fixed: 0,
      label: `Modalidad C (utilisation installation électrique) ${cat}`,
      category: RuleCategory.Tracks,
    },
    {
      per_km: 0,
      per_kWh: 0.00112,
      per_ton_and_km: 0,
      fixed: 0,
      label: 'Cout de gestion électricité (SC-2)',
      category: RuleCategory.Tracks,
    },
  ];

  if (edge.line && prices[edge.line.label]) {
    const line = edge.line.label;
    result.push(
      {
        per_km: prices[line]['A'],
        per_kWh: 0,
        per_ton_and_km: 0,
        fixed: 0,
        label: `Supplément Modalidad A ligne chargée ${line}`,
        category: RuleCategory.Tracks,
      },
      {
        per_km: prices[line]['B'],
        per_kWh: 0,
        per_ton_and_km: 0,
        fixed: 0,
        label: `Supplément Modalidad B ligne chargée ${line}`,
        category: RuleCategory.Tracks,
      },
      {
        per_km: prices[line]['C'],
        per_kWh: 0,
        per_ton_and_km: 0,
        fixed: 0,
        label: `Supplément Modalidad C ligne chargée ${line}`,
        category: RuleCategory.Tracks,
      });
  }

  if (ccCurent(edge.line)) {
    result.push({
      per_km: 0,
      per_kWh: 0,
      per_ton_and_km: 3.207659 / 1000,
      fixed: 0,
      label: 'Fourniture et distribution électricité courant continu',
      category: RuleCategory.Energy,
    });
  } else {
    result.push(
      {
        per_km: 0,
        per_kWh: 0.0645,
        per_ton_and_km: 0,
        fixed: 0,
        label: 'Fourniture électricité courant alternatif (energía)',
        category: RuleCategory.Energy,
      },
      {
        per_km: 0,
        per_kWh: 0.032,
        per_ton_and_km: 0,
        fixed: 0,
        label: 'Distribution électricité courant alternatif (coste ATR)',
        category: RuleCategory.Energy,
      },
    );
  }

  return result.concat(stationRules(edge, edges.length, index));
}

export default rules;

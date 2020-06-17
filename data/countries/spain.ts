import _ from 'lodash';
import { ccCurent } from '../../lib/types';
import Train from '../../lib/train';
import { RuleCategory, Countries } from '../../lib/types.d';
import Edge from '../../lib/edge';
import { Rule } from '../../lib/rule';
import StopTime from '../../lib/stop_time';

const prices = {
  VL1: {
    A: 1.9275,
    B: 4.7931,
    C: 0.802,
    'LAV Madrid-Barcelona-Frontera': 1.7611,
    'LAV Madrid-Sevilla': 0.8647,
  },
  VL2: {
    A: 0.9258,
    B: 2.3017,
    C: 0.3835,
    'LAV Madrid-Barcelona-Frontera': 0.2317,
    'LAV Madrid-Sevilla': 0.1504,
  },
  VL3: {
    A: 1.9275,
    B: 2.3017,
    C: 0.802,
    'LAV Madrid-Barcelona-Frontera': 0.3023,
    'LAV Madrid-Sevilla': 0.1962,
  },
  other: {
    A: 0.5133,
    B: 0.732,
    C: 0.2039,
  },
};

function market(edges: Edge[]): string {
  const broadGauge = _(edges)
    .filter((e) => e.country === Countries.ES && e.line.gauge.includes('1668'))
    .sumBy('distance');

  const standardGauge = _(edges)
    .filter((e) => e.country === Countries.ES && e.line.gauge.includes('1435'))
    .sumBy('distance');

  const madrid = (label: string): boolean => label.includes('Madrid');
  if (
    _.some(edges, (e) => madrid(e.departure.label) || madrid(e.arrival.label))
  ) {
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

const PER_PASSENGER = 0.4084;

const stationRule = (station: StopTime, position: string): Rule =>
  Rule.station(
    stations[station.adifClass][position],
    `Gare classe ${station.adifClass} ${position}`
  );

function stationRules(
  edge: Edge,
  len: number,
  index: number,
  train: Train,
  pax: number
): Rule[] {
  const result = [];
  if (index === 0 && edge.departure.commercial) {
    result.push(stationRule(edge.departure, 'departure'));
    result.push(
      Rule.station(
        pax * PER_PASSENGER,
        `Montée de ${pax} passagers à ${PER_PASSENGER}€`
      )
    );
  }

  if (index > 0 && index < len - 1 && edge.departure.commercial) {
    result.push(stationRule(edge.departure, 'intermediate'));
  }

  if (index === len - 1 && edge.arrival.commercial) {
    result.push(stationRule(edge.arrival, 'destination'));
    result.push(
      Rule.station(
        pax * PER_PASSENGER,
        `Descente de ${pax} passagers à ${PER_PASSENGER}€`
      )
    );
  }

  return result;
}

function rules({ edge, train, edges, index, pax }): Rule[] {
  const cat = edge.line && edge.line.class === 'A' ? market(edges) : 'other';

  const result = [
    Rule.perKm(
      prices[cat].A,
      `Modalidad A (réservation sillon) ${cat}`,
      RuleCategory.Tracks
    ),
    Rule.perKm(
      prices[cat].B,
      `Modalidad B (utilisation sillon) ${cat}`,
      RuleCategory.Tracks
    ),
    Rule.perKm(
      prices[cat].C,
      `Modalidad C (utilisation installation électrique) ${cat}`,
      RuleCategory.Energy
    ),
    Rule.perkWh(0.00112, 'Cout de gestion électricité (SC-2)'),
  ];

  if (edge.line && prices[cat][edge.line.label]) {
    const line = edge.line.label;
    const multiplier = Math.ceil(train.capacity() / 100);
    result.push(
      Rule.perKm(
        prices[cat][line] * multiplier,
        `Supplément ${cat} ligne chargée ${line} (×${multiplier})`,
        RuleCategory.Tracks
      )
    );
  }

  if (ccCurent(edge.line)) {
    result.push({
      perKm: 0,
      perkWh: 0,
      perTonAndKm: 3.207659 / 1000,
      fixed: 0,
      label: 'Fourniture et distribution électricité courant continu',
      category: RuleCategory.Energy,
    });
  } else {
    result.push(
      Rule.perkWh(
        0.0645,
        'Fourniture électricité courant alternatif (energía)'
      ),
      Rule.perkWh(
        0.032,
        'Distribution électricité courant alternatif (coste ATR)'
      )
    );
  }

  return result.concat(stationRules(edge, edges.length, index, train, pax));
}

export default rules;

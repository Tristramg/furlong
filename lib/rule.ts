import { RuleCategory } from './types.d';
import { StopTime } from './types';
import Edge from './edge';

export default class Rule {
  perTonAndKm: number;

  perKm: number;

  perkWh: number;

  fixed: number;

  label: string;

  category: RuleCategory;

  static perKm(perKm: number, label: string, category: RuleCategory): Rule {
    return {
      perKm,
      label,
      category,
      perTonAndKm: 0,
      fixed: 0,
      perkWh: 0,
    };
  }

  static perkWh(perkWh: number, label: string): Rule {
    return {
      perkWh,
      label,
      category: RuleCategory.Energy,
      perTonAndKm: 0,
      fixed: 0,
      perKm: 0,
    };
  }

  static station(fixed: number, label): Rule {
    return {
      fixed,
      label,
      category: RuleCategory.Station,
      perTonAndKm: 0,
      perKm: 0,
      perkWh: 0,
    };
  }
}

function stationRule(station: StopTime): Rule[] {
  return station.commercial ? [Rule.station(station.station, 'Gare')] : [];
}

function stationRules(edge: Edge, last: boolean): Rule[] {
  if (last) {
    return stationRule(edge.departure).concat(stationRule(edge.arrival));
  }
  return stationRule(edge.departure);
}

export { Rule, stationRules };

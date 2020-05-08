import belgium from './countries/belgium';
import france from './countries/france';
import germany from './countries/germany';
import spain from './countries/spain';
import portugal from './countries/portugal';
import { Rule, Edge, Train, StopTime } from '../lib/types';
import { RuleCategory } from '../lib/types.d';

const data = {
  ES: {
    label: 'Belgique',
    current: '3000 CC',
    gauge: 'Ibérique 1668 mm',
    signaling: 'ASFA',
    rules: spain,
  },
  FR: {
    label: 'France',
    current: '1500 CC',
    gauge: 'Standard 1435 mm',
    signaling: 'KVB',
    rules: france,
  },
  IT: {
    label: 'Italie',
    current: '3000 CC',
    gauge: 'Standard 1435 mm',
    signaling: '?',
  //  rules: italy,
  },
  BE: {
    label: 'Belgique',
    current: '3000 CC',
    gauge: 'Standard 1435 mm',
    signaling: 'TBL',
    rules: belgium,
  },
  DE: {
    label: 'Allemagne',
    current: '15k AC',
    gauge: 'Standard 1435 mm',
    signaling: 'PZB',
    rules: germany,
  },
  PT: {
    label: 'Portugal',
    current: '25k AC',
    gauge: 'Ibérique 1668 mm',
    signaling: '?',
    rules: portugal,
  },
};

function stationRule(station: StopTime): Rule[] {
  if (station.commercial) {
    return [{
      per_ton_and_km: 0,
      per_km: 0,
      per_kWh: 0,
      fixed: station.station,
      label: 'Gare',
      category: RuleCategory.Station,
    }];
  }
  return [];
}

function stationRules(edge: Edge, last: boolean): Rule[] {
  if (last) {
    return stationRule(edge.departure).concat(stationRule(edge.arrival));
  }
  return stationRule(edge.departure);
}

function rules(edge: Edge, train: Train, edges: Edge[], index: number): Rule[] {
  return data[edge.country].rules(edge, train, edges, index);
}

export { rules, data, stationRules };

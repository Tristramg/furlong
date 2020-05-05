import belgium from './countries/belgium';
import france from './countries/france';
import germany from './countries/germany';
import spain from './countries/spain';
import portugal from './countries/portugal';
import { Rule, Edge, Train } from '../lib/types';

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

function rules(edge: Edge, train: Train, edges: Edge[]): Rule[] {
  return data[edge.country].rules(edge, train, edges);
}

export { rules, data };

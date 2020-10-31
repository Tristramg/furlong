import france from './countries/france';
import belgium from './countries/belgium';
import germany from './countries/germany';
import spain from './countries/spain';
import portugal from './countries/portugal';
import italy from './countries/italy';
import uk from './countries/uk';
import Train from '../lib/train';
import { Countries, Day } from '../lib/types.d';
import { Rule } from '../lib/rule';
import Edge from '../lib/edge';

const data = {
  [Countries.ES]: {
    label: 'Belgique',
    current: '3000 DC',
    gauge: 'Ibérique 1668 mm',
    signaling: 'ASFA',
    rules: spain,
  },
  [Countries.FR]: {
    label: 'France',
    current: '1500 DC',
    gauge: 'Standard 1435 mm',
    signaling: 'KVB',
    rules: france,
  },
  [Countries.IT]: {
    label: 'Italie',
    current: '3000 DC',
    gauge: 'Standard 1435 mm',
    signaling: 'BACC',
    rules: italy,
  },
  [Countries.BE]: {
    label: 'Belgique',
    current: '3000 DC',
    gauge: 'Standard 1435 mm',
    signaling: 'TBL',
    rules: belgium,
  },
  [Countries.DE]: {
    label: 'Allemagne',
    current: '15k AC',
    gauge: 'Standard 1435 mm',
    signaling: 'PZB',
    rules: germany,
  },
  [Countries.PT]: {
    label: 'Portugal',
    current: '25k AC',
    gauge: 'Ibérique 1668 mm',
    signaling: 'EBICAB',
    rules: portugal,
  },
  [Countries.UK]: {
    label: 'Royaume-Uni',
    current: '25kv AC',
    gauge: 'Standard 1435mm',
    signaling: 'ATB',
    rules: uk,
  },
};

interface RulesParams {
  edge: Edge;
  train: Train;
  edges: Edge[];
  index: number;
  day: Day;
  pax: number;
}

function rules(params: RulesParams): Rule[] {
  return data[params.edge.country].rules(params);
}

export { rules, data };

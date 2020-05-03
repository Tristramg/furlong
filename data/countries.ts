import belgium from './belgium';
import france from './france';
import germany from './germany';
import spain from './spain';
import { Rule, Edge, Train } from '../lib/types';

enum Country {
  BE = 'Belgique',
  DE = 'Allemagne',
  ES = 'Espagne',
  FR = 'France',
  IT = 'Italie',
  PT = 'Portugal',
}

const countryRule = {
  BE: belgium,
  FR: france,
  DE: germany,
  ES: spain,
};

function rules(edge: Edge, train: Train): Rule[] {
  return countryRule[edge.country](edge, train);
}

export { rules, Country };

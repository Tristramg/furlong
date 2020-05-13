import { Edge, Rule, Train } from '../../lib/types';
import { RuleCategory } from '../../lib/types.d';
import { h, included } from '../../lib/helpers';

enum Period {
  LOW = 'Low period',
  REGULAR = 'Regular period',
  PEAK = 'Peak period',
}

const coeffsA = {
  [Period.LOW]: 1.56,
  [Period.REGULAR]: 1.83,
  [Period.PEAK]: 1.83,
};

function getPeriod(edge: Edge): string {
  if (included(edge, h(6, 0), h(9, 59)) || included(edge, h(16, 31), h(20, 44))) {
    return Period.PEAK;
  }

  if (included(edge, h(10, 0), h(16, 30))) {
    return Period.REGULAR;
  }

  return Period.LOW;
}

function rules(edge: Edge, train: Train, edges: Edge[]): Rule[] {
  const period = getPeriod(edge);
  const coeff = coeffsA[period];

  return [
    Rule.perKm(coeff, `Classe International, ligne catégorie A, ${period}`, RuleCategory.Tracks),
    Rule.perkWh(0.06, 'Fourniture électricité (estimation)'),
  ];
}

export default rules;

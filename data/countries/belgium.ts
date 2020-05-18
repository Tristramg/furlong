import { Train } from '../../lib/types';
import { RuleCategory, Day } from '../../lib/types.d';
import { h, included, weekEnd } from '../../lib/helpers';
import { Rule, stationRules } from '../../lib/rule';
import Edge from '../../lib/edge';

const coutDirectUnitaire = 1.7045567852248;

enum LineDensity {
  VERY_HIGH = 'Très élevé',
  HIGH = 'Élevé',
  MEDIUM = 'Moyenne',
  LOW = 'Faible',
  VERY_LOW = 'Très faible',
  // Si c’est un train apte à la grande vitesse, on ignore la qualité de la ligne
  HIGH_SPEED_TRAIN = 'Train Grande Vitesse',
}

enum Period {
  OFF_PEAK = 'Heures creuses',
  NORMAL = 'Heures normales',
  PEAK = 'Pointe',
  HYPER_PEAK = 'Hyperpointe',
  WEEK_END_NIGHT = 'Week-end nuit',
  WEEK_END_DAY = 'Week-end jour',
}

const coeffs = {
  [Period.OFF_PEAK]: {
    [LineDensity.VERY_LOW]: 0.0613039348495271,
    [LineDensity.LOW]: 0.118401517683246,
    [LineDensity.MEDIUM]: 0.118401517683246,
    [LineDensity.HIGH]: 0.227114049459411,
    [LineDensity.VERY_HIGH]: 0.40452860705365,
    [LineDensity.HIGH_SPEED_TRAIN]: 0.877382235762,
  },
  [Period.NORMAL]: {
    [LineDensity.VERY_LOW]: 0.320401566737477,
    [LineDensity.LOW]: 0.618818816177675,
    [LineDensity.MEDIUM]: 0.777783136838054,
    [LineDensity.HIGH]: 1.1870042000254,
    [LineDensity.VERY_HIGH]: 2.11425401047166,
    [LineDensity.HIGH_SPEED_TRAIN]: 4.489278478293,
  },
  [Period.WEEK_END_NIGHT]: {
    [LineDensity.VERY_LOW]: 0.343136759757271,
    [LineDensity.LOW]: 0.662728497719637,
    [LineDensity.MEDIUM]: 0.832972502443062,
    [LineDensity.HIGH]: 1.27123052969331,
    [LineDensity.VERY_HIGH]: 2.26427504962707,
    [LineDensity.HIGH_SPEED_TRAIN]: 8.392685659006,
  },
  [Period.WEEK_END_DAY]: {
    [LineDensity.VERY_LOW]: 0.588837569009182,
    [LineDensity.LOW]: 1.13727161170964,
    [LineDensity.MEDIUM]: 1.42941604950099,
    [LineDensity.HIGH]: 2.1814863470312,
    [LineDensity.VERY_HIGH]: 3.88559362796338,
    [LineDensity.HIGH_SPEED_TRAIN]: 8.392685659006,
  },
  [Period.PEAK]: {
    [LineDensity.VERY_LOW]: 1.08891562888517,
    [LineDensity.LOW]: 2.10311291779541,
    [LineDensity.MEDIUM]: 2.64336593161831,
    [LineDensity.HIGH]: 4.03414187506801,
    [LineDensity.VERY_HIGH]: 7.18548350708179,
    [LineDensity.HIGH_SPEED_TRAIN]: 15.512762896402,
  },
  [Period.HYPER_PEAK]: {
    [LineDensity.VERY_LOW]: 2.20247983933926,
    [LineDensity.LOW]: 4.25383197695686,
    [LineDensity.MEDIUM]: 5.34656817735578,
    [LineDensity.HIGH]: 8.15959996007646,
    [LineDensity.VERY_HIGH]: 14.5336174520072,
    [LineDensity.HIGH_SPEED_TRAIN]: 31.376672947219,
  },
};

// TODO: this does not handle the day of the week
// Nor the ultra_peak (using the North-Midi junction during peak hours)
function getPeriod(edge: Edge, day: Day): Period {
  if (weekEnd(edge, day)) {
    if (included(edge, h(6, 0), h(18, 59))) {
      return Period.WEEK_END_DAY;
    }
    return Period.WEEK_END_NIGHT;
  }

  if (included(edge, h(6, 0), h(8, 59))) {
    return Period.PEAK;
  }

  if (included(edge, h(9, 0), h(18, 59))) {
    return Period.NORMAL;
  }

  return Period.OFF_PEAK;
}

function rules(
  edge: Edge,
  train: Train,
  edges: Edge[],
  index: number,
  day: Day
): Rule[] {
  const density = train.highSpeed
    ? LineDensity.HIGH_SPEED_TRAIN
    : edge.line.class;
  const period = getPeriod(edge, day);
  const coeff = coeffs[period][density];

  return [
    Rule.perKm(
      coeff * coutDirectUnitaire,
      `Rails : ${density}, ${period}`,
      RuleCategory.Tracks
    ),
    Rule.perkWh(0.06, 'Fourniture électricité'),
    Rule.perkWh(0.017, 'Utilisation caténaire'),
    Rule.perkWh(0.02, 'Distribution et pertes électriques'),
  ].concat(stationRules(edge, index === edges.length - 1));
}

export default rules;

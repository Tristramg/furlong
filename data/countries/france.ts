import lfp from './figueras_perpignan';
import { Rule, Edge, Train, StopTime } from '../../lib/types';
import { RuleCategory } from '../../lib/types.d';
import _ from 'lodash';

const classicTrain: Rule[] = [
  {
    perTonAndKm: 0.003230,
    perKm: 0.435,
    perkWh: 0,
    fixed: 0,
    label: 'Redevance circulation (RC)',
    category: RuleCategory.Tracks,
  },
  {
    perTonAndKm: 0,
    perKm: 0.294,
    perkWh: 0,
    fixed: 0,
    label: 'Accès aux installation électriques (RCE)',
    category: RuleCategory.Energy,
  },
  {
    perTonAndKm: 0,
    perKm: 0.076,
    perkWh: 0,
    fixed: 0,
    label: 'Pertes électriques (RCTE Composante A)',
    category: RuleCategory.Energy,
  },
  {
    perTonAndKm: 0,
    perKm: 0.240,
    perkWh: 0,
    fixed: 0,
    label: 'Distribution électriques (RCTE Composante B)',
    category: RuleCategory.Energy,
  },
  {
    perTonAndKm: 0,
    perKm: 0,
    perkWh: 0.06,
    fixed: 0,
    label: 'Fourniture énergie (estimation)',
    category: RuleCategory.Energy,
  },
];

const highSpeedTrain: Rule[] = [
  {
    perTonAndKm: 0.005874,
    perKm: 0.239,
    perkWh: 0,
    fixed: 0,
    label: 'Redevance circulation (RC)',
    category: RuleCategory.Tracks,
  },
  {
    perTonAndKm: 0,
    perKm: 0.294,
    perkWh: 0,
    fixed: 0,
    label: 'Accès aux installation électriques (RCE)',
    category: RuleCategory.Energy,
  },
  {
    perTonAndKm: 0,
    perKm: 0.118,
    perkWh: 0,
    fixed: 0,
    label: 'Pertes électriques RCTE Composante A',
    category: RuleCategory.Energy,
  },
  {
    perTonAndKm: 0,
    perKm: 0.372,
    perkWh: 0,
    fixed: 0,
    label: 'Distribution électriques RCTE Composante B',
    category: RuleCategory.Energy,
  },
];

const parisLyonExtra: Rule = {
  perTonAndKm: 0,
  perKm: 0.36,
  perkWh: 0,
  fixed: 0,
  label: 'Supplément Paris–Lyon (déploiement signalisation ERTMS)',
  category: RuleCategory.Tracks,
};

const highSpeedMarket = {
  BE: [20.83, 23.23],
  DE: [14.98, 16.69],
  ES: [14.68, 16.36],
  IT: [19.16, 21.35],
  transversale: [0, 0],
};

function marketRule(market: string, edge: Edge, train: Train): Rule {
  if (market === 'classic') {
    return Rule.perKm(0, 'Redevance marché train de nuit', RuleCategory.Tracks);
  }

  if (edge.line.highSpeed) {
    return Rule.perKm(highSpeedMarket[market][train.multipleUnit ? 1 : 0],
                      `Redevance marché grande vitesse vers ${market}, unité ${train.multipleUnit ? 'multiple' : 'simple'}`,
                      RuleCategory.Tracks);
  }

  return Rule.perKm(3.19, 'Train apte à la grande vitesse sur voie classique', RuleCategory.Tracks);
}

function marketClass(edges: Edge[]): string {
  if (_.some(edges, e => e.country === 'FR' && e.line.highSpeed)) {
    const countries = _(edges).map('country').uniq();
    if (countries.includes('BE')) {
      return 'BE';
    }
    // Going to Germany through Belgium counts as Belgium
    if (countries.includes('DE')) {
      return 'DE';
    }
    if (countries.includes('IT')) {
      return 'IT';
    }
    if (countries.includes('ES')) {
      return 'ES';
    }
    return 'transversale';
  }
  return 'classic';
}

function stationRule(station: StopTime): Rule[] {
  if (station.commercial) {
    return [
      Rule.station(station.station, 'Redevance quai (SNCF Réseau)'),
      Rule.station(station.track, 'Redevance Gares & Connexions'),
    ];
  }
  return [];
}

function stationRules(edge: Edge, last: boolean) {
  if (last) {
    return stationRule(edge.departure).concat(stationRule(edge.arrival));
  }
  return stationRule(edge.departure);
}

function rules(edge: Edge, train: Train,  edges: Edge[], index: number): Rule[] {
  if (edge.line.label === 'LFP') {
    return lfp(edge, train);
  }
  const market = marketClass(edges);
  const rules = market === 'classic' ? classicTrain : highSpeedTrain;
  const result = [marketRule(market, edge, train)].concat(rules);
  if (edge.line.label === 'LN1') {
    result.push(parisLyonExtra);
  }
  return result.concat(stationRules(edge, false));
}

export default rules;

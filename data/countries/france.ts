import { Rule, Edge, Train } from '../../lib/types';
import _ from 'lodash';

const classicTrain = [
  {
    per_ton_and_km: 0.003230,
    per_km: 0.435,
    per_kWh: 0,
    label: 'Redevance circulation (RC)',
  },
  {
    per_ton_and_km: 0,
    per_km: 0.294,
    per_kWh: 0,
    label: 'Accès aux installation électriques (RCE)',
  },
  {
    per_ton_and_km: 0,
    per_km: 0.076,
    per_kWh: 0,
    label: 'Pertes électriques (RCTE Composante A)',
  },
  {
    per_ton_and_km: 0,
    per_km: 0.240,
    per_kWh: 0,
    label: 'Distribution électriques (RCTE Composante B)',
  },
  {
    per_ton_and_km: 0,
    per_km: 0,
    per_kWh: 0.06,
    label: 'Fourniture énergie (estimation)',
  },
];

const highSpeedTrain = [
  {
    per_ton_and_km: 0.005874,
    per_km: 0.239,
    per_kWh: 0,
    label: 'Redevance circulation (RC)',
  },
  {
    per_ton_and_km: 0,
    per_km: 0.294,
    per_kWh: 0,
    label: 'Accès aux installation électriques (RCE)',
  },
  {
    per_ton_and_km: 0,
    per_km: 0.118,
    per_kWh: 0,
    label: 'Pertes électriques RCTE Composante A',
  },
  {
    per_ton_and_km: 0,
    per_km: 0.372,
    per_kWh: 0,
    label: 'Distribution électriques RCTE Composante B',
  },
];

const parisLyonExtra = {
  per_ton_and_km: 0,
  per_km: 0.36,
  per_kWh: 0,
  label: 'Supplément Paris–Lyon (déploiement signalisation ERTMS)',
};

const highSpeedMarket = {
  BE: [20.83, 23.23],
  DE: [14.98, 16.69],
  ES: [14.68, 16.36],
  IT: [19.16, 21.35],
  transversalse: [0, 0],
};

function marketRule(market: string, train: Train): Rule {
  if (market === 'classic') {
    return {
      per_ton_and_km: 0,
      per_km: 0,
      per_kWh: 0,
      label: 'Redevance marché train de nuit',
    };
  }

  return {
    per_ton_and_km: 0,
    per_km: highSpeedMarket[market][train.multipleUnit ? 1 : 0],
    per_kWh: 0,
    label: `Redevance marché grande vitesse vers ${market}, unité ${train.multipleUnit ? 'multiple' : 'simple'}`,
  };
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

function rules(edge: Edge, train: Train,  edges: Edge[]): Rule[] {
  const market = marketClass(edges);
  const rules = market === 'classic' ? highSpeedTrain : classicTrain;
  const result = [marketRule(market, train)].concat(rules);
  if (edge.line.label === 'LN1') {
    result.push(parisLyonExtra);
  }
  return result;
}

export default rules;

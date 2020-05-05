import { Rule, Edge, Train, ccCurent } from '../../lib/types';

const prices = {
  VL1: {
    A: 1.9275,
    B: 4.7931,
    C: 0.8020,
  },
  VL2: {
    A: 0.9258,
    B: 2.3017,
    C: 0.3835,
  },
  VL3: {
    A: 1.9275,
    B: 2.3017,
    C: 0.8020,
  },
  other: {
    A: 0.5133,
    B: 0.7320,
    C: 0.2039,
  },
  'LAV Madrid-Barcelona-Frontera': {
    A: 1.7611,
    B: 0.2317,
    C: 0.3023,
  },
  'LAV Madrid-Sevilla': {
    A: 0.8647,
    B: 0.1504,
    C: 0.1962,
  },
};

function rules(edge: Edge, train: Train): Rule[] {
  // TODO handle non gauge changing trains
  const cat = edge.line && edge.line.class === 'A' ? 'VL2' : 'other';

  const result = [
    {
      per_km: prices[cat]['A'],
      per_kWh: 0,
      per_ton_and_km: 0,
      label: `Modalidad A (réservaton sillon) ${cat}`,
    },
    {
      per_km: prices[cat]['B'],
      per_kWh: 0,
      per_ton_and_km: 0,
      label: `Modalidad B (utilisation sillon) ${cat}`,
    },
    {
      per_km: prices[cat]['C'],
      per_kWh: 0,
      per_ton_and_km: 0,
      label: `Modalidad C (utilisation installation électrique) ${cat}`,
    },
    {
      per_km: 0,
      per_kWh: 0.00112,
      per_ton_and_km: 0,
      label: 'Cout de gestion électricité (SC-2)',
    },
  ];

  if (edge.line && prices[edge.line.label]) {
    const line = edge.line.label;
    result.push(
      {
        per_km: prices[line]['A'],
        per_kWh: 0,
        per_ton_and_km: 0,
        label: `Supplément Modalidad A ligne chargée ${line}`,
      },
      {
        per_km: prices[line]['B'],
        per_kWh: 0,
        per_ton_and_km: 0,
        label: `Supplément Modalidad B ligne chargée ${line}`,
      },
      {
        per_km: prices[line]['C'],
        per_kWh: 0,
        per_ton_and_km: 0,
        label: `Supplément Modalidad C ligne chargée ${line}`,
      });
  }

  if (ccCurent(edge.line)) {
    result.push({
      per_km: 0,
      per_kWh: 0,
      per_ton_and_km: 3.207659 / 1000,
      label: 'Fourniture et distribution électricité courant continu',
    });
  } else {
    result.push(
      {
        per_km: 0,
        per_kWh: 0.0645,
        per_ton_and_km: 0,
        label: 'Fourniture électricité courant alternatif (energía)',
      },
      {
        per_km: 0,
        per_kWh: 0.032,
        per_ton_and_km: 0,
        label: 'Distribution électricité courant alternatif (coste ATR)',
      },
      );
  }

  return result;
}

export default rules;

import { Rule, Edge, Train } from '../lib/types'
import { h } from '../lib/helpers'

const prices = {
    'VL1': {
        'A': 1.9275,
        'B': 4.7931,
        'C': 0.8020,
    },
    'VL2': {
        'A': 0.9258,
        'B': 2.3017,
        'C': 0.3835,
    },
    'VL3': {
        'A': 1.9275,
        'B': 2.3017,
        'C': 0.8020,
    },
    'other': {
        'A': 0.5133,
        'B': 0.7320,
        'C': 0.2039,
    },
    'LAV Madrid-Sevilla': {
        'A': 1.7611,
        'B': 0.2317,
        'C': 0.3023,
    },
    'MadridToledoSevilleMalaga': {
        'A': 0.8647,
        'B': 0.1504,
        'C': 0.1962,
    }
}

function rules(edge: Edge, train: Train): Rule[] {
    //TODO handle non gauge changing trains
    const cat = edge.line && edge.line.class == 'A' ? 'VL1' : 'other';

    const result = [
        {
            per_km: prices[cat]['A'],
            per_kWh: 0,
            per_ton_and_km: 0,
            label: `Modalidad A (réservaton sillon) ${cat}`
        },
        {
            per_km: prices[cat]['B'],
            per_kWh: 0,
            per_ton_and_km: 0,
            label: `Modalidad B (utilisation sillon) ${cat}`
        },
        {
            per_km: prices[cat]['C'],
            per_kWh: 0,
            per_ton_and_km: 0,
            label: `Modalidad C (utilisation installation électrique) ${cat}`
        },
    ]

    if (edge.line && prices[edge.line.label]) {
        const line = edge.line.label;
        result.push({
            per_km: prices[line]['A'],
            per_kWh: 0,
            per_ton_and_km: 0,
            label: `Supplément Modalidad A (réservaton sillon) ${line}`
        },
        {
            per_km: prices[line]['B'],
            per_kWh: 0,
            per_ton_and_km: 0,
            label: `Supplément Modalidad B (réservaton sillon) ${line}`
        },
        {
            per_km: prices[line]['C'],
            per_kWh: 0,
            per_ton_and_km: 0,
            label: `Supplément Modalidad C (réservaton sillon) ${line}`
        })
    }

    return result;
}

export default rules;

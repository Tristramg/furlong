import { Rule, Edge, Train } from '../lib/types'

const energyDistribution: Rule = {
    per_km: 0,
    per_kWh: 0.0628,
    per_ton_and_km: 0,
    label: 'Distribution électricité',
}

const basic: Rule = {
    per_km: 4.76,
    per_kWh: 0,
    per_ton_and_km: 0,
    label: 'Prix de base « basic »'
}

const nacht: Rule = {
    per_km: 2.63,
    per_kWh: 0,
    per_ton_and_km: 0,
    label: 'Prix nuit « nacht »'
}

function rules(edge: Edge, train: Train): Rule[] {
    return [nacht, energyDistribution]
}

export default rules;

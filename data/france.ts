import { Rule, Edge, Train } from '../lib/types'
import { Country } from './countries';

const classicTrain = [
    {
        per_ton_and_km: 0.003230,
        per_km: 0.435,
        per_kWh: 0,
        label: 'Redevance circulation (RC)'
    },
    {
        per_ton_and_km: 0,
        per_km: 0.294,
        per_kWh: 0,
        label: 'Accès aux installation électriques (RCE)'
    },
    {
        per_ton_and_km: 0,
        per_km: 0.076,
        per_kWh: 0,
        label: 'Pertes électriques (RCTE Composante A)'
    },
    {
        per_ton_and_km: 0,
        per_km: 0.240,
        per_kWh: 0,
        label: 'Distribution électriques (RCTE Composante B)'
    }
]

const highSpeedTrain = [
    {
        per_ton_and_km: 0.005874,
        per_km: 0.239,
        per_kWh: 0,
        label: 'Redevance circulation (RC)'
    },
    {
        per_ton_and_km: 0,
        per_km: 0.294,
        per_kWh: 0,
        label: 'Accès aux installation électriques (RCE)'
    },
    {
        per_ton_and_km: 0,
        per_km: 0.118,
        per_kWh: 0,
        label: 'Pertes électriques RCTE Composante A'
    },
    {
        per_ton_and_km: 0,
        per_km: 0.372,
        per_kWh: 0,
        label: 'Distribution électriques RCTE Composante B'
    }
]

const parisLyonExtra = {
    per_ton_and_km: 0,
    per_km: 0.36,
    per_kWh: 0,
    label: 'Supplément Paris–Lyon (déploiement signalisation ERTMS)'
}
/*
const highSpeedMarket = {
    [Country.BE]: [20.83, 23.23],
    [Country.DE]: [14.98, 16.69],
    [Country.ES]: [14.68, 16.36],
    [Country.IT]: [19.16, 21.35]
}*/

function market(train: Train, country: Country): Rule {
    if (!train.highSpeed) {
        return {
            per_ton_and_km: 0,
            per_km: 0,
            per_kWh: 0,
            label: 'Redevance marché train de nuit'
        }
    } else if(country == Country.BE) {
        return {
            per_ton_and_km: 0,
            per_km: 20.83,
            per_kWh: 0,
            label: 'Redevance marché grande vitesse vers Belgique'
        }
    }
}

function rules(edge: Edge, train: Train): Rule[] {
    const rules = train.highSpeed? highSpeedTrain : classicTrain;
    return [market(train, edge.country)].concat(rules);
}

export default rules;

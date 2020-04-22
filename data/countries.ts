import belgium from './belgium'
import france from './france'
import { Rule, Segment, Train } from '../lib/types'

enum Country {
    BE = 'Belgique',
    DE = 'Allemagne',
    ES = 'Espagne',
    FR = 'France',
    IT = 'Italie',
    PT = 'Portugal',
}

const countryRule = {
    [Country.BE]: belgium,
    [Country.FR]: france,
}

function rules(segment: Segment, train: Train): Rule[] {
    return countryRule[segment.country](segment, train)
}

export {rules, Country};

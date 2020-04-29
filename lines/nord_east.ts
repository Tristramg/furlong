
import { Country } from '../data/countries'
import { Node, Edge, Route} from '../lib/types'
import { h } from '../lib/helpers'
import _ from 'lodash'

const nodes = new Map<string, Node>();
['Paris Garde du Nord', 'Frontière FR-BE'].forEach(label => nodes.set(label, new Node(label, Country.FR)));
['Hal', 'Bruxelles Midi', 'Bruxelles Nord', 'Leuven', 'Liège', 'Frontière BE-DE'].forEach(label => nodes.set(label, new Node(label, Country.BE)));
['Hamburg', 'Berlin'].forEach(label => nodes.set(label, new Node(label, Country.DE)))

const edges: Edge[] = [
  {
    start: nodes.get('Paris Garde du Nord'),
    end: nodes.get('Frontière FR-BE'),
    label: '',
    distance: 231,
    country: Country.FR,
    departure_time:  h(20, 0),
    arrival_time: h(22, 30),
  },
  {
    distance: 66,
    start: nodes.get('Frontière FR-BE'),
    end: nodes.get('Hal'),
    label: "96",
    country: Country.BE,
    departure_time:  h(22, 30),
    arrival_time: h(23, 0),
  },
  {
    distance: 13,
    start: nodes.get('Hal'),
    end: nodes.get('Bruxelles Midi'),
    label: "96",
    country: Country.BE,
    departure_time:  h(23, 0),
    arrival_time: h(23, 30),
  },
  {
    distance: 4,
    start: nodes.get('Bruxelles Midi'),
    end: nodes.get('Bruxelles Nord'),
    label: "Jonction Nord-Midi",
    country: Country.BE,
    departure_time:  h(23, 30),
    arrival_time: h(23, 40),
  },
  {
    distance: 30,
    start: nodes.get('Bruxelles Nord'),
    end: nodes.get('Leuven'),
    label: "36",
    country: Country.BE,
    departure_time:  h(23, 40),
    arrival_time: h(1, 0),
  },
  {
    distance: 70,
    start: nodes.get('Leuven'),
    end: nodes.get('Liège'),
    label: "36",
    country: Country.BE,
    departure_time:  h(1, 0),
    arrival_time: h(1, 30),
  },
  {
    distance: 42,
    start: nodes.get('Leuven'),
    end: nodes.get('Frontière BE-DE'),
    label: "3",
    country: Country.BE,
    departure_time:  h(1, 30),
    arrival_time: h(2, 0),
  },
  {
    distance: 477,
    start: nodes.get('Frontière BE-DE'),
    end: nodes.get('Hamburg'),
    label: '',
    country: Country.DE,
    departure_time:  h(2, 0),
    arrival_time: h(6, 0),
  },
  {
    distance: 286,
    start: nodes.get('Hamburg'),
    end: nodes.get('Berlin'),
    label: '',
    country: Country.DE,
    departure_time:  h(6, 0),
    arrival_time: h(8, 0),
  },
]

export default {
    label: "Nord East",
    segments: edges,
};

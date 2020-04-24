
import { Country } from '../data/countries'
import { Node, Edge } from '../lib/types'
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
  },
  {
    distance: 66,
    start: nodes.get('Frontière FR-BE'),
    end: nodes.get('Hal'),
    label: "96",
    country: Country.BE,
  },
  {
    distance: 13,
    start: nodes.get('Hal'),
    end: nodes.get('Bruxelles Midi'),
    label: "96",
    country: Country.BE,
  },
  {
    distance: 4,
    start: nodes.get('Bruxelles Midi'),
    end: nodes.get('Bruxelles Nord'),
    label: "Jonction Nord-Midi",
    country: Country.BE,
  },
  {
    distance: 30,
    start: nodes.get('Bruxelles Nord'),
    end: nodes.get('Leuven'),
    label: "36",
    country: Country.BE,
  },
  {
    distance: 70,
    start: nodes.get('Leuven'),
    end: nodes.get('Liège'),
    label: "36",
    country: Country.BE,
  },
  {
    distance: 42,
    start: nodes.get('Leuven'),
    end: nodes.get('Frontière BE-DE'),
    label: "3",
    country: Country.BE,
  },
  {
    distance: 477,
    start: nodes.get('Frontière BE-DE'),
    end: nodes.get('Hamburg'),
    label: '',
    country: Country.DE,
  },
  {
    distance: 286,
    start: nodes.get('Hamburg'),
    end: nodes.get('Berlin'),
    label: '',
    country: Country.DE,
  },
]

export default {
  label: "Nord East",
  highSpeed: false,
  gaugeChange: false,
  segments: edges,
};

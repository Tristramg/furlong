
import { Country } from '../data/countries'
const france = [
  {
    distance: 231,
    from: 'Paris Gare du Nord',
    to: 'Frontière FR-BE',
    label: '',
    country: Country.FR
  }
]

const belgique = [
  {
    distance: 66,
    from: "Frontière FR-BE",
    to: "Hal",
    label: "96",
    country: Country.BE,
  },
  {
    distance: 13,
    from: "Hal",
    to: "Bruxelles Midi",
    label: "96",
    country: Country.BE,
  },
  {
    distance: 4,
    from: "Bruxelles Midi",
    to: "Bruxelles Nord",
    label: "Jonction Nord-Midi",
    country: Country.BE,
  },
  {
    distance: 30,
    from: "Bruxelles Nord",
    to: "Leuven",
    label: "36",
    country: Country.BE,
  },
  {
    distance: 70,
    from: "Leuven",
    to: "Liège",
    label: "36",
    country: Country.BE,
  },
  {
    distance: 42,
    from: "Leuven",
    to: "Frontière BE-DE",
    label: "3",
    country: Country.BE,
  },
]

export default {
  label: "Nord East",
  highSpeed: false,
  gaugeChange: false,
  segments: france.concat(belgique),
};

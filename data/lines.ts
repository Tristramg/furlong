import { h } from '../lib/helpers';
import * as Trains from './trains';

export default {
  nordEst: {
    label: 'Nord Est',
    train: Trains.talgo230,
    steps: [
      ['Paris Gare du Nord', h(20, 0)],
      ['Frontière FR-BE', h(22, 30)],
      ['Hal', h(23, 0)],
      ['Bruxelles Midi', h(23, 30)],
      ['Bruxelles Nord', h(23, 40)],
      ['Leuven', h(1, 0)],
      ['Liège', h(1, 30)],
      ['Frontière BE-DE', h(2, 0)],
      ['Hamburg Hbf', h(6, 0)],
      ['Berlin Hbf', h(8, 0)],
    ],
  },
  nordEstDirect: {
    label: 'Nord Est Direct',
    train: Trains.talgo230,
    steps: [
      ['Paris Garde de l’est', h(20, 0)],
      ['Frontière FR-DE', h(0, 0)],
      ['Halle', h(6, 0)],
      ['Berlin Hbf', h(8, 0)],
    ],
  },
  castilla: {
    label: 'Castilla',
    train: Trains.talgo230,
    steps: [
      ['Paris Montparnasse', h(20, 0)],
      ['Embranchement de Monts', h(21, 0)],
      ['La Gorp', h(22, 20)],
      ['Bordeaux Saint-Jean', h(22, 30)],
      ['Frontière FR-ES', h(0, 0)],
      ['Valladolid Campo Grande', h(6, 0)],
      ['Madrid Chamartín', h(7, 30)],
      ['Madrid Atocha', h(7, 40)],
      ['Sevilla Santa Justa', h(9, 0)],
    ],
  },
  lisboa: {
    label: 'Lisboa',
    train: Trains.talgo230,
    steps: [
      ['Paris Montparnasse', h(20, 0)],
      ['Embranchement de Monts', h(21, 0)],
      ['La Gorp', h(22, 20)],
      ['Bordeaux Saint-Jean', h(22, 30)],
      ['Frontière FR-ES', h(0, 0)],
      ['Valladolid Campo Grande', h(4, 0)],
      ['Frontière ES-PT', h(6, 0)],
      ['Coimbra-B', h(8, 0)],
      ['Lisboa Oriente', h(10, 0)],
    ],
  },
  barça: {
    label: 'Paris Barcelone Madrid',
    train: Trains.talgo230,
    steps: [
      ['Paris Gare de Lyon', h(20, 0)],
      ['Lyon Part-dieu', h(22, 30)],
      ['Montpellier Sud de France', h(23, 50)],
      ['Perpignan', h(5, 30)],
      ['Frontière FR-CAT', h(5, 45)],
      ['Girona', h(6, 0)],
      ['Barcelona Sants', h(6, 45)],
      ['Camp de Tarragona', h(7, 30)],
      ['Zaragoza Delicias', h(8, 50)],
      ['Madrid Atocha', h(10, 0)],
    ],
  },
};

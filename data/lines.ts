import { h } from '../lib/helpers';
import * as Trains from './trains';

export default {
  nordEst: {
    label: 'Nord Est',
    train: Trains.talgo230,
    steps: [
      ['Paris Gare du Nord', h(20, 0), true],
      ['Frontière FR-BE', h(22, 30), false],
      ['Hal', h(23, 0), false],
      ['Bruxelles Midi', h(23, 30), true],
      ['Bruxelles Nord', h(23, 40), false],
      ['Leuven', h(1, 0), false],
      ['Liège', h(1, 30), true],
      ['Frontière BE-DE', h(2, 0), false],
      ['Hamburg Hbf', h(6, 0), true],
      ['Berlin Hbf', h(8, 0), true],
    ],
  },
  nordEstGV: {
    label: 'Nord Est Grande Vitesse',
    train: Trains.talgo250,
    steps: [
      ['Paris Gare du Nord', h(20, 0), true],
      ['Lille Flandres', h(21, 30), true],
      ['Frontière FR-BE GV', h(21, 15), false],
      ['Hal', h(23, 0), false],
      ['Bruxelles Midi', h(23, 30), true],
      ['Bruxelles Nord', h(23, 40), false],
      ['Leuven', h(1, 0), false],
      ['Liège', h(1, 30), true],
      ['Frontière BE-DE', h(2, 0), false],
      ['Hamburg Hbf', h(6, 0), true],
      ['Berlin Hbf', h(8, 0), true],
    ],
  },
  nordEstDirect: {
    label: 'Nord Est Direct',
    train: Trains.talgo230,
    steps: [
      ['Paris Gare de l’est', h(19, 30), true],
      ['Frontière FR-DE', h(23, 30), false],
      ['Halle', h(5, 30), false],
      ['Berlin Hbf', h(7, 0), true],
    ],
  },
  nordEstDirectBe: {
    label: 'Nord Est via Belgique',
    train: Trains.talgo230,
    steps: [
      ['Paris Gare du Nord', h(20, 0), true],
      ['Frontière FR-BE Jeumont', h(22, 30), false],
      ['Charlerois', h(22, 50), true],
      ['Namur', h(23, 10), false],
      ['Liège', h(23, 40), false],
      ['Frontière BE-DE', h(0, 0), false],
      ['Berlin Hbf', h(6, 0), true],
    ],
  },
  castillaGV: {
    label: 'Castilla',
    train: Trains.talgo250,
    steps: [
      ['Paris Montparnasse', h(20, 0), true],
      ['Embranchement de Monts', h(21, 0), false],
      ['La Gorp', h(22, 20), false],
      ['Bordeaux Saint-Jean', h(22, 30), true],
      ['Frontière FR-ES', h(0, 0), false],
      ['Valladolid Campo Grande', h(6, 0), true],
      ['Madrid Chamartín', h(7, 30), true],
      ['Madrid Atocha', h(7, 40), false],
      ['Sevilla Santa Justa', h(9, 0), true],
    ],
  },
  castillaClassic: {
    label: 'Castilla Classique',
    train: Trains.talgo230,
    steps: [
      ['Paris Austerlitz', h(20, 0), true],
      ['Orléans Les Aubrais', h(21, 0), true],
      ['Saint Pierre des Corps', h(21, 50), true],
      ['Poitiers', h(22, 40), true],
      ['Angoulême', h(0, 0), false],
      ['Bordeaux Saint-Jean', h(1, 0), false],
      ['Frontière FR-ES', h(2, 30), false],
      ['Valladolid Campo Grande', h(6, 30), false],
      ['Madrid Chamartín', h(8, 30), false],
    ],
  },
  lisboa: {
    label: 'Lisboa',
    train: Trains.talgo230,
    steps: [
      ['Paris Montparnasse', h(20, 0), true],
      ['Embranchement de Monts', h(21, 0), false],
      ['La Gorp', h(22, 20), false],
      ['Bordeaux Saint-Jean', h(22, 30), true],
      ['Frontière FR-ES', h(0, 0), false],
      ['Valladolid Campo Grande', h(4, 0), false],
      ['Frontière ES-PT', h(6, 0), false],
      ['Coimbra-B', h(8, 0), true],
      ['Lisboa Oriente', h(10, 0), true],
    ],
  },
  barça: {
    label: 'Paris Barcelone Madrid',
    train: Trains.talgo250,
    steps: [
      ['Paris Gare de Lyon', h(20, 0), true],
      ['Lyon Part-dieu', h(22, 30), true],
      ['Montpellier Sud de France', h(23, 50), false],
      ['Perpignan', h(5, 30), false],
      ['Frontière FR-CAT', h(5, 45), false],
      ['Girona', h(6, 0), true],
      ['Barcelona Sants', h(6, 45), true],
      ['Camp de Tarragona', h(7, 30), true],
      ['Zaragoza Delicias', h(8, 50), true],
      ['Madrid Atocha', h(10, 0), true],
    ],
  },
};

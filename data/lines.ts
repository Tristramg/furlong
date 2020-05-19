import { h } from '../lib/helpers';
import * as Trains from './trains';
import { Train } from '../lib/types';
import Step from '../lib/step';

interface Line {
  label: string;
  train: Train;
  steps: Step[];
}

const lines: { [id: string]: Line } = {
  nordEst: {
    label: 'Paris–Bruxelles–Hambourg–Berlin',
    train: Trains.talgo230,
    steps: [
      new Step('Paris Gare du Nord', h(20, 0), h(8, 0), true),
      new Step('Frontière FR-BE', h(22, 30), h(6, 30), false),
      new Step('Hal', h(23, 0), h(5, 30), false),
      new Step('Bruxelles Midi', h(23, 30), h(6, 30), true),
      new Step('Bruxelles Nord', h(23, 40), h(4, 20), false),
      new Step('Leuven', h(1, 0), h(3, 0), false),
      new Step('Liège', h(1, 30), h(2, 30), false),
      new Step('Frontière BE-DE', h(2, 0), h(2, 0), false),
      new Step('Hamburg Hbf', h(6, 0), h(22, 0), true),
      new Step('Berlin Hbf', h(8, 0), h(20, 0), true),
    ],
  },
  nordEstGV: {
    label: 'Paris–Bruxelles–Hambourg–Berlin Grande Vitesse',
    train: Trains.talgo250,
    steps: [
      new Step('Paris Gare du Nord', h(20, 0), h(8, 15), true),
      new Step('Lille Flandres', h(21, 15), h(7, 0), true),
      new Step('Frontière FR-BE GV', h(21, 30), h(7, 0), false),
      new Step('Hal', h(21, 50), h(6, 30), false),
      new Step('Bruxelles Midi', h(22, 0), h(6, 1), true),
      new Step('Bruxelles Nord', h(22, 10), h(5, 50), false),
      new Step('Leuven', h(1, 0), h(3, 30), false),
      new Step('Liège', h(1, 30), h(3, 0), false),
      new Step('Frontière BE-DE', h(2, 0), h(2, 0), false),
      new Step('Hamburg Hbf', h(6, 0), h(22, 0), true),
      new Step('Berlin Hbf', h(7, 50), h(20, 10), true),
    ],
  },
  nordEstDirectHamburg: {
    label: 'Paris–Berlin–Hambourg',
    train: Trains.talgo230,
    steps: [
      new Step('Paris Gare de l’est', h(19, 30), h(9, 30), true),
      new Step('Frontière FR-DE', h(23, 30), h(5, 30), false),
      new Step('Halle', h(4, 30), h(0, 30), false),
      new Step('Berlin Hbf', h(6, 0), h(22, 0), true),
      new Step('Hamburg Hbf', h(8, 0), h(20, 0), true),
    ],
  },
  nordEstDirect: {
    label: 'Paris–Berlin',
    train: Trains.talgo230,
    steps: [
      new Step('Paris Gare de l’est', h(19, 30), h(8, 30), true),
      new Step('Frontière FR-DE', h(23, 30), h(4, 30), false),
      new Step('Halle', h(4, 30), h(23, 30), false),
      new Step('Berlin Hbf', h(6, 0), h(22, 0), true),
    ],
  },
  nordEstDirectBeHamburg: {
    label: 'Paris–Charlerois–Hambourg–Berlin ',
    train: Trains.talgo230,
    steps: [
      new Step('Paris Gare du Nord', h(20, 0), h(9, 0), true),
      new Step('Frontière FR-BE Jeumont', h(22, 30), h(6, 30), false),
      new Step('Charlerois', h(22, 50), h(5, 10), true),
      new Step('Namur', h(23, 10), h(4, 50), false),
      new Step('Liège', h(23, 40), h(4, 20), false),
      new Step('Frontière BE-DE', h(0, 0), h(4, 0), false),
      new Step('Hamburg Hbf', h(6, 0), h(22, 0), true),
      new Step('Berlin Hbf', h(8, 0), h(20, 0), true),
    ],
  },
  nordEstDirectBe: {
    label: 'Paris–Charlerois–Berlin ',
    train: Trains.talgo230,
    steps: [
      new Step('Paris Gare du Nord', h(20, 0), h(8, 0), true),
      new Step('Frontière FR-BE Jeumont', h(22, 30), h(5, 30), false),
      new Step('Charlerois', h(22, 50), h(5, 10), true),
      new Step('Namur', h(23, 10), h(4, 50), false),
      new Step('Liège', h(23, 40), h(4, 20), false),
      new Step('Frontière BE-DE', h(0, 0), h(4, 0), false),
      new Step('Hannover HbF', h(4, 0), h(0, 0), false),
      new Step('Berlin Hbf', h(6, 0), h(22, 0), true),
    ],
  },
  castillaGV: {
    label: 'Castilla',
    train: Trains.talgo250,
    steps: [
      new Step('Paris Montparnasse', h(20, 0), h(8, 30), true),
      new Step('Embranchement de Monts', h(21, 0), h(7, 30), false),
      new Step('La Gorp', h(22, 20), h(6, 10), false),
      new Step('Bordeaux Saint-Jean', h(22, 30), h(6, 0), true),
      new Step('Frontière FR-ES', h(0, 0), h(4, 0), false),
      new Step('Valladolid Campo Grande', h(6, 0), h(22, 0), true),
      new Step('Madrid Chamartín', h(7, 30), h(20, 30), true),
      new Step('Madrid Atocha', h(7, 40), h(20, 20), false),
      new Step('Sevilla Santa Justa', h(9, 0), h(19, 0), true),
    ],
  },
  castillaClassic: {
    label: 'Castilla Classique',
    train: Trains.talgo230,
    steps: [
      new Step('Paris Austerlitz', h(20, 0), h(8, 30), true),
      new Step('Orléans Les Aubrais', h(21, 0), h(7, 30), true),
      new Step('Saint Pierre des Corps', h(21, 50), h(6, 40), true),
      new Step('Poitiers', h(22, 40), h(6, 0), true),
      new Step('Angoulême', h(0, 0), h(4, 0), false),
      new Step('Bordeaux Saint-Jean', h(1, 0), h(3, 0), false),
      new Step('Frontière FR-ES', h(2, 30), h(2, 0), false),
      new Step('Valladolid Campo Grande', h(6, 30), h(22, 0), false),
      new Step('Madrid Chamartín', h(8, 30), h(20, 0), false),
    ],
  },
  lisboa: {
    label: 'Lisboa',
    train: Trains.talgo250,
    steps: [
      new Step('Paris Montparnasse', h(20, 0), h(8, 30), true),
      new Step('Embranchement de Monts', h(21, 0), h(7, 30), false),
      new Step('La Gorp', h(22, 20), h(6, 10), false),
      new Step('Bordeaux Saint-Jean', h(22, 30), h(6, 0), true),
      new Step('Frontière FR-ES', h(0, 0), h(4, 0), false),
      new Step('Valladolid Campo Grande', h(4, 0), h(1, 0), false),
      new Step('Frontière ES-PT', h(6, 0), h(23, 0), false),
      new Step('Coimbra-B', h(8, 0), h(21, 0), true),
      new Step('Lisboa Oriente', h(10, 0), h(19, 0), true),
    ],
  },
  barça: {
    label: 'Paris Barcelone Madrid',
    train: Trains.talgo250,
    steps: [
      new Step('Paris Gare de Lyon', h(20, 0), h(8, 30), true),
      new Step('Lyon Part-dieu', h(22, 30), h(6, 0), true),
      new Step('Montpellier Sud de France', h(23, 50), h(4, 0), false),
      new Step('Perpignan', h(5, 30), h(0, 10), false),
      new Step('Frontière FR-CAT', h(5, 45), h(23, 45), false),
      new Step('Girona', h(6, 0), h(23, 30), true),
      new Step('Barcelona Sants', h(6, 45), h(22, 45), true),
      new Step('Camp de Tarragona', h(7, 30), h(22, 0), true),
      new Step('Zaragoza Delicias', h(8, 50), h(20, 40), true),
      new Step('Madrid Atocha', h(10, 0), h(19, 30), true),
    ],
  },
  roma: {
    label: 'Paris Florence Rome',
    train: Trains.talgo230,
    steps: [
      new Step('Paris Austerlitz', h(20, 0), h(9, 0), true),
      new Step('Dijon', h(22, 40), h(6, 20), false),
      new Step('Lyon Part-dieu', h(0, 30), h(4, 30), false),
      new Step('Frontière FR-IT', h(2, 0), h(3, 0), false),
      new Step('Genova', h(4, 0), h(1, 0), false),
      new Step('Firenze Campo di Marte', h(6, 20), h(22, 40), true),
      new Step('Roma Termini', h(9, 0), h(20, 0), true),
    ],
  },
  romagv: {
    label: 'Paris Florence Rome Naples Grande Vitesse FR+IT',
    train: Trains.talgo250,
    steps: [
      new Step('Paris Gare de Lyon', h(21, 0), h(8, 30), true),
      new Step('Lyon Part-dieu', h(23, 30), h(6, 0), false),
      new Step('Frontière FR-IT', h(1, 0), h(4, 30), false),
      new Step('Torino Lingotto', h(2, 0), h(3, 30), false),
      new Step('Milano Porta Garibaldi', h(4, 0), h(1, 30), false),
      new Step('Bologna Centrale', h(5, 30), h(23, 50), false),
      new Step('Firenze Campo di Marte', h(6, 20), h(23, 0), true),
      new Step('Direttissima', h(7, 40), h(22, 35), false),
      new Step('Roma Termini', h(8, 0), h(21, 15), true),
      new Step('Napoli Centrale', h(9, 15), h(20, 0), true),
    ],
  },
  romagvit: {
    label: 'Paris Florence Rome Naples Grande Vitesse IT',
    train: Trains.talgo250,
    steps: [
      new Step('Paris Austerlitz', h(20, 0), h(9, 0), true),
      new Step('Dijon', h(22, 40), h(6, 20), false),
      new Step('Lyon Part-dieu', h(0, 30), h(4, 30), false),
      new Step('Frontière FR-IT', h(2, 0), h(3, 0), false),
      new Step('Torino Lingotto', h(2, 30), h(2, 30), false),
      new Step('Milano Porta Garibaldi', h(4, 0), h(1, 30), false),
      new Step('Bologna Centrale', h(5, 30), h(23, 50), false),
      new Step('Firenze Campo di Marte', h(6, 20), h(23, 0), true),
      new Step('Direttissima', h(7, 40), h(22, 15), false),
      new Step('Roma Termini', h(8, 0), h(21, 15), true),
      new Step('Napoli Centrale', h(9, 15), h(20, 0), true),
    ],
  },
};

export default lines;

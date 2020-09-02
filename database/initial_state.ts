import * as t from './types.d';

const initialState: t.State = {
  units: [
    {
      name: 'Cocon',
      pax: 1,
      id: '0',
    },
    {
      name: 'Chambre double',
      pax: 2,
      id: '1',
    },
    {
      name: 'Chambre double luxe',
      pax: 2,
      id: '2',
    },
    {
      name: 'Place assise restaurant',
      pax: 0,
      id: '3',
    },
    {
      name: 'Place debout bar',
      pax: 0,
      id: '4',
    },
  ],
  cars: [
    {
      name: 'Locomotive Vectron',
      id: '0',
      weight: 90,
      units: [],
    },
    {
      name: 'Voiture passager RIV',
      id: '1',
      weight: 45,
      units: [
        { id: '0', count: 20, price: 100 },
        { id: '1', count: 6, price: 200 },
        { id: '2', count: 2, price: 300 },
      ],
    },
    {
      name: 'Voiture bar-restaurant RIV',
      id: '2',
      weight: 45,
      units: [
        { id: '3', count: 10, price: 20 },
        { id: '4', count: 30, price: 50 },
      ],
    },
    {
      name: 'Voiture passager Talgo',
      id: '3',
      weight: 17,
      units: [
        { id: '0', count: 10, price: 100 },
        { id: '1', count: 3, price: 200 },
        { id: '2', count: 1, price: 300 },
      ],
    },
    {
      name: 'Voiture bar talgo',
      id: '4',
      weight: 17,
      units: [{ id: '3', count: 10, price: 20 }],
    },
    {
      name: 'Voiture restaurant talgo',
      id: '5',
      weight: 45,
      units: [{ id: '4', count: 30, price: 50 }],
    },
  ],
  trains: [
    {
      name: 'Train Siemens',
      cars: [
        { id: '0', count: 1 },
        { id: '1', count: 11 },
        { id: '2', count: 1 },
      ],
      id: '0',
    },
    {
      name: 'Train Talgo 230',
      cars: [
        { id: '0', count: 1 },
        { id: '3', count: 22 },
        { id: '4', count: 1 },
        { id: '5', count: 1 },
      ],
      id: '0',
    },
  ],
  line: {
    stations: [],
    segments: [],
  },
};

export default initialState;

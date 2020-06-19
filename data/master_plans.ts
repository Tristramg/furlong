import Trains from './trains';

const standard = {
  data: {
    nordEst: {
      2024: { trainId: 'halfViaggio', count: 2, pax: 100 },
      2025: { trainId: 'halfViaggio', count: 2, pax: 130 },
      2026: { trainId: 'halfViaggio', count: 2, pax: 170 },
      2027: { trainId: 'fullViaggio', count: 2, pax: 210 },
      2028: { trainId: 'fullViaggio', count: 2, pax: 250 },
      2029: { trainId: 'fullViaggio', count: 2, pax: 290 },
      2030: { trainId: 'fullViaggio', count: 2, pax: 330 },
    },
    roma: {
      2025: { trainId: 'halfViaggio', count: 2, pax: 100 },
      2026: { trainId: 'halfViaggio', count: 2, pax: 130 },
      2027: { trainId: 'halfViaggio', count: 2, pax: 170 },
      2028: { trainId: 'fullViaggio', count: 2, pax: 210 },
      2029: { trainId: 'fullViaggio', count: 2, pax: 250 },
      2030: { trainId: 'fullViaggio', count: 2, pax: 290 },
    },
    castillaClassic: {
      2026: { trainId: 'halfViaggio', count: 2, pax: 100 },
      2027: { trainId: 'halfViaggio', count: 2, pax: 130 },
      2028: { trainId: 'halfViaggio', count: 2, pax: 170 },
      2029: { trainId: 'fullViaggio', count: 2, pax: 210 },
      2030: { trainId: 'fullViaggio', count: 2, pax: 250 },
    },
  },

  spare: {
    2024: [
      [Trains.vectron, 1],
      [Trains.viaggioRestaurant, 1],
    ],
    2025: [
      [Trains.vectron, 2],
      [Trains.viaggioRestaurant, 1],
    ],
    2026: [
      [Trains.vectron, 3],
      [Trains.viaggioRestaurant, 1],
    ],
    2027: [
      [Trains.vectron, 3],
      [Trains.viaggioRestaurant, 1],
    ],
    2028: [
      [Trains.vectron, 3],
      [Trains.viaggioRestaurant, 1],
    ],
    2029: [
      [Trains.vectron, 3],
      [Trains.viaggioRestaurant, 1],
    ],
    2030: [
      [Trains.vectron, 3],
      [Trains.viaggioRestaurant, 1],
    ],
  },
};

const standardNoBelgium = {
  data: {
    nordEstDirectHamburg: {
      2024: { trainId: 'halfViaggio', count: 2, pax: 100 },
      2025: { trainId: 'halfViaggio', count: 2, pax: 130 },
      2026: { trainId: 'halfViaggio', count: 2, pax: 170 },
      2027: { trainId: 'fullViaggio', count: 2, pax: 210 },
      2028: { trainId: 'fullViaggio', count: 2, pax: 250 },
      2029: { trainId: 'fullViaggio', count: 2, pax: 290 },
      2030: { trainId: 'fullViaggio', count: 2, pax: 330 },
    },
    roma: {
      2025: { trainId: 'halfViaggio', count: 2, pax: 100 },
      2026: { trainId: 'halfViaggio', count: 2, pax: 130 },
      2027: { trainId: 'halfViaggio', count: 2, pax: 170 },
      2028: { trainId: 'fullViaggio', count: 2, pax: 210 },
      2029: { trainId: 'fullViaggio', count: 2, pax: 250 },
      2030: { trainId: 'fullViaggio', count: 2, pax: 290 },
    },
    castillaClassic: {
      2026: { trainId: 'halfViaggio', count: 2, pax: 100 },
      2027: { trainId: 'halfViaggio', count: 2, pax: 130 },
      2028: { trainId: 'halfViaggio', count: 2, pax: 170 },
      2029: { trainId: 'fullViaggio', count: 2, pax: 210 },
      2030: { trainId: 'fullViaggio', count: 2, pax: 250 },
    },
  },

  spare: {
    2024: [
      [Trains.vectron, 1],
      [Trains.viaggioRestaurant, 1],
    ],
    2025: [
      [Trains.vectron, 2],
      [Trains.viaggioRestaurant, 1],
    ],
    2026: [
      [Trains.vectron, 3],
      [Trains.viaggioRestaurant, 1],
    ],
    2027: [
      [Trains.vectron, 3],
      [Trains.viaggioRestaurant, 1],
    ],
    2028: [
      [Trains.vectron, 3],
      [Trains.viaggioRestaurant, 1],
    ],
    2029: [
      [Trains.vectron, 3],
      [Trains.viaggioRestaurant, 1],
    ],
    2030: [
      [Trains.vectron, 3],
      [Trains.viaggioRestaurant, 1],
    ],
  },
};

const standardDouble = {
  data: {
    nordEst: {
      2024: { trainId: 'double', count: 2, pax: 100 },
      2025: { trainId: 'double', count: 2, pax: 130 },
      2026: { trainId: 'double', count: 2, pax: 160 },
      2027: { trainId: 'double', count: 2, pax: 190 },
      2028: { trainId: 'double', count: 2, pax: 220 },
      2029: { trainId: 'double', count: 2, pax: 250 },
      2030: { trainId: 'double', count: 2, pax: 280 },
    },
    roma: {
      2025: { trainId: 'double', count: 2, pax: 100 },
      2026: { trainId: 'double', count: 2, pax: 130 },
      2027: { trainId: 'double', count: 2, pax: 160 },
      2028: { trainId: 'double', count: 2, pax: 190 },
      2029: { trainId: 'double', count: 2, pax: 220 },
      2030: { trainId: 'double', count: 2, pax: 250 },
    },
    castillaClassic: {
      2026: { trainId: 'double', count: 2, pax: 100 },
      2027: { trainId: 'double', count: 2, pax: 130 },
      2028: { trainId: 'double', count: 2, pax: 160 },
      2029: { trainId: 'double', count: 2, pax: 190 },
      2030: { trainId: 'double', count: 2, pax: 220 },
    },
  },

  spare: {
    2024: [
      [Trains.vectron, 1],
      [Trains.viaggioRestaurant, 1],
    ],
    2025: [
      [Trains.vectron, 2],
      [Trains.viaggioRestaurant, 1],
    ],
    2026: [
      [Trains.vectron, 3],
      [Trains.viaggioRestaurant, 1],
    ],
    2027: [
      [Trains.vectron, 3],
      [Trains.viaggioRestaurant, 1],
    ],
    2028: [
      [Trains.vectron, 3],
      [Trains.viaggioRestaurant, 1],
    ],
    2029: [
      [Trains.vectron, 3],
      [Trains.viaggioRestaurant, 1],
    ],
    2030: [
      [Trains.vectron, 3],
      [Trains.viaggioRestaurant, 1],
    ],
  },
};

export default { standard, standardNoBelgium, standardDouble };

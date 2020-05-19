import { Train } from '../lib/types';

const talgo230: Train = {
  label: 'Talgo',
  highSpeed: false,
  gaugeChange: true,
  weight: 320,
  cars: 14,
  multipleUnit: false,
  capacity: 200,
};

const talgo250: Train = {
  label: 'Talgo 250',
  highSpeed: true,
  gaugeChange: true,
  weight: 330,
  cars: 12,
  multipleUnit: false,
  capacity: 160,
};

export { talgo230, talgo250 };

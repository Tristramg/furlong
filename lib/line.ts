import { Train } from './types';
import Step from './step';

interface Line {
  label: string;
  train: Train;
  steps: Step[];
}

export default Line;

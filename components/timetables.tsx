import * as React from 'react';
import _ from 'lodash';
import Line from '../lib/line';
import Step from '../lib/step';
import { fh } from '../lib/helpers';

type TimetableProps = {
  steps: Step[];
  forward: boolean;
};

const Timetable: React.FunctionComponent<TimetableProps> = ({
  steps,
  forward,
}: TimetableProps) => (
  <ul>
    {steps.map((step: Step) => (
      <li key={step.station}>
        <span className="font-mono px-4">
          {fh(forward ? step.forwardTime : step.returnTime)}
        </span>
        <span className="px-2">{step.station}</span>
      </li>
    ))}
  </ul>
);

type Props = {
  line: Line;
};

const Timetables: React.FunctionComponent<Props> = ({ line }: Props) => {
  const steps = _.filter(line.steps, (s) => s.commercialStop);
  const ret = [...steps].reverse();
  return (
    <div className="flex py-2">
      <div className="flex-1">
        <h3>Aller</h3>
        <Timetable steps={steps} forward />
      </div>
      <div className="flex-1">
        <h3>Retour</h3>
        <Timetable steps={ret} forward={false} />
      </div>
    </div>
  );
};

export default Timetables;

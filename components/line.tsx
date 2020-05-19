import * as React from 'react';
import _ from 'lodash';
import VJSummary from './vj_summary';
import VJDetails from './vj_details';
import Lines from '../data/lines';
import VehicleJourney from '../lib/vehicle_journey';
import { Day } from '../lib/types.d';

type Props = {
  line: any;
  infra: any;
};

const Line: React.FunctionComponent<Props> = ({ line, infra }: Props) => {
  const [currentRoute, setCurrentRoute] = React.useState('Lundi (aller)');

  console.log('mooo', Lines[line]);
  const routes = _([Day.Monday, Day.Friday, Day.Saturday, Day.Sunday])
    .flatMap((day) => [
      [`${day} (aller)`, new VehicleJourney(Lines[line], day, true, infra)],
      [`${day} (retour)`, new VehicleJourney(Lines[line], day, false, infra)],
    ])
    .fromPairs()
    .value();

  const vj = new VehicleJourney(Lines[line], Day.Monday, true, infra);

  return (
    <div className="p-12">
      <h1>{vj.label}</h1>
      <h2>Circulations significatives</h2>
      <div className="grid grid-rows-2 grid-flow-col">
        {Object.keys(routes).map((day) => (
          <span key={day}>
            <input
              type="radio"
              id={day}
              value={day}
              name="route"
              onClick={() => setCurrentRoute(day)}
              checked={currentRoute === day}
            />
            <label htmlFor={day}>{day}</label>
          </span>
        ))}
      </div>
      <h2>Synthèse</h2>
      <VJSummary vj={routes[currentRoute]} />
      <h2>Détails</h2>
      <VJDetails vj={routes[currentRoute]} />
    </div>
  );
};

export default Line;

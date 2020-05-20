import * as React from 'react';
import _ from 'lodash';
import VJSummary from './vj_summary';
import VJDetails from './vj_details';
import Lines from '../data/lines';
import VehicleJourney from '../lib/vehicle_journey';
import { Day } from '../lib/types.d';

type Props = {
  lineId: string;
  infra: any;
};

const Line: React.FunctionComponent<Props> = ({ lineId, infra }: Props) => {
  const [currentRoute, setCurrentRoute] = React.useState('Lundi (aller)');
  const line = Lines[lineId];

  const routes = _([Day.Monday, Day.Friday, Day.Saturday, Day.Sunday])
    .flatMap((day) => [
      [`${day} (aller)`, new VehicleJourney(line, day, true, infra)],
      [`${day} (retour)`, new VehicleJourney(line, day, false, infra)],
    ])
    .fromPairs()
    .value();

  return (
    <div className="p-12">
      <h1>{line.label}</h1>
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

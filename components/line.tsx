import * as React from 'react';
import _ from 'lodash';
import buildVJ from '../lib/line';
import VJSummary from './vj_summary';
import VJDetails from './vj_details';

type Props = {
  line: any;
  infra: any;
};

const Line: React.FunctionComponent<Props> = ({ line, infra }: Props) => {
  const [currentRoute, setCurrentRoute] = React.useState('Lundi (aller)');

  const routes = _(['Lundi', 'Vendredi', 'Samedi', 'Dimanche'])
    .flatMap((day) => [
      [`${day} (aller)`, buildVJ(line, day, infra, true)],
      [`${day} (retour)`, buildVJ(line, day, infra, false)],
    ])
    .fromPairs()
    .value();

  const vj = buildVJ(line, 'Lundi', infra, true);
  return (
    <div className="p-12">
      <h1>{vj.label}</h1>
      <h2>Circulations significatives</h2>
      <div className="grid grid-rows-2 grid-flow-col">
        {_.map(routes, (route, day) => (
          <span>
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

import * as React from 'react';
import _ from 'lodash';
import VJSummary from './vj_summary';
import VJDetails from './vj_details';
import Market from './market';
import Lines from '../data/lines';
import VehicleJourney from '../lib/vehicle_journey';
import { Day } from '../lib/types.d';
import Timetable from './timetables';
import AnnualCosts from './annual_costs';
import { MarketData } from '../data/market_importer';
import { Infra } from '../data/airtable_importer';

type Props = {
  lineId: string;
  infra: Infra;
  market: MarketData;
};

const Line: React.FunctionComponent<Props> = ({
  lineId,
  infra,
  market,
}: Props) => {
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
      <div className="flex">
        <div className="w-1/3">
          <h2>Couts annuels</h2>
          <AnnualCosts vjs={routes} defaultOff={10} />
        </div>
        <div className="w-1/3">
          <Market line={line} market={market} nodes={infra.nodes} />
        </div>
        <div>
          <h2>Fiche horaire</h2>
          <Timetable line={line} />
        </div>
      </div>
      <h2 className="pt-6">Détails</h2>
      <div className="flex">
        <div className="w-1/4">
          <h3>Circulations significatives</h3>
          <div className="grid grid-cols-2 px-4 py-2 flex-1">
            {Object.keys(routes).map((day) => (
              <span key={day}>
                <input
                  type="radio"
                  id={day}
                  value={day}
                  name="route"
                  onClick={() => setCurrentRoute(day)}
                  defaultChecked={currentRoute === day}
                />
                <label htmlFor={day}>{day}</label>
              </span>
            ))}
          </div>
        </div>
        <div>
          <VJSummary vj={routes[currentRoute]} />
        </div>
      </div>
      <h2>Détails des segments</h2>
      <VJDetails vj={routes[currentRoute]} />
    </div>
  );
};

export default Line;

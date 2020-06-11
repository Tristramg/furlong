import * as React from 'react';
import _ from 'lodash';
import VJSummary, { stats } from './vj_summary';
import VJDetails from './vj_details';
import Market from './market';
import Train from './train';
import Lines from '../data/lines';
import VehicleJourney from '../lib/vehicle_journey';
import { Day } from '../lib/types.d';
import Timetable from './timetables';
import AnnualCosts from './annual_costs';
import { MarketData } from '../data/market_importer';
import { Infra } from '../data/airtable_importer';
import Trains from '../data/trains';
import { fmt } from '../lib/helpers';

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
  line.train = Trains.empty;
  const VJempty = new VehicleJourney(line, Day.Monday, true, infra);
  const statsEmpty = stats(VJempty.edges);
  line.train = Trains.halfViaggio;
  const VJ200 = new VehicleJourney(line, Day.Monday, true, infra);
  const stats200 = stats(VJ200.edges);
  line.train = Trains.fullViaggio;
  const VJ400 = new VehicleJourney(line, Day.Monday, true, infra);
  const stats400 = stats(VJ400.edges);

  const [currentTrain, setCurrentTrain] = React.useState(line.train);
  line.train = currentTrain;

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
      <Train train={currentTrain} />
      <select onChange={(train) => setCurrentTrain(Trains[train.target.value])}>
        {Object.keys(Trains).map((key) => (
          <option
            key={key}
            value={key}
            selected={Trains[key].label === currentTrain.label}
          >
            {key}
          </option>
        ))}
      </select>
      <div>
        <h2>Estimation fixe/marginal</h2>
        <table>
          <thead>
            <tr>
              <th>—</th>
              <th>Total</th>
              <th>Voies</th>
              <th>Énergie</th>
              <th>Gares</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Part fixe</td>
              <td>
                {fmt(
                  statsEmpty.tracks + statsEmpty.energy + statsEmpty.stations
                )}
              </td>
              <td>{fmt(statsEmpty.tracks)}</td>
              <td>{fmt(statsEmpty.energy)}</td>
              <td>{fmt(statsEmpty.stations)}</td>
            </tr>
            <tr>
              <td>Supplément demi-train</td>
              <td>
                {fmt(
                  stats200.tracks +
                    stats200.energy +
                    stats200.stations -
                    (statsEmpty.tracks +
                      statsEmpty.energy +
                      statsEmpty.stations)
                )}
              </td>
              <td>{fmt(stats200.tracks - statsEmpty.tracks)}</td>
              <td>{fmt(stats200.energy - statsEmpty.energy)}</td>
              <td>{fmt(stats200.stations - statsEmpty.stations)}</td>
            </tr>
            <tr>
              <td>Supplément pour doubler le train</td>
              <td>
                {fmt(
                  stats400.tracks +
                    stats400.energy +
                    stats400.stations -
                    (stats200.tracks + stats200.energy + stats200.stations)
                )}
              </td>
              <td>{fmt(stats400.tracks - stats200.tracks)}</td>
              <td>{fmt(stats400.energy - stats200.energy)}</td>
              <td>{fmt(stats400.stations - stats200.stations)}</td>
            </tr>
          </tbody>
        </table>
      </div>
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

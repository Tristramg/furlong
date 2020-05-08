import * as React from 'react';
import { VehicleJourney, TrainEdge } from '../lib/types';
import { RuleCategory, Countries } from '../lib/types.d';
import { fh, fmt } from '../lib/helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';

type Props = {
  vj: VehicleJourney;
};

function stats(edges: TrainEdge[]) {
  const prices = _(edges).map(e => e.pricesByCategory());
  return {
    energy: _(prices).map(RuleCategory.Energy).sum() || 0,
    tracks: _(prices).map(RuleCategory.Tracks).sum() || 0,
    stations: _(prices).map(RuleCategory.Station).sum() || 0,
    distance: _(edges).map('edge.distance').sum() || 0,
    duration: _(edges).map(e => e.edge.arrival.time - e.edge.departure.time).sum() || 0,
  };
}

function group(vj: VehicleJourney) {
  const result = _(vj.edges).groupBy('edge.country').mapValues(stats).value();

  const totalPairs = _(['energy', 'tracks', 'stations', 'distance', 'duration']).
                        map(x => [x, _(result).map(x).sum()]).value();
  result['Total'] = {
    energy: _(result).map('energy').sum(),
    tracks: _(result).map('tracks').sum(),
    stations: _(result).map('stations').sum(),
    distance: _(result).map('distance').sum(),
    duration: _(result).map('duration').sum(),
  };

  return result;
}

const Country = ({ country, stats }) => {
  const total = stats.energy + stats.tracks + stats.stations;
  return (<tr className="text-right">
    <td className="text-center">{Countries[country] || country}</td>
    <td>{fmt(total)}</td>
    <td>{fmt(stats.tracks)}</td>
    <td>{fmt(stats.energy)}</td>
    <td>{fmt(stats.stations)}</td>
    <td>{fmt(total / stats.distance)}</td>
    <td>{fmt(stats.distance)}</td>
    <td>{fh(stats.duration)}</td>
    <td>{fmt(stats.distance * 60 / stats.duration)}</td>
  </tr>);
};

const VJSummary: React.FunctionComponent<Props> = ({ vj }) => <table className="table-fixed">
  <thead>
    <th className="w-2/12">Pays</th>
    <th className="w-1/12">€ Total</th>
    <th className="w-1/12">
      <FontAwesomeIcon className="text-gray-600" icon="road" /> € Infrastructure
      </th>
    <th className="w-1/12">
      <FontAwesomeIcon className="text-gray-600" icon="bolt" /> € Énergie
    </th>
    <th className="w-1/12">
      <FontAwesomeIcon className="text-gray-600" icon="building" /> € Gares
    </th>
    <th className="w-1/12">€/km</th>
    <th className="w-1/12">km</th>
    <th className="w-1/12">Durée</th>
    <th className="w-1/12">V moyenne</th>
  </thead>
  {_.map(group(vj), (stats, country) => <Country country={country} stats={stats} />)}
</table>;

export default VJSummary;

import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';
import VehicleJourney from '../lib/vehicle_journey';
import TrainEdge from '../lib/train_edge';
import { RuleCategory, Countries } from '../lib/types.d';
import { fh, fmt } from '../lib/helpers';

type Props = {
  vj: VehicleJourney;
};

interface Stats {
  energy: number;
  tracks: number;
  stations: number;
  distance: number;
  duration: number;
}

function stats(edges: TrainEdge[]): Stats {
  const prices = _(edges).map((e) => e.pricesByCategory());
  return {
    energy: _(prices).map(RuleCategory.Energy).sum() || 0,
    tracks: _(prices).map(RuleCategory.Tracks).sum() || 0,
    stations: _(prices).map(RuleCategory.Station).sum() || 0,
    distance: _(edges).map('edge.distance').sum() || 0,
    duration:
      _(edges)
        .map((e) => e.duration())
        .sum() || 0,
  };
}

function group(vj: VehicleJourney): { [country: string]: Stats } {
  const result = _(vj.edges).groupBy('edge.country').mapValues(stats).value();

  result.Total = {
    energy: _(result).map('energy').sum(),
    tracks: _(result).map('tracks').sum(),
    stations: _(result).map('stations').sum(),
    distance: _(result).map('distance').sum(),
    duration: _(result).map('duration').sum(),
  };

  return result;
}

const Country = ({
  country,
  stats: countryStats,
}: {
  country: string;
  stats: Stats;
}) => {
  const total =
    countryStats.energy + countryStats.tracks + countryStats.stations;
  return (
    <tr className="text-right">
      <td className="text-center">{Countries[country] || country}</td>
      <td>{fmt(total)}</td>
      <td>{fmt(countryStats.tracks)}</td>
      <td>{fmt(countryStats.energy)}</td>
      <td>{fmt(countryStats.stations)}</td>
      <td>{fmt(total / countryStats.distance)}</td>
      <td>{fmt(countryStats.distance)}</td>
      <td>{fh(countryStats.duration)}</td>
      <td className={country === 'Total' ? 'font-bold' : ''}>
        {fmt((countryStats.distance * 60) / countryStats.duration)}
      </td>
    </tr>
  );
};

const VJSummary: React.FunctionComponent<Props> = ({ vj }: Props) => (
  <table className="table-fixed">
    <thead>
      <th className="w-2/12">Pays</th>
      <th className="w-1/12">€ Total</th>
      <th className="w-1/12">
        <FontAwesomeIcon className="text-gray-600" icon="road" />
        €&nbsp;Infrastructure
      </th>
      <th className="w-1/12">
        <FontAwesomeIcon className="text-gray-600" icon="bolt" />
        €&nbsp;Énergie
      </th>
      <th className="w-1/12">
        <FontAwesomeIcon className="text-gray-600" icon="building" />
        €&nbsp;Gares
      </th>
      <th className="w-1/12">€/km</th>
      <th className="w-1/12">km</th>
      <th className="w-1/12">Durée</th>
      <th className="w-1/12">V moyenne</th>
    </thead>
    {_.map(group(vj), (vjStats, country) => (
      <Country country={country} stats={vjStats} />
    ))}
  </table>
);

export default VJSummary;

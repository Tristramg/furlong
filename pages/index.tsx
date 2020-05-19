import Link from 'next/link';
import { GetStaticProps } from 'next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';
import React from 'react';
import Lines from '../data/lines';
import { Infra, importAirtable } from '../data/airtable_importer';
import { fmt } from '../lib/helpers';
import VehicleJourney from '../lib/vehicle_journey';
import { Day } from '../lib/types.d';

export const getStaticProps: GetStaticProps = importAirtable;

const Home = ({ infra }: Infra) => {
  const vjs = _.mapValues(
    Lines,
    (line) => new VehicleJourney(line, Day.Monday, true, infra)
  );

  return (
    <div className="p-12">
      <h1>Furlong : estimation de prix de sillons</h1>
      <div className="px-6 py-2">
        <table className="table-auto">
          <thead>
            <th>Route</th>
            <th>Grande vitesse</th>
            <th>Cout</th>
            <th>km</th>
            <th>Début</th>
            <th>Fin</th>
            <th>Courants</th>
            <th>Signalisations</th>
            <th>Écartements</th>
          </thead>
          <tbody>
            {_.map(vjs, (vj, id) => (
              <tr key={id}>
                <td>
                  <Link href={`/lines/${id}`}>
                    <a>{vj.label}</a>
                  </Link>
                </td>
                <td className="text-center">
                  <FontAwesomeIcon icon={vj.highspeed() ? 'check' : 'times'} />
                </td>
                <td className="text-right">{fmt(vj.price)}</td>
                <td className="text-right">{fmt(vj.distance)}</td>
                <td>{_.head(vj.edges).edge.departure.label}</td>
                <td>{_.last(vj.edges).edge.arrival.label}</td>
                <td>
                  {_(vj.edges).map('edge.line.current').uniq().join(', ')}
                </td>
                <td>
                  {_(vj.edges).map('edge.line.signaling').uniq().join(', ')}
                </td>
                <td>{_(vj.edges).map('edge.line.gauge').uniq().join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;

import Link from 'next/link';
import { GetStaticProps } from 'next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';
import React from 'react';
import Routes from '../data/lines';
import importAirtable from '../data/airtable_importer';
import { gen, fmt } from '../lib/helpers';
import { VehicleJourney } from '../lib/types';
import { Day } from '../lib/types.d';

export const getStaticProps: GetStaticProps = importAirtable;

const Home = ({ infra }) => {
  const vjs = _.mapValues(Routes, (r) => {
    const params = { label: r.label, segments: gen(r.steps, infra) };
    return {
      [Day.Monday]: new VehicleJourney(params, r.train, Day.Monday),
      [Day.Friday]: new VehicleJourney(params, r.train, Day.Friday),
      [Day.Saturday]: new VehicleJourney(params, r.train, Day.Saturday),
      [Day.Sunday]: new VehicleJourney(params, r.train, Day.Sunday),
    };
  });

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
              <tr>
                <td><Link href={`/lines/${id}`}><a>{vj[Day.Monday].label}</a></Link></td>
                <td className="text-center">
                  <FontAwesomeIcon icon={vj[Day.Monday].highspeed() ? 'check' : 'times'} />
                </td>
                <td className="text-right">
                  <Link href={`/lines/${id}/Lundi`}>
                    <a>
                      L:&nbsp;
                      {fmt(vj[Day.Monday].price)}
                    </a>
                  </Link>
                  <br />
                  <Link href={`/lines/${id}/Vendredi`}>
                    <a>
                      V:&nbsp;
                      {fmt(vj[Day.Friday].price)}
                    </a>
                  </Link>
                  <br />
                  <Link href={`/lines/${id}/Samedi`}>
                    <a>
                      S:&nbsp;
                      {fmt(vj[Day.Saturday].price)}
                    </a>
                  </Link>
                  <br />
                  <Link href={`/lines/${id}/Dimanche`}>
                    <a>
                      D:&nbsp;
                      {fmt(vj[Day.Sunday].price)}
                    </a>
                  </Link>
                  <br />
                </td>
                <td className="text-right">{fmt(vj[Day.Monday].distance)}</td>
                <td>{_.head(vj[Day.Monday].edges).edge.departure.label}</td>
                <td>{_.last(vj[Day.Monday].edges).edge.arrival.label}</td>
                <td>{_(vj[Day.Monday].edges).map('edge.line.current').uniq().join(', ')}</td>
                <td>{_(vj[Day.Monday].edges).map('edge.line.signaling').uniq().join(', ')}</td>
                <td>{_(vj[Day.Monday].edges).map('edge.line.gauge').uniq().join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;

import Routes from '../data/lines';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import importAirtable from '../data/airtable_importer';
import { gen, fmt } from '../lib/helpers';
import { VehicleJourney } from '../lib/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';

export const getStaticProps: GetStaticProps = importAirtable;

const Home = ({ infra }) => {

  const vjs = _.mapValues(Routes, r =>
    new VehicleJourney({ label: r.label, segments: gen(r.steps, infra) }, r.train));

  return <div className="p-12">
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
        {_.map(vjs, (vj, id) => <tr>
          <td><Link href={`/lines/${id}`}><a className="underline">{vj.label}</a></Link></td>
          <td className="text-center">
            <FontAwesomeIcon icon={vj.highspeed() ? 'check' : 'times'} />
          </td>
          <td>{fmt(vj.price)}</td>
          <td>{vj.distance}</td>
          <td>{_.head(vj.edges).edge.departure.label}</td>
          <td>{_.last(vj.edges).edge.arrival.label}</td>
          <td>{_(vj.edges).map('edge.line.current').uniq().join(', ')}</td>
          <td>{_(vj.edges).map('edge.line.signaling').uniq().join(', ')}</td>
          <td>{_(vj.edges).map('edge.line.gauge').uniq().join(', ')}</td>
          </tr>)}
        </tbody>
      </table>
    </div>
  </div>
  ;
};

export default Home;

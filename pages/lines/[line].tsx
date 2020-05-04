import Routes from '../../data/lines';
import * as Trains from '../../data/trains';
import { vehicleJourney, edgeId, gen } from '../../lib/helpers';
import VehicleJourney from '../../components/vehicle_journey';
import fetch from 'node-fetch';
import { Line } from '../../lib/types';
import _ from 'lodash';
import { useRouter } from 'next/router';

import { GetStaticProps, GetStaticPaths } from 'next';

const defaults = {
  ES: {
    current: '3000 CC',
    gauge: 'Ibérique 1668 mm',
    signaling: 'ASFA',
  },
  FR: {
    current: '1500 CC',
    gauge: 'Standard 1435 mm',
    signaling: 'KVB',
  },
  IT: {
    current: '3000 CC',
    gauge: 'Standard 1435 mm',
    signaling: '?',
  },
  BE: {
    current: '3000 CC',
    gauge: 'Standard 1435 mm',
    signaling: 'TBL',
  },
  DE: {
    current: '15k AC',
    gauge: 'Standard 1435 mm',
    signaling: 'PZB',
  },
  PT: {
    current: '25k AC',
    gauge: 'Ibérique 1668 mm',
    signaling: '?',
  },
};

export const getStaticProps: GetStaticProps = async (_context) => {
  const rawNodes = await get('', 'Nodes');
  const rawLines = await get('', 'Lines');
  const rawEdges = await get('', 'Edges');
  const id = n => edgeId(rawNodes[n.from[0]].Name, rawNodes[n.to[0]].Name);

  const lines = _.mapValues(rawLines, l => ({
    label: l.Name,
    class: l.Class || null,
    highSpeed: l.LGV || false,
    gauge: l.Écartement || defaults[l.country].gauge,
    signaling: l.Signalisation || defaults[l.country].signaling,
    current: l.Courant || defaults[l.Country].current,
  }));

  const defaultLine = (country: string): Line => ({
    label: null,
    class: null,
    highSpeed: false,
    gauge: defaults[country].gauge,
    signaling: defaults[country].signaling,
    current: defaults[country].current,
  });

  return {
    props: {
      infra: {
        nodes: _.keyBy(rawNodes, 'Name'),
        edges: _(rawEdges).values().map(v => [id(v), {
          start: rawNodes[v.from[0]].Name,
          end: rawNodes[v.to[0]].Name,
          country: v.Country,
          label: v.Line ? lines[v.Line[0]].label : '',
          distance: v.length,
          line: v.Line ? lines[v.Line[0]] : defaultLine(v.Country),
        }]).fromPairs().value(),
      },
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: Object.keys(Routes).map(r => ({ params: { line: r } })),
    fallback: false,
  };
};

async function get(offset: string, table: string) {
  const base = 'app79tCh1zYIM8CT9';
  const res = await fetch(`https://api.airtable.com/v0/${base}/${table}?maxRecords=1000&api_key=${process.env.AIRTABLE_KEY}&offset=${offset}`);
  const r = await res.json();
  const current = _(r.records).map(r => [r.id, r.fields]).fromPairs().value();

  if (r.offset) {
    return get(r.offset, table).then(moar => Object.assign(current, moar));
  }
  return current;
}

const Home = ({ infra }) => {
  const router = useRouter();
  const { line } = router.query;
  const l = typeof line === 'string' ? line : line[0];
  const route = Routes[l];
  const edges = gen(route.steps, infra);
  const vj = vehicleJourney({ label: route.label, segments: edges }, infra, route.train);
  return <VehicleJourney vj={vj}></VehicleJourney>;
};

export default Home;

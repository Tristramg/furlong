//import nord_east from '../lines/nord_east';
import list from '../lines/nord_east';
import * as Trains from '../data/trains'
import {vehicleJourney, edge_id, gen} from '../lib/helpers';
import VehicleJourney from '../components/vehicle_journey';
import fetch from 'node-fetch'
import _ from 'lodash'

import { GetStaticProps } from 'next'

const defaults = {
  ES: {
    current: '3000 CC',
    gauge: 'Ibérique 1668 mm',
    signaling: 'ASFA'
  },
  FR: {
    current: '1500 CC',
    gauge: 'Standard 1435 mm',
    signaling: 'KVB'
  },
  IT: {
    current: '3000 CC',
    gauge: 'Standard 1435 mm',
    signaling: '?'
  },
  BE: {
    current: '3000 CC',
    gauge: 'Standard 1435 mm',
    signaling: 'TBL'
  },
  DE: {
    current: '15k AC',
    gauge: 'Standard 1435 mm',
    signaling: 'PZB'
  },
  PT: {
    current: '25k AC',
    gauge: 'Ibérique 1668 mm',
    signaling: '??'
  },
}

export const getStaticProps: GetStaticProps = async context => {
    const rawNodes = await get('', 'Nodes');
    const rawLines = await get('', 'Lines');
    const rawEdges = await get('', 'Edges');

    const lines = _.mapValues(rawLines, l => ({
      label: l.Name,
      class: l.Class || null,
      highSpeed: l.LGV || false,
      gauge: l.Écartement || 'Standard 1435 mm',
      signaling: l.Signalisation || null,
      current: l.Courant || defaults[l.Country].current
    }) )

    return {
        props: {
            infra: {
                nodes: _.keyBy(rawNodes, 'Name'),
                edges: _(rawEdges).values().map(v => [edge_id(rawNodes[v.from[0]].Name, rawNodes[v.to[0]].Name), {
                    start: rawNodes[v.from[0]].Name,
                    end: rawNodes[v.to[0]].Name,
                    country: v.Country,
                    label: v.Line ? lines[v.Line[0]].label : '',
                    distance: v.length,
                    line: v.Line ? lines[v.Line[0]] : null,
                }]).fromPairs().value(),
            }
        },
      }
}

async function get(offset: string, table: string) {
  const base = 'app79tCh1zYIM8CT9'
  const res = await fetch(`https://api.airtable.com/v0/${base}/${table}?maxRecords=1000&api_key=${process.env.AIRTABLE_KEY}&offset=${offset}`)
  const r = await res.json()
  const current = _(r.records).map(r => [r.id, r.fields]).fromPairs().value()

  if (r.offset) {
    return get(r.offset, table).then(moar => Object.assign(current, moar))
  } else {
    return current
  }
}



const Home = ({infra}) =>  {
  const edges = gen(list, infra)
    const vj = vehicleJourney({label: 'moo', segments: edges}, infra, Trains.talgo230)
    return <VehicleJourney vj={vj}></VehicleJourney>;
}

export default Home;

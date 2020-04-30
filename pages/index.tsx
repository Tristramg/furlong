//import nord_east from '../lines/nord_east';
import list from '../lines/nord_east';
import * as Trains from '../data/trains'
import {vehicleJourney, edge_id, gen} from '../lib/helpers';
import VehicleJourney from '../components/vehicle_journey';
import fetch from 'node-fetch'
import _ from 'lodash'

import { GetStaticProps } from 'next'

export const getStaticProps: GetStaticProps = async context => {
    const rawNodes = await get('', 'Nodes');
    const lines = await get('', 'Lines');
    const rawEdges = await get('', 'Edges');


    return {
        props: {
            infra: {
                nodes: _.keyBy(rawNodes, 'Name'),
                edges: _(rawEdges).values().map(v => [edge_id(rawNodes[v.from[0]].Name, rawNodes[v.to[0]].Name), {
                    start: rawNodes[v.from[0]].Name,
                    end: rawNodes[v.to[0]].Name,
                    country: v.Country,
                    label: v.Line ? lines[v.Line[0]].Name : '',
                    distance: v.length,
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

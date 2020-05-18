import fetch from 'node-fetch';
import _ from 'lodash';
import { data } from './countries';
import { Line } from '../lib/types';
import { Countries } from '../lib/types.d';
import { edgeId } from '../lib/helpers';

async function get(offset: string, table: string) {
  const base = 'app79tCh1zYIM8CT9';
  const res = await fetch(`https://api.airtable.com/v0/${base}/${table}?maxRecords=1000&api_key=${process.env.AIRTABLE_KEY}&offset=${offset}`);
  const r = await res.json();
  const current = _(r.records).map((r) => [r.id, r.fields]).fromPairs().value();

  if (r.offset) {
    return get(r.offset, table).then((moar) => Object.assign(current, moar));
  }
  return current;
}

const countriesMap = {
  IT: Countries.IT,
  BE: Countries.BE,
  FR: Countries.FR,
  DE: Countries.DE,
  ES: Countries.ES,
  PT: Countries.PT,
};

export default async function importAirtable() {
  const rawNodes = await get('', 'Nodes');
  const rawLines = await get('', 'Lines');
  const rawEdges = await get('', 'Edges');
  const id = (n: { from: string[]; to: string[]; }): string => edgeId(rawNodes[n.from[0]].Name, rawNodes[n.to[0]].Name);

  const lines = _.mapValues(rawLines, (l) => {
    const defaults = data[countriesMap[l.country]];
    return {
      label: l.Name,
      class: l.Class || null,
      highSpeed: l.LGV || false,
      gauge: l.Écartement || defaults.gauge,
      signaling: l.Signalisation || defaults.signaling,
      current: l.Courant || defaults.current,
    };
  });

  const defaultLine = (country: Countries): Line => {
    const defaults = data[country];
    return {
      label: null,
      class: null,
      highSpeed: false,
      gauge: defaults.gauge,
      signaling: defaults.signaling,
      current: defaults.current,
    };
  };

  return {
    props: {
      infra: {
        nodes: _.keyBy(rawNodes, 'Name'),
        edges: _(rawEdges).values().map((v) => [id(v), {
          departure: rawNodes[v.from[0]],
          arrival: rawNodes[v.to[0]],
          country: countriesMap[v.Country],
          label: v.Line ? lines[v.Line[0]].label : '',
          distance: v.length,
          line: v.Line ? lines[v.Line[0]] : defaultLine(countriesMap[v.Country]),
        }]).fromPairs()
          .value(),
      },
    },
  };
}

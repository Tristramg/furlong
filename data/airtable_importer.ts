import { data } from './countries';
import fetch from 'node-fetch';
import { Line } from '../lib/types';
import { edgeId } from '../lib/helpers';
import _ from 'lodash';

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

export default async function importAirtable() {
  const rawNodes = await get('', 'Nodes');
  const rawLines = await get('', 'Lines');
  const rawEdges = await get('', 'Edges');
  const id = n => edgeId(rawNodes[n.from[0]].Name, rawNodes[n.to[0]].Name);

  const lines = _.mapValues(rawLines, l => ({
    label: l.Name,
    class: l.Class || null,
    highSpeed: l.LGV || false,
    gauge: l.Écartement || data[l.country].gauge,
    signaling: l.Signalisation || data[l.country].signaling,
    current: l.Courant || data[l.Country].current,
  }));

  const defaultLine = (country: string): Line => ({
    label: null,
    class: null,
    highSpeed: false,
    gauge: data[country].gauge,
    signaling: data[country].signaling,
    current: data[country].current,
  });

  return {
    props: {
      infra: {
        nodes: _.keyBy(rawNodes, 'Name'),
        edges: _(rawEdges).values().map(v => [id(v), {
          departure: rawNodes[v.from[0]],
          arrival: rawNodes[v.to[0]],
          country: v.Country,
          label: v.Line ? lines[v.Line[0]].label : '',
          distance: v.length,
          line: v.Line ? lines[v.Line[0]] : defaultLine(v.Country),
        }]).fromPairs().value(),
      },
    },
  };
}

import * as React from 'react';
import _ from 'lodash';
import { MarketData } from '../data/market_importer';
import Line from '../lib/line';
import { fmt } from '../lib/helpers';

type Props = {
  line: Line;
  market: MarketData;
  nodes: any;
};

const Market: React.FunctionComponent<Props> = ({
  line,
  market,
  nodes,
}: Props) => {
  const stations = _(line.steps)
    .filter('commercialStop')
    .map('station')
    .value();

  const marketdata = [];
  const local =
    nodes[stations[0]].Country[0] === nodes[stations.slice(-1)[0]].Country[0];

  stations.forEach((a) => {
    stations.forEach((b) => {
      if (a < b) {
        const pax = market[nodes[a].EurostatName + nodes[b].EurostatName];
        if (pax && (local || nodes[a].Country[0] !== nodes[b].Country[0])) {
          marketdata.push({
            from: a,
            to: b,
            pax,
          });
        }
      }
    });
  });

  marketdata.sort((a, b) => b.pax - a.pax);

  return (
    <div>
      <h2>Le marché</h2>
      <span className="text-sm">
        Allers et retours en avion en 2018 selon Eurostat
      </span>
      <table>
        {marketdata.map((m) => (
          <tr key={m.from + m.to}>
            <td>{m.from}</td>
            <td>{m.to}</td>
            <td className="text-right">{fmt(m.pax, 4)}</td>
          </tr>
        ))}
        <tr>
          <td className="font-bold"> Total</td>
          <td />
          <td className="text-right font-bold">
            {fmt(_.sumBy(marketdata, 'pax'), 4)}
          </td>
        </tr>
      </table>
    </div>
  );
};

export default Market;

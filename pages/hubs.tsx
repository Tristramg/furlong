import React from 'react';
import { GetStaticProps } from 'next';
import _ from 'lodash';
import importHubData, { AllHubs, HubData } from '../data/hub_importer';

export const getStaticProps: GetStaticProps = async () => ({
  props: {
    hubs: await importHubData(),
  },
});

const Hub = ({ city, hub }: { city: string; hub: HubData }) => {
  return (
    <tr>
      <td>{city}</td>
      <td className="text-right">{hub.passengers}</td>
      <td className="text-right">{Math.round(hub.rail_distance)}</td>
      <td className="text-right">{hub.crow_distance}</td>
    </tr>
  );
};

const Hubs = ({ hubs }: AllHubs) => {
  return (
    <div className="p-12">
      <h1>Potential hubs</h1>
      {_.map(hubs, (tos, from) => (
        <div key={from}>
          <h2>{from}</h2>
          <table>
            <thead>
              <tr>
                <th className="p-1">Destination</th>
                <th className="p-1">Passengers/year</th>
                <th className="p-1">Distance by rail</th>
                <th className="p-1">Crow distance</th>
              </tr>
            </thead>
            <tbody>
              {_.map(tos, (hub, to) => (
                <Hub key={to} hub={hub} city={to} />
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};
export default Hubs;

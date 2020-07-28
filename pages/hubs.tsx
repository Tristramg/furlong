import React, { useEffect } from 'react';
import { GetStaticProps } from 'next';
import _ from 'lodash';
import { FeatureCollection } from 'geojson';
import mapboxgl from 'mapbox-gl';
import bbox from '@turf/bbox';
import importHubData, { AllHubs, HubData } from '../data/hub_importer';

export const getStaticProps: GetStaticProps = async () => ({
  props: {
    hubs: await importHubData(),
  },
});

const Map = ({ geoms, id }: { id: string; geoms: FeatureCollection }) => {
  const container = `map-${id}`;
  mapboxgl.accessToken =
    'pk.eyJ1IjoidHJpc3RyYW1nIiwiYSI6ImNrZDRpYTA2dTFxcmEycm83MzlnOWs1amUifQ.y6b0oAHEouiow3G5_g-lOg';

  useEffect(() => {
    const map = new mapboxgl.Map({
      container,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [2, 48],
      zoom: 3,
    });
    map.on('load', () => {
      map.addSource(container, { type: 'geojson', data: geoms });
      map.addLayer({
        id: container,
        type: 'line',
        source: container,
      });

      const bounds = bbox(geoms);
      map.fitBounds([bounds[0], bounds[1], bounds[2], bounds[3]]);
    });
  });

  return <div id={container} className="w-1/2 min-h-full" />;
};

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

function geometries(hubs: { [to: string]: HubData }): FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: _.map(hubs, 'geom'),
  };
}

const Hubs = ({ hubs }: { hubs: AllHubs }) => {
  return (
    <div className="p-12">
      <h1>Potential hubs</h1>
      {_.map(hubs, (tos, from) => (
        <div>
          <h2>{from}</h2>
          <div key={from} className="flex">
            <div className="w-1/2">
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
            <Map geoms={geometries(tos)} id={from} />
          </div>
        </div>
      ))}
    </div>
  );
};
export default Hubs;

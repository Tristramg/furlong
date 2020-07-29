import React, { useEffect, useState } from 'react';
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

      if (geoms.features.length > 0) {
        const bounds = bbox(geoms);
        map.fitBounds([bounds[0], bounds[1], bounds[2], bounds[3]]);
      }
    });
  }, []);

  return <div id={container} className="w-1/2 min-h-full" />;
};

const HubDestination = ({ hub }: { hub: HubData }) => {
  return (
    <tr>
      <td>{hub.destination}</td>
      <td className="text-right">{hub.passengers}</td>
      <td className="text-right">{Math.round(hub.rail_distance)}</td>
      <td className="text-right">{hub.crow_distance}</td>
    </tr>
  );
};

function geometries(hubs: HubData[]): FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: _.map(hubs, 'geom'),
  };
}

function filter(
  minPax: number,
  maxDistance: number
): (hub: HubData) => boolean {
  return (hub: HubData) =>
    hub.rail_distance <= maxDistance && hub.passengers >= minPax;
}

interface HubProps {
  from: string;
  destinations: HubData[];
  minPax: number;
  maxDistance: number;
}

const Hub = ({ from, destinations, minPax, maxDistance }: HubProps) => {
  const filtered = _.filter(destinations, filter(minPax, maxDistance));
  const filteredCount = destinations.length - filtered.length;
  return (
    <div>
      <h2>{from}</h2>
      <div className="flex">
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
              {_.map(filtered, (hub) => (
                <HubDestination key={hub.destination} hub={hub} />
              ))}
            </tbody>
          </table>
          <span className="text-gray-700 text-sm">{`${filteredCount} destinations filtered`}</span>
        </div>
        <Map geoms={geometries(destinations)} id={from} />
      </div>
    </div>
  );
};

const Hubs = ({ hubs }: { hubs: AllHubs }) => {
  const [minPax, setMinPax] = useState(1_000_000);
  const [maxDistance, setMaxDistance] = useState(1_500);
  return (
    <div className="p-12">
      <div className="sticky top-0 bg-white">
        <h1>Potential hubs</h1>
        <h2>Filter results</h2>
        <div className="flex">
          <div className="px-2">
            <label
              htmlFor="minPax"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              {`Minimum passenger per year (${minPax.toLocaleString('en-GB')})`}
            </label>
            <input
              type="range"
              id="minPax"
              name="minPax"
              min="100000"
              max="2500000"
              step="100000"
              value={minPax}
              onChange={(event) => setMinPax(event.target.valueAsNumber)}
            />
          </div>
          <div className="px-2">
            <label
              htmlFor="maxDistance"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              {`Maximum distance (${maxDistance.toLocaleString('en-GB')})`}
            </label>
            <input
              type="range"
              id="maxDistance"
              name="maxDistance"
              min="500"
              max="3000"
              step="100"
              value={maxDistance}
              onChange={(event) => setMaxDistance(event.target.valueAsNumber)}
            />
          </div>
        </div>
      </div>
      {_.map(hubs, (destinations, from) => (
        <Hub
          destinations={destinations}
          from={from}
          key={from}
          minPax={minPax}
          maxDistance={maxDistance}
        />
      ))}
    </div>
  );
};
export default Hubs;

import { Client } from 'pg';
import _ from 'lodash';
import { toGeoJSON } from '@mapbox/polyline';
import { Feature } from 'geojson';

interface HubData {
  destination: string;
  passengers: number;
  rail_distance: number;
  crow_distance: number;
  geom: Feature;
}

interface AllHubs {
  [from: string]: HubData[];
}

export default async function importHubData(): Promise<AllHubs> {
  // Parameters are set by environment variables;
  const client = new Client();
  await client.connect();

  const res = await client.query(`
  WITH

  hubs AS (
      SELECT from_name, sum(passengers) as passengers
      FROM potential_routes
      GROUP BY from_name
      ORDER BY passengers DESC
      LIMIT 20),

  ranked AS (
      SELECT
        hubs.from_name,
        to_name,
        potential_routes.passengers as passengers,
        hubs.passengers as total_passengers,
        rail_distance,
        crow_distance,
        st_asencodedpolyline(st_simplify(geom, 0.05)) as geom
        ,rank() over (partition by hubs.from_name order by potential_routes.passengers desc) as rank
      FROM hubs, potential_routes
      WHERE hubs.from_name = potential_routes.from_name
      AND rail_distance > 700
      --AND hubs.from_name = 'London' AND to_name = 'Amsterdam'
      ORDER by hubs.passengers DESC, rank ASC)

  SELECT *
  FROM ranked
  WHERE rank <= 20
  `);

  client.end();

  const mapRow = (row): HubData => ({
    destination: row.to_name,
    passengers: row.passengers,
    rail_distance: row.rail_distance,
    crow_distance: row.crow_distance,
    geom: {
      type: 'Feature',
      properties: {},
      geometry: toGeoJSON(row.geom),
    },
  });

  return _(res.rows)
    .groupBy((row) => row.from_name)
    .mapValues((rows) => _.map(rows, mapRow))
    .value();
}

export type { AllHubs, HubData };

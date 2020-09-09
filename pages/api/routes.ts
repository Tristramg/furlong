import { NextApiRequest, NextApiResponse } from 'next';
import { Client } from 'pg';
import { Segment } from '../../database/types.d';

async function route(from: number, to: number): Promise<Segment[]> {
  // Parameters are set by environment variables;
  const client = new Client({
    user: 'tristram',
    password: 'tristram',
    host: 'localhost',
    database: 'furlong',
  });
  await client.connect();

  const edges = `
'SELECT * from ways
JOIN nodes AS departure ON departure.id = ' || $1::integer || '
JOIN nodes AS arrival ON arrival.id = ' || $2::integer || '
WHERE the_geom && st_Buffer(st_MakeLine(departure.geog::geometry, arrival.geog::geometry), 1)'
  `;

  const res = await client.query(
    `
SELECT
  min(seq) as seq,
  country,
  sum(route.cost) as duration,
  sum(length_m) / 1000 as distance,
  st_AsGeoJson(st_makeline(st_point(x1, y1) ORDER BY seq)) AS geom
FROM pgr_dijkstra(${edges}, $1::integer, $2::integer, false) as route
JOIN ways ON route.edge = ways.id
GROUP BY country
ORDER BY seq
  `,
    [from, to]
  );

  client.end();
  return res.rows.map(({ country, duration, distance, geom }) => ({
    country,
    duration,
    distance,
    geojson: JSON.parse(geom),
  }));
}

type ResultErr = {
  error: string;
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Segment[] | ResultErr>
) => {
  res.setHeader('Content-Type', 'application/json');
  if (req.query.from && req.query.to) {
    res.statusCode = 200;
    const from =
      typeof req.query.from === 'string' ? req.query.from : req.query.from[0];
    const to =
      typeof req.query.to === 'string' ? req.query.to : req.query.to[0];
    const segments = await route(Number(from), Number(to));
    res.end(JSON.stringify(segments));
  } else {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: 'Missing parameter from or to' }));
  }
};

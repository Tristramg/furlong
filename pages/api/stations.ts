import { NextApiRequest, NextApiResponse } from 'next';
import { Client } from 'pg';

async function search(q: string): Promise<Station[]> {
  // Parameters are set by environment variables;
  const client = new Client();
  await client.connect();

  const res = await client.query(
    `
SELECT name, node, longitude, latitude
FROM stations
WHERE name ilike $1
  AND is_suggestable
  AND node IS NOT NULL
ORDER BY is_main_station
LIMIT 10
  `,
    [`%${q}%`]
  );

  client.end();
  return res.rows.map((row) => ({
    label: row.name,
    coord: [row.longitude, row.latitude],
    node: row.node,
  }));
}

type Station = {
  label: string;
  coord: number[];
  node: number;
};

type ResultOk = {
  stations: Station[];
};

type ResultErr = {
  error: string;
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ResultOk | ResultErr>
) => {
  res.setHeader('Content-Type', 'application/json');
  if (req.query.q) {
    res.statusCode = 200;
    const q = typeof req.query.q === 'string' ? req.query.q : req.query.q[0];
    const stations = await search(q);
    res.end(JSON.stringify(stations));
  } else {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: 'Missing parameter q' }));
  }
};

export type { Station };

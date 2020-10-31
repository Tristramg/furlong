import { Client } from 'pg';
import _ from 'lodash';

interface MarketData {
  [name: string]: number;
}

export default async function importMarketData(): Promise<MarketData> {
  // Parameters are set by environment variables;
  const client = new Client();
  await client.connect();

  const res = await client.query(`
select
CASE
    WHEN origin ilike '%paris%' THEN 'PARIS'
    WHEN origin ilike '%beauvais%' THEN 'PARIS'
    WHEN origin ilike '%girona%' THEN 'BARCELONA/EL PRAT'
    WHEN origin ilike '%london%' THEN 'LONDON'
    WHEN origin ilike '%berlin%' THEN 'BERLIN'
    WHEN origin ilike '%roma%' THEN 'ROMA'
    WHEN origin ilike '%brussels%' THEN 'BRUSSELS'
    WHEN origin ilike '%milano%' THEN 'MILANO'
    ELSE origin
END as fromCity,
CASE
    WHEN destination ilike '%paris%' THEN 'PARIS'
    WHEN origin ilike '%beauvais%' THEN 'PARIS'
    WHEN origin ilike '%girona%' THEN 'BARCELONA/EL PRAT'
    WHEN destination ilike '%london%' THEN 'LONDON'
    WHEN destination ilike '%berlin%' THEN 'BERLIN'
    WHEN destination ilike '%roma%' THEN 'ROMA'
    WHEN destination ilike '%brussels%' THEN 'BRUSSELS'
    WHEN destination ilike '%milano%' THEN 'MILANO'
    ELSE destination
END as toCity,
sum(value) as passengers
FROM od
WHERE year = '2018'
AND origin < destination
GROUP BY fromCity, toCity
ORDER BY passengers desc
  `);
  const pairs = res.rows.map((row) => [
    `${row.fromcity}${row.tocity}`,
    row.passengers,
  ]);
  client.end();
  return _.fromPairs(pairs);
}

export type { MarketData };
export { importMarketData };

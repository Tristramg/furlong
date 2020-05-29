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
    WHEN dep.origin ilike '%paris%' THEN 'PARIS'
    WHEN dep.origin ilike '%london%' THEN 'LONDON'
    WHEN dep.origin ilike '%berlin%' THEN 'BERLIN'
    WHEN dep.origin ilike '%roma%' THEN 'ROMA'
    WHEN dep.origin ilike '%brussels%' THEN 'BRUSSELS'
    WHEN dep.origin ilike '%milano%' THEN 'MILANO'
    ELSE dep.origin
END as fromCity,
CASE
    WHEN dep.destination ilike '%paris%' THEN 'PARIS'
    WHEN dep.destination ilike '%london%' THEN 'LONDON'
    WHEN dep.destination ilike '%berlin%' THEN 'BERLIN'
    WHEN dep.destination ilike '%roma%' THEN 'ROMA'
    WHEN dep.destination ilike '%brussels%' THEN 'BRUSSELS'
    WHEN dep.destination ilike '%milano%' THEN 'MILANO'
    ELSE dep.destination
END as toCity,
sum(dep.value + arr.value) as passengers
FROM od as dep, od as arr
WHERE dep.origin_airport = arr.destination_airport and dep.destination_airport = arr.origin_airport and dep.year = arr.year and dep.month = arr.month
AND dep.year = '2018'
AND dep.origin < dep.destination
group by fromCity, toCity
order by passengers desc
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

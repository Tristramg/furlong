import { GetStaticProps } from 'next';
import _ from 'lodash';
import React from 'react';
import Link from 'next/link';
import Lines from '../data/lines';
import { Infra, importAirtable } from '../data/airtable_importer';
import { fmt as smartFmt } from '../lib/helpers';
import VehicleJourney from '../lib/vehicle_journey';
import { Day } from '../lib/types.d';
import Trains from '../data/trains';

export const getStaticProps: GetStaticProps = async () => ({
  props: {
    infra: await importAirtable(),
  },
});

const data = {
  nordEst: {
    2024: { train: 'halfViaggio', count: 2, pax: 100 },
    2025: { train: 'halfViaggio', count: 2, pax: 130 },
    2026: { train: 'halfViaggio', count: 2, pax: 170 },
    2027: { train: 'fullViaggio', count: 2, pax: 210 },
    2028: { train: 'fullViaggio', count: 2, pax: 250 },
    2029: { train: 'fullViaggio', count: 2, pax: 290 },
    2030: { train: 'fullViaggio', count: 2, pax: 330 },
  },
  roma: {
    2025: { train: 'halfViaggio', count: 2, pax: 100 },
    2026: { train: 'halfViaggio', count: 2, pax: 130 },
    2027: { train: 'halfViaggio', count: 2, pax: 170 },
    2028: { train: 'fullViaggio', count: 2, pax: 210 },
    2029: { train: 'fullViaggio', count: 2, pax: 250 },
    2030: { train: 'fullViaggio', count: 3, pax: 290 },
  },
  castillaClassic: {
    2026: { train: 'halfViaggio', count: 2, pax: 100 },
    2027: { train: 'halfViaggio', count: 2, pax: 130 },
    2028: { train: 'halfViaggio', count: 2, pax: 170 },
    2029: { train: 'fullViaggio', count: 2, pax: 210 },
    2030: { train: 'fullViaggio', count: 2, pax: 250 },
  },
};

const years = _(data).values().flatMap(Object.keys).uniq().sort().value();

const mondays = (off: number) => 4 * 52 + 1 - Math.floor((365 * off) / 100);
const circulations = (off: number) => mondays(off) + 3 * 52;

function computeCosts(lineId: string, year: string, infra: Infra, off: number) {
  const { line, train, pax } = data[lineId][year];

  const aller = _([Day.Monday, Day.Friday, Day.Saturday, Day.Sunday])
    .map((day) => [day, new VehicleJourney(line, day, true, infra, train, pax)])
    .fromPairs()
    .value();

  const retour = _([Day.Monday, Day.Friday, Day.Saturday, Day.Sunday])
    .map((day) => [
      day,
      new VehicleJourney(line, day, false, infra, train, pax),
    ])
    .fromPairs()
    .value();

  const mondayPrices =
    (aller[Day.Monday].price + retour[Day.Monday].price) * mondays(off);

  const otherPrice =
    _([Day.Friday, Day.Saturday, Day.Sunday])
      .map((day) => aller[day].price + retour[day].price)
      .sum() * 52;

  return mondayPrices + otherPrice;
}

const occupancy = (year): string =>
  year ? `${smartFmt((100 * year.pax) / year.train.capacity(), 2)} %` : '—';

function enrichData(infra: Infra) {
  Object.keys(data).forEach((lineId) => {
    Object.keys(data[lineId]).forEach((year) => {
      const cell = data[lineId][year];
      cell.line = Lines[lineId];
      cell.train = Trains[cell.train];
      cell.trainLabel = cell.train.label;
      cell.cost = computeCosts(lineId, year, infra, 10);
      cell.travellers = cell.pax * circulations(10) * 2;
      cell.maintenance = cell.train.maintenance() * 2;
      cell.heavyMaintenance = cell.train.heavyMaintenance() * 2;
      cell.renting = cell.train.renting() * 2;
      cell.circulations = circulations(10);
      cell.occupancy = occupancy(cell);
    });
  });
}

interface RowDataI {
  title: string;
  entry: string;
  lineId: string;
}

const RowData = ({ title, entry, lineId }: RowDataI) => (
  <>
    <td>{title}</td>
    {years.map((year) => (
      <td key={year} className="text-right">
        {data[lineId][year] ? smartFmt(data[lineId][year][entry]) : '—'}
      </td>
    ))}
  </>
);

const LineRow = ({ title, entry, lineId }: RowDataI) => (
  <tr key={lineId}>
    <RowData lineId={lineId} title={title} entry={entry} />
  </tr>
);

const LineData = ({ lineId }: { lineId: string }) => (
  <>
    <tr className="border-t-4">
      <td rowSpan={6}>
        <Link href={`/lines/${lineId}`}>{Lines[lineId].label}</Link>
      </td>
      <RowData lineId={lineId} title="Voyageurs moyens" entry="pax" />
    </tr>
    <LineRow lineId={lineId} title="Nombre aller-retour" entry="circulations" />
    <LineRow lineId={lineId} title="Voyageurs annuels (k)" entry="travellers" />
    <LineRow lineId={lineId} title="Train" entry="trainLabel" />
    <LineRow lineId={lineId} title="% occupation" entry="occupancy" />
    <LineRow lineId={lineId} title="Couts d’exploitation" entry="cost" />
  </>
);

const TotalRow = ({ title, entry }: { title: string; entry: string }) => (
  <>
    <td>{title}</td>
    {years.map((year) => (
      <td key={year} className="text-right">
        {smartFmt(
          _(data)
            .map((line) => (line[year] ? line[year][entry] : 0))
            .sum()
        )}
      </td>
    ))}
  </>
);

const Total = ({ title, entry }: { title: string; entry: string }) => (
  <tr>
    <TotalRow title={title} entry={entry} />
  </tr>
);

const Totals = () => (
  <>
    <tr className="border-t-4">
      <td rowSpan={5}>Totaux</td>
      <TotalRow title="Couts d’exploitation" entry="cost" />
    </tr>
    <Total title="Voyageurs" entry="travellers" />
    <Total title="Matériel (location)" entry="renting" />
    <Total title="Maintenance courante" entry="maintenance" />
    <Total title="Provision maintenance lourde" entry="heavyMaintenance" />
  </>
);

const MasterPlan = ({ infra }: { infra: Infra }) => {
  enrichData(infra);
  return (
    <div className="p-12">
      <h1>Master plan</h1>
      <table className="border-4">
        <thead>
          <tr>
            <th>Route</th>
            <th> </th>
            {years.map((year) => (
              <th key={year}>{year}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.keys(data).map((lineId) => (
            <LineData lineId={lineId} />
          ))}
          <Totals />
        </tbody>
      </table>
    </div>
  );
};

export default MasterPlan;

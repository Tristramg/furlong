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
import Plans from '../data/master_plans';

export const getStaticProps: GetStaticProps = async () => ({
  props: {
    infra: await importAirtable(),
  },
});

const { data, spare } = Plans.standard;
const years = _(data).values().flatMap(Object.keys).uniq().sort().value();

const mondays = (off: number) => 4 * 52 + 1 - Math.floor((365 * off) / 100);
const circulations = (off: number) => mondays(off) + 3 * 52;

function generateVJ(lineId: string, year: string, infra: Infra) {
  const { trainId, pax } = data[lineId][year];
  const line = Lines[lineId];
  const train = Trains[trainId];

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

  return { aller, retour };
}

function computeCosts(
  lineId: string,
  year: string,
  infra: Infra,
  off: number,
  yearIndex: number
) {
  const { aller, retour } = generateVJ(lineId, year, infra);

  const mondayPrices =
    (aller[Day.Monday].price + retour[Day.Monday].price) * mondays(off);

  const otherPrice =
    _([Day.Friday, Day.Saturday, Day.Sunday])
      .map((day) => aller[day].price + retour[day].price)
      .sum() * 52;

  const mondayReduction =
    (aller[Day.Monday].startReduction(yearIndex) +
      retour[Day.Monday].startReduction(yearIndex)) *
    mondays(off);

  const otherReduction =
    _([Day.Friday, Day.Saturday, Day.Sunday])
      .map(
        (day) =>
          aller[day].startReduction(yearIndex) +
          retour[day].startReduction(yearIndex)
      )
      .sum() * 52;

  return {
    cost: mondayPrices + otherPrice,
    reduction: mondayReduction + otherReduction,
  };
}

const occupancy = (year): string =>
  year ? `${smartFmt((100 * year.pax) / year.train.capacity(), 2)} %` : '—';

const distances = {};

function enrichData(infra: Infra) {
  Object.keys(data).forEach((lineId) => {
    const vj = new VehicleJourney(Lines[lineId], Day.Monday, true, infra);
    distances[lineId] = vj.distance;
    const distance = vj.distance * circulations(10);

    Object.keys(data[lineId]).forEach((year, index) => {
      const { cost, reduction } = computeCosts(lineId, year, infra, 10, index);
      const cell = data[lineId][year];
      cell.line = Lines[lineId];
      cell.train = Trains[cell.trainId];
      cell.trainLabel = cell.train.label;
      cell.cost = cost;
      cell.travellers = cell.pax * circulations(10) * 2;
      cell.maintenance = cell.train.maintenance(distance) * 2;
      cell.heavyMaintenance = cell.train.heavyMaintenance(distance) * 2;
      cell.renting = cell.train.renting() * 2;
      cell.circulations = circulations(10);
      cell.occupancy = occupancy(cell);
      cell.totalCost =
        cell.cost + cell.maintenance + cell.heavyMaintenance + cell.renting;
      cell.revenue = cell.travellers * 150;
      cell.startReduction = reduction;
      cell.total = cell.revenue + cell.startReduction - cell.totalCost;
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
        {smartFmt(_(data).get([lineId, year, entry], '—'))}
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
      <td rowSpan={7}>
        <Link href={`/lines/${lineId}`}>
          <a>{Lines[lineId].label}</a>
        </Link>
        <p>{`${distances[lineId]} km`}</p>
      </td>
      <RowData lineId={lineId} title="Voyageurs moyens" entry="pax" />
    </tr>
    <LineRow lineId={lineId} title="Nombre aller-retour" entry="circulations" />
    <LineRow lineId={lineId} title="Voyageurs annuels" entry="travellers" />
    <LineRow lineId={lineId} title="Train" entry="trainLabel" />
    <LineRow lineId={lineId} title="% occupation" entry="occupancy" />
    <LineRow lineId={lineId} title="Couts de circulation" entry="cost" />
    <LineRow lineId={lineId} title="Aide au lancement" entry="startReduction" />
  </>
);

const TotalRow = ({ title, entry }: { title: string; entry: string }) => (
  <>
    <td>{title}</td>
    {years.map((year) => (
      <td key={year} className="text-right">
        {smartFmt(
          _(data)
            .map((line) => _(line).get([year, entry], 0))
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
      <td rowSpan={10}>Totaux</td>
      <TotalRow title="Voyageurs" entry="travellers" />
    </tr>
    <Total title="Couts de circulation" entry="cost" />
    <Total title="Matériel (location)" entry="renting" />
    <Total title="Maintenance courante" entry="maintenance" />
    <Total title="Provision maintenance lourde" entry="heavyMaintenance" />
    <td>Location matériel réserve</td>
    {years.map((year) => (
      <td key={year} className="text-right">
        {smartFmt(
          _.sumBy(spare[year], ([car, count]) => car.renting() * count)
        )}
      </td>
    ))}
    <Total title="Cout total production" entry="totalCost" />
    <Total title="Aide lancement" entry="startReduction" />
    <Total title="Chiffre d’affaires (150€/pax)" entry="revenue" />
    <Total title="Resultat" entry="total" />
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

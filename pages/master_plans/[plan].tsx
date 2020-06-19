import { GetStaticProps, GetStaticPaths } from 'next';
import _ from 'lodash';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Lines from '../../data/lines';
import { Infra, importAirtable } from '../../data/airtable_importer';
import { fmt as smartFmt } from '../../lib/helpers';
import VehicleJourney from '../../lib/vehicle_journey';
import { Day } from '../../lib/types.d';
import Plans from '../../data/master_plans';
import YearData from '../../lib/year_data';

export const getStaticProps: GetStaticProps = async () => ({
  props: {
    infra: await importAirtable(),
  },
});

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: Object.keys(Plans).map((r) => ({ params: { plan: r } })),
  fallback: false,
});

const { spare } = Plans.standard;
const years = (data) =>
  _(data).values().flatMap(Object.keys).uniq().sort().value();

const distances = {};

function enrichData(infra: Infra, planId: string) {
  const { data } = Plans[planId];
  const result = {};
  Object.keys(data).forEach((lineId) => {
    const vj = new VehicleJourney(Lines[lineId], Day.Monday, true, infra);
    distances[lineId] = vj.distance;

    result[lineId] = {};

    Object.keys(data[lineId]).forEach((year, index) => {
      result[lineId][year] = new YearData(
        lineId,
        year,
        infra,
        10,
        index,
        data,
        vj.distance
      );
    });
  });
  return result;
}

interface RowDataI {
  title: string;
  entry: string;
  line: any;
  data: any;
}

const RowData = ({ title, entry, line, data }: RowDataI) => (
  <>
    <td>{title}</td>
    {years(data).map((year) => (
      <td key={year} className="text-right">
        {smartFmt(_(line).get([year, entry], '—'))}
      </td>
    ))}
  </>
);

const LineRow = ({ title, entry, line, data }: RowDataI) => (
  <tr>
    <RowData line={line} title={title} entry={entry} data={data} />
  </tr>
);

const LineData = ({ lineId, data }: { lineId: string; data: any }) => {
  const line = data[lineId];
  return (
    <>
      <tr className="border-t-4">
        <td rowSpan={7}>
          <Link href={`/lines/${lineId}`}>
            <a>{Lines[lineId].label}</a>
          </Link>
          <p>{`${distances[lineId]} km`}</p>
        </td>
        <RowData data={data} line={line} title="Voyageurs moyens" entry="pax" />
      </tr>
      <LineRow
        data={data}
        line={line}
        title="Nombre aller-retour"
        entry="circulations"
      />
      <LineRow
        data={data}
        line={line}
        title="Voyageurs annuels"
        entry="travellers"
      />
      <LineRow data={data} line={line} title="Train" entry="trainLabel" />
      <LineRow data={data} line={line} title="% occupation" entry="occupancy" />
      <LineRow
        data={data}
        line={line}
        title="Couts de circulation"
        entry="cost"
      />
      <LineRow
        data={data}
        line={line}
        title="Aide au lancement"
        entry="startReduction"
      />
    </>
  );
};

const TotalRow = ({
  title,
  entry,
  data,
}: {
  title: string;
  entry: string;
  data: any;
}) => (
  <>
    <td>{title}</td>
    {years(data).map((year) => (
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

const Total = ({
  title,
  entry,
  data,
}: {
  title: string;
  entry: string;
  data: any;
}) => (
  <tr>
    <TotalRow data={data} title={title} entry={entry} />
  </tr>
);

const Totals = ({ data }: { data: any }) => (
  <>
    <tr className="border-t-4">
      <td rowSpan={10}>Totaux</td>
      <TotalRow data={data} title="Voyageurs" entry="travellers" />
    </tr>
    <Total data={data} title="Couts de circulation" entry="cost" />
    <Total data={data} title="Matériel (location)" entry="renting" />
    <Total data={data} title="Maintenance courante" entry="maintenance" />
    <Total
      data={data}
      title="Provision maintenance lourde"
      entry="heavyMaintenance"
    />
    <td>Location matériel réserve</td>
    {years(data).map((year) => (
      <td key={year} className="text-right">
        {smartFmt(
          _.sumBy(spare[year], ([car, count]) => car.renting() * count)
        )}
      </td>
    ))}
    <Total data={data} title="Cout total production" entry="totalCost" />
    <Total data={data} title="Aide lancement" entry="startReduction" />
    <Total data={data} title="Chiffre d’affaires (150€/pax)" entry="revenue" />
    <Total data={data} title="Resultat" entry="total" />
  </>
);

const MasterPlan = ({ infra }: { infra: Infra }) => {
  const router = useRouter();
  const { plan } = router.query;
  const planId = typeof plan === 'string' ? plan : plan[0];
  const data = enrichData(infra, planId);
  return (
    <div className="p-12">
      <h1>Master plan</h1>
      <table className="border-4">
        <thead>
          <tr>
            <th>Route</th>
            <th> </th>
            {years(data).map((year) => (
              <th key={year}>{year}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.keys(data).map((lineId) => (
            <LineData lineId={lineId} data={data} />
          ))}
          <Totals data={data} />
        </tbody>
      </table>
    </div>
  );
};

export default MasterPlan;

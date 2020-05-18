
import { useRouter } from 'next/router';
import { GetStaticProps, GetStaticPaths } from 'next';
import React from 'react';
import VehicleJourney from '../../../components/vehicle_journey';
import { Infra, importAirtable } from '../../../data/airtable_importer';
import Routes from '../../../data/lines';
import buildVJ from '../../../lib/line';
import { Day } from '../../../lib/types.d';

export const getStaticProps: GetStaticProps = importAirtable;

export const getStaticPaths: GetStaticPaths = async () => {
  const lines = Object.keys(Routes);
  const days = Object.values(Day);
  const vals = [].concat(...lines.map((line) => [].concat(...days.map((day) => ({ line, day })))));
  return {
    paths: vals.map((route) => ({ params: route })),
    fallback: false,
  };
};

export default ({ infra }: Infra) => {
  const router = useRouter();
  const { line, day } = router.query;

  return <VehicleJourney vj={buildVJ(line, day, infra)} />;
};

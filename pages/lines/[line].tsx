
import { useRouter } from 'next/router';
import { GetStaticProps, GetStaticPaths } from 'next';
import React from 'react';
import VehicleJourney from '../../components/vehicle_journey';
import { Infra, importAirtable } from '../../data/airtable_importer';
import Routes from '../../data/lines';
import buildVJ from '../../lib/line';

export const getStaticProps: GetStaticProps = importAirtable;

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: Object.keys(Routes).map((r) => ({ params: { line: r } })),
  fallback: false,
});

export default ({ infra }: Infra) => {
  const router = useRouter();
  const { line } = router.query;

  return <VehicleJourney vj={buildVJ(line, 'Lundi', infra)} />;
};

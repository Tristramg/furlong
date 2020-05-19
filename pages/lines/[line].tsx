import { useRouter } from 'next/router';
import { GetStaticProps, GetStaticPaths } from 'next';
import React from 'react';
import { Infra, importAirtable } from '../../data/airtable_importer';
import Routes from '../../data/lines';
import Line from '../../components/line';

export const getStaticProps: GetStaticProps = importAirtable;

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: Object.keys(Routes).map((r) => ({ params: { line: r } })),
  fallback: false,
});

export default ({ infra }: Infra) => {
  const router = useRouter();
  const { line } = router.query;

  return <Line line={line} infra={infra} />;
};

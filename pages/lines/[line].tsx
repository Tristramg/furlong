import { useRouter } from 'next/router';
import { GetStaticProps, GetStaticPaths } from 'next';
import React from 'react';
import { Infra, importAirtable } from '../../data/airtable_importer';
import { MarketData, importMarketData } from '../../data/market_importer';
import Routes from '../../data/lines';
import Line from '../../components/line';

export const getStaticProps: GetStaticProps = async ({ params }) => {
  return {
    props: {
      infra: await importAirtable(),
      market: await importMarketData(),
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: Object.keys(Routes).map((r) => ({ params: { line: r } })),
  fallback: false,
});

const lineComponent = ({
  infra,
  market,
}: {
  infra: Infra;
  market: MarketData;
}) => {
  const router = useRouter();
  const { line } = router.query;
  const lineId = typeof line === 'string' ? line : line[0];

  return <Line lineId={lineId} infra={infra} market={market} />;
};

export default lineComponent;

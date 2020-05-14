import Routes from '../../data/lines';
import { gen } from '../../lib/helpers';
import { VehicleJourney as VJ } from '../../lib/types';
import { Day } from '../../lib/types.d';
import VehicleJourney from '../../components/vehicle_journey';
import importAirtable from '../../data/airtable_importer';

import _ from 'lodash';
import { useRouter } from 'next/router';

import { GetStaticProps, GetStaticPaths } from 'next';

export const getStaticProps: GetStaticProps = importAirtable;

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: Object.keys(Routes).map(r => ({ params: { line: r } })),
    fallback: false,
  };
};

const Home = ({ infra }) => {
  const router = useRouter();
  const { line } = router.query;
  const l = typeof line === 'string' ? line : line[0];
  const route = Routes[l];
  const edges = gen(route.steps, infra);
  const vj = new VJ({ label: route.label, segments: edges }, route.train, Day.Monday);
  return <VehicleJourney vj={vj}></VehicleJourney>;
};

export default Home;


import VehicleJourney from '../../components/vehicle_journey';
import importAirtable from '../../data/airtable_importer';
import Routes from '../../data/lines';
import buildVJ from '../../lib/line';
import { useRouter } from 'next/router';
import { GetStaticProps, GetStaticPaths } from 'next';

export const getStaticProps: GetStaticProps = importAirtable;

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: Object.keys(Routes).map(r => ({ params: { line: r } })),
    fallback: false,
  };
};

export default ({ infra }) => {
  const router = useRouter();
  const { line } = router.query;

  return <VehicleJourney vj={buildVJ(line, 'Lundi', infra)}></VehicleJourney>;
};

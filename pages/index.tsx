import nord_east from '../lines/nord_east';
import * as Trains from '../data/trains'
import {vehicleJourney, fmt} from '../lib/helpers';
import VehicleJourney from '../components/vehicle_journey';

const vj = vehicleJourney(nord_east.segments, Trains.talgo230)

const Home = ({ userAgent }) => <VehicleJourney vj={vj}></VehicleJourney>;

Home.getInitialProps = async ({ req }) => {
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
  return { userAgent };
};

export default Home;

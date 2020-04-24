import nord_east from '../lines/nord_east';
import * as Trains from '../data/trains'
import {vehicleJourney, fmt} from '../lib/helpers';
import VehicleJourney from '../components/vehicle_journey';

const vj = vehicleJourney(nord_east.label, nord_east.segments, Trains.talgo230)
const Home = () => <VehicleJourney vj={vj}></VehicleJourney>;

export default Home;

import Segment from '../components/segment';
import nord_east from '../lines/nord_east';
import * as Trains from '../data/trains'
import {vehicleJourney, fmt} from '../lib/helpers';

const vj = vehicleJourney(nord_east.segments, Trains.talgo230)

const Home = ({ userAgent }) => <div className="p-12">
  <h1 className="text-lg">{nord_east.label}</h1>
  <div className="flex gap font-bold border border-gray-400 rounded m-1 px-1">
    <div className="w-2/12">Segment</div>
    <div className="w-1/12 text-right">Distance</div>
    <div className="w-1/12 text-right">Énergie</div>
    <div className="w-8/12 mx-6 flex">
        <span className="w-1/12">€/km</span>
        <span className="w-1/12">€/t-km</span>
        <span className="w-1/12">€/kWh</span>
        <span className="w-1/12">Total €</span>
        <span className="w-6/12">Formule</span>
    </div>
    <div>Total</div>
  </div>
  <div>
    {vj.segments.map((segment, index) => <Segment key={index} segment={segment}></Segment>)}
  </div>
  <div className="flex gap font-bold border border-gray-400 rounded m-1 px-1">
    <div className="w-2/12">Totaux</div>
    <div className="w-1/12 text-right">{vj.distance} km</div>
    <div className="w-1/12 text-right">{vj.energy} kWh</div>
    <div className="w-8/12 mx-6"></div>
    <div className="flex"></div>
    <div>{fmt(vj.price)} €</div>
  </div>
</div>;

Home.getInitialProps = async ({ req }) => {
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
  return { userAgent };
};

export default Home;

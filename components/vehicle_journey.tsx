import * as React from 'react';
import { fmt } from '../lib/helpers';
import Segment from './segment';
import VJSummary from './vj_summary';
import VehicleJourney from '../lib/vehicle_journey';

type Props = {
  vj: VehicleJourney;
};

const VehicleJourneyComponent: React.FunctionComponent<Props> = ({ vj }) => (
  <div className="p-12">
    <h1>{vj.label}</h1>
    <h2>Synthèse</h2>
    <VJSummary vj={vj} />
    <h2>Détails</h2>
    <div className="flex gap font-bold border border-gray-400 rounded m-1 px-1">
      <div className="w-2/12">Segment</div>
      <div className="w-1/12 flex text-right">
        <span className="w-1/2">km</span>
        <span className="w-1/2">kWh</span>
      </div>
      <div className="w-8/12 mx-6 flex">
        <span className="w-1/12">€/km</span>
        <span className="w-1/12">€/t-km</span>
        <span className="w-1/12">€/kWh</span>
        <span className="w-1/12">€ fixe</span>
        <span className="w-1/12">Total €</span>
        <span>Formule</span>
      </div>
      <div className="w-1/12 text-right">Total</div>
    </div>
    <div>
      {vj.edges.map((edge, index) => <Segment key={index} edge={edge} />)}
    </div>
    <div className="flex gap font-bold border border-gray-400 rounded m-1 px-1">
      <div className="w-2/12">Totaux</div>
      <div className="w-1/12 flex text-right">
        <span className="w-1/2">{vj.distance}</span>
        <span className="w-1/2">{vj.energy}</span>
      </div>
      <div className="w-8/12 mx-6" />
      <div className="w-1/12 text-right">
        {fmt(vj.price)}
 €
      </div>
    </div>
  </div>
);

export default VehicleJourneyComponent;

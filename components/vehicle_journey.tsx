import * as React from 'react';
import VJSummary from './vj_summary';
import VJDetails from './vj_details';
import VehicleJourney from '../lib/vehicle_journey';

type Props = {
  vj: VehicleJourney;
};

const VehicleJourneyComponent: React.FunctionComponent<Props> = ({
  vj,
}: Props) => (
  <div className="p-12">
    <h1>{vj.label}</h1>
    <h2>Synthèse</h2>
    <VJSummary vj={vj} />
    <h2>Détails</h2>
    <VJDetails vj={vj} />
  </div>
);

export default VehicleJourneyComponent;

import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import Station from './station';
import { Station as StationType } from '../../pages/api/stations';
import SelectStation from './select_station';

function StationsList({ stations }: PropsFromRedux) {
  return (
    <div className="p-2 border rounded w-full">
      {stations.map((station: StationType) => (
        <Station name={station.label} node={station.node} />
      ))}
      <div className="py-2">
        <span>Ajouter un arrêt</span>
        <SelectStation />
      </div>
    </div>
  );
}

const mapStateToProps = ({ line }) => ({ stations: line.stations });
const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(StationsList);

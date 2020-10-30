import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import axios from 'axios';
import AsyncSelect from 'react-select/async';
import * as Actions from '../../lib/actions';
import { Station } from '../../pages/api/stations';

const promiseOptions = async (inputValue: string): Promise<Station[]> => {
  try {
    const res = await axios.get(`/api/stations?q=${inputValue}`);
    if (res.status === 200) {
      return res.data;
    }
  } catch (_error) {
    return [];
  }
  return [];
};

const SelectStation = ({ stations, addStation, addRoute }: PropsFromRedux) => {
  function onChange(station: Station, { action }: { action: string }): void {
    if (action === 'select-option') {
      if (stations.length > 0) {
        const pred = stations[stations.length - 1].node;
        addRoute({
          from: pred,
          to: station.node,
        });
      }
      addStation(station);
    }
  }

  return (
    <AsyncSelect
      cacheOptions
      defaultOptions
      loadOptions={promiseOptions}
      onChange={onChange}
    />
  );
};

const mapStateToProps = ({ line }) => ({ stations: line.stations });
const connector = connect(mapStateToProps, {
  addStation: Actions.addStation,
  addRoute: Actions.addRoute,
});

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(SelectStation);

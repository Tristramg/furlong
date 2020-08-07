import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import * as t from '../../database/types.d';
import * as Actions from '../../lib/actions';
import Add from './add';
import Train from './train';

interface Props {
  trains: t.Train[];
}

function TrainList({ trains, createTrain }: Props & PropsFromRedux) {
  return (
    <div>
      <Add action={createTrain} />
      {trains.map((train: t.Train) => (
        <div>
          <Train key={train.id} train={train} />
        </div>
      ))}
    </div>
  );
}

const carsMapSateToProps = ({ trains }) => ({ trains });
const connector = connect(carsMapSateToProps, {
  createTrain: Actions.createTrain,
});
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(TrainList);

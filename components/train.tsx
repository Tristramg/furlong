import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Train from '../lib/train';
import { CarType } from '../lib/types.d';

const carType = {
  [CarType.Locomotive]: (
    <FontAwesomeIcon icon="train" className="text-gray-600" />
  ),
  [CarType.Passenger]: <FontAwesomeIcon icon="bed" className="text-gray-600" />,
  [CarType.Restaurant]: (
    <FontAwesomeIcon icon="utensils" className="text-gray-600" />
  ),
};

type Props = {
  train: Train;
};

const TrainComponent: React.FunctionComponent<Props> = ({ train }: Props) => {
  return (
    <div>
      <span className="font-bold m-1">Train</span>
      <span className="m-1">{train.label}</span>
      <span className="m-1">
        <FontAwesomeIcon icon="weight-hanging" className="text-gray-600" />
        {train.fmtWeight()}
      </span>
      <span className="m-1">
        <FontAwesomeIcon icon="user" className="text-gray-600" />
        {train.fmtCapacity()}
      </span>
      <span className="m-1">
        <FontAwesomeIcon icon="arrows-alt-h" className="text-gray-600" />
        {train.fmtLength()}
      </span>
      <span>
        (
        {train.cars.map(([car, count]) => (
          <span className="m-1" key={car.type}>
            {carType[car.type]}
            {`×${count}`}
          </span>
        ))}
        )
      </span>
    </div>
  );
};

export default TrainComponent;

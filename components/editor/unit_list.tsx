import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import Unit from './unit';

function UnitList({ units }: PropsFromRedux) {
  return (
    <div>
      {units.map((unit) => (
        <Unit key={unit.id} unit={unit} />
      ))}
    </div>
  );
}

const mapStateToProps = ({ units }) => ({ units });
const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(UnitList);

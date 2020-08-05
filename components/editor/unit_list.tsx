import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import Unit from './unit';
import * as Actions from '../../lib/actions';
import Add from './add';

function UnitList({ units, createUnit }: PropsFromRedux) {
  return (
    <div>
      <Add action={createUnit} />
      {units.map((unit) => (
        <Unit key={unit.id} unit={unit} />
      ))}
    </div>
  );
}

const mapStateToProps = ({ units }) => ({ units });
const connector = connect(mapStateToProps, { createUnit: Actions.createUnit });
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(UnitList);

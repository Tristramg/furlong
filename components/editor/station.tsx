import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import * as Actions from '../../lib/actions';

type Props = {
  name: string;
  node: number;
};

function Station({ name, node, deleteStation }: Props & PropsFromRedux) {
  return (
    <div className="flex w-full">
      <div className="w-11/12">{name}</div>
      <div className="w-1/12 text-right">
        <button type="button" onClick={() => deleteStation({ node })}>
          <FontAwesomeIcon icon="trash" className="text-gray-400" />
        </button>
      </div>
    </div>
  );
}

const connector = connect(null, {
  deleteStation: Actions.deleteStation,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Station);

import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import * as Actions from '../../lib/actions';
import { Segment as SegmentType } from '../../database/types.d';
import { fmt, fh } from '../../lib/helpers';

type Props = {
  segment: SegmentType;
};

function Segment({ segment }: Props & PropsFromRedux) {
  console.log('segment', segment);
  return (
    <div className="flex w-full">
      <div className="w-1/12">{segment.country}</div>
      <div className="w-1/12">{fmt(segment.distance)}</div>
      <div className="w-1/12">{fh(segment.duration / 60)}</div>
      <div className="w-1/12 text-right">x</div>
    </div>
  );
}

const connector = connect(null, {
  deleteStation: Actions.deleteStation,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Segment);

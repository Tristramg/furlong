import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import Segment from './segment';
import { Segment as SegmentType } from '../../database/types.d';

function SegmentList({ segments }: PropsFromRedux) {
  return (
    <div className="p-2 border rounded w-full">
      <div className="flex w-full font-bold">
        <div className="w-1/12">Pays</div>
        <div className="w-1/12">km</div>
        <div className="w-1/12">durée</div>
        <div className="w-1/12 text-right">GV</div>
      </div>
      {segments.map((segment: SegmentType) => (
        <Segment segment={segment} />
      ))}
    </div>
  );
}

const mapStateToProps = ({ line }) => ({ segments: line.segments });
const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(SegmentList);

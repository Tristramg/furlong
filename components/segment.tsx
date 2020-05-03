import * as React from 'react';
import { TrainEdge, Rule } from '../lib/types';
import { grey, fmt, fh } from '../lib/helpers';

type Props = {
  edge: TrainEdge,
};

type SingleRuleProps = {
  rule: Rule,
  price: number,
};

const singleRule: React.FunctionComponent<SingleRuleProps> = ({ rule, price }) => (
  <div className="flex">
    <span className={`w-1/12 ${grey(rule.per_km)}`}>{fmt(rule.per_km)}</span>
    <span className={`w-1/12 ${grey(rule.per_ton_and_km)}`}>{fmt(rule.per_ton_and_km)}</span>
    <span className={`w-1/12 ${grey(rule.per_kWh)}`}>{fmt(rule.per_kWh)}</span>
    <span className={`w-1/12 ${grey(price)}`}>{fmt(price)}</span>
    <span className="text-xs w-5/12">{rule.label}</span>
  </div>
);

const Segment: React.FunctionComponent<Props> = ({ edge }) => {
  return (
  <div className="flex gap text-sm border border-gray-400 rounded m-1 px-1 odd:bg-gray-100">
    <div className="w-2/12 h-full m-auto">
      <div className="">
        <span className="w-1/4 font-mono">{fh(edge.edge.departureTime)}</span>
        <span className="mx-1 text-base">{edge.edge.start}</span>
      </div>
      <div className="text-xs text-right object-middle">{edge.edge.label}</div>
      <div className="">
        <span className="w-1/4 font-mono">{fh(edge.edge.arrivalTime)}</span>
        <span className="mx-1 text-base">{edge.edge.end}</span>
      </div>
    </div>
    <div className="w-1/12 h-full text-right align-middle m-auto">{edge.edge.distance} km</div>
    <div className="w-1/12 h-full text-right align-middle m-auto">{edge.energy} kWh</div>
    <div className="w-7/12 mx-6">
        {edge.rules.map(rule => singleRule({ rule, price: edge.singlePrice(rule) }))}
    </div>
    <div className="w-1/12 align-middle m-auto text-right">{fmt(edge.price)} €</div>
  </div>
  );
};

export default Segment;

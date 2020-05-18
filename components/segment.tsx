import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TrainEdge, Rule } from '../lib/types';
import { grey, fmt, fh } from '../lib/helpers';
import { RuleCategory } from '../lib/types.d';

type Props = {
  edge: TrainEdge,
};

type SingleRuleProps = {
  rule: Rule,
  price: number,
};

const icons = {
  [RuleCategory.Energy]: <FontAwesomeIcon className="text-gray-600" icon="bolt" />,
  [RuleCategory.Tracks]: <FontAwesomeIcon className="text-gray-600" icon="road" />,
  [RuleCategory.Station]: <FontAwesomeIcon className="text-gray-600" icon="building" />,
};

const singleRule: React.FunctionComponent<SingleRuleProps> = ({ rule, price }) => (
  <div className="flex">
    <span className={`w-1/12 ${grey(rule.perKm)}`}>{fmt(rule.perKm)}</span>
    <span className={`w-1/12 ${grey(rule.perTonAndKm)}`}>{fmt(rule.perTonAndKm)}</span>
    <span className={`w-1/12 ${grey(rule.perkWh)}`}>{fmt(rule.perkWh)}</span>
    <span className={`w-1/12 ${grey(rule.fixed)}`}>{fmt(rule.fixed)}</span>
    <span className={`w-1/12 ${grey(price)}`}>{fmt(price)}</span>
    <span className="text-xs w-5/12">
      {icons[rule.category]}
      {' '}
      {rule.label}
    </span>
  </div>
);

const StopTime = ({ stop }) => (
  <div className={stop.commercial ? '' : 'text-gray-500'}>
    <span className="w-1/4 font-mono">{fh(stop.time)}</span>
    <span className="mx-1 text-base">{stop.label}</span>
  </div>
);

const Times = ({ edge }) => (
  <div className="w-2/12 h-full m-auto">
    <StopTime stop={edge.departure} />
    <div className="text-xs text-right object-middle">{edge.label}</div>
    <StopTime stop={edge.arrival} />
  </div>
);

const Segment: React.FunctionComponent<Props> = ({ edge }) => (
  <div className="flex gap text-sm border border-gray-400 rounded m-1 px-1 odd:bg-gray-100">
    <Times edge={edge.edge} />
    <div className="w-1/12 flex align-middle m-auto text-right">
      <div className="w-1/2">{edge.edge.distance}</div>
      <div className="w-1/2">{edge.energy}</div>
    </div>
    <div className="w-8/12 mx-6">
      {edge.rules.map((rule) => singleRule({ rule, price: edge.singlePrice(rule) }))}
    </div>
    <div className="w-1/12 align-middle m-auto text-right">
      {fmt(edge.price)}
 €
    </div>
  </div>
);

export default Segment;

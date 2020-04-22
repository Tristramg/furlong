import * as React from 'react'
import * as Types from '../lib/types';
import {grey, fmt, singlePrice, segmentPrice} from '../lib/helpers';

type Props = {
    segment: Types.TrainSegment,
}

type SingleRuleProps = {
    rule: Types.Rule,
    price: number,
}

const singleRule: React.FunctionComponent<SingleRuleProps> = ({rule, price}) => (
    <div className="flex">
        <span className={"w-1/12 " + grey(rule.per_km)}>{fmt(rule.per_km)}</span>
        <span className={"w-1/12 " + grey(rule.per_ton_and_km)}>{fmt(rule.per_ton_and_km)}</span>
        <span className={"w-1/12 " + grey(rule.per_kWh)}>{fmt(rule.per_kWh)}</span>
        <span className={"w-1/12 " + grey(price)}>{fmt(price)}</span>
        <span className="text-xs w-5/12">{rule.label}</span>
    </div>
)

const Segment: React.FunctionComponent<Props> = ({segment}) => {
    return (
    <div className="flex gap text-sm border border-gray-400 rounded m-1 px-1 odd:bg-gray-100">
        <div className="w-2/12 h-full">
            <div className="text-base">{segment.from}</div>
            <div className="text-xs text-right">{segment.label}</div>
            <div className="text-base">{segment.to}</div>
        </div>
        <div className="w-1/12 h-full text-right align-middle m-auto">{segment.distance} km</div>
        <div className="w-1/12 h-full text-right align-middle m-auto">{segment.energy} kWh</div>
        <div className="w-8/12 mx-6">{segment.rules.map(rule => singleRule({rule, price: singlePrice(rule, segment) }))}</div>
        <div className="align-middle m-auto">{fmt(segmentPrice(segment))} €</div>
    </div>
)}

export default Segment;

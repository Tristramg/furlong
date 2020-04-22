import _ from 'lodash'
import { Segment, SegmentTrainParams, Rule, TrainSegment, Train, VehicleJourney} from './types';
import { rules } from '../data/countries'

function enrichSegment(segment: Segment, train: Train): TrainSegment {
    let result = segment as TrainSegment;
    const energy = segment.distance * 10;
    result.rules = rules(segment, train);
    result.weight = train.weight;
    result.energy = energy;
    result.price = segmentPrice(result);
    return result;
}

function vehicleJourney(rawSegments: Segment[], train: Train): VehicleJourney {
    const segments = rawSegments.map(s => enrichSegment(s, train))
    return {
        segments,
        price: _(segments).map('price').sum(),
        distance: _(segments).map('distance').sum(),
        energy: _(segments).map('energy').sum(),
    }
}

function singlePrice(rule: Rule, segment: TrainSegment): number {
    return segment.weight * segment.distance * rule.per_ton_and_km +
           segment.distance * rule.per_km +
           segment.energy * rule.per_kWh
}

function segmentPrice(segment: TrainSegment): number {
    return _(segment.rules).map(r => singlePrice(r, segment)).sum()
}

const fmt = (val: number): string => {
    if(val == 0.0) {
        return "—"
    } else {
        return val.toPrecision(3);
    }
}

const grey = (val: number): string => {
    if (val == 0.0) {
        return "text-gray-500"
    } else {
        return ""
    }
}

export {fmt, grey, singlePrice, segmentPrice, vehicleJourney}

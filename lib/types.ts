import { Country } from "../data/countries";

interface Rule {
    per_ton_and_km: number;
    per_km: number;
    per_kWh: number;
    label: string;
};

interface Segment {
    distance: number;
    from: string;
    to: string;
    label: string;
    country: Country;
};

interface SegmentTrainParams {
    weight: number;
    energy: number;
}

interface Train {
    label: string;
    highSpeed: boolean;
    gaugeChange: boolean;
    weight: number;
    cars: number;
}

interface Line {
    label: string;
    highSpeed: boolean;
    gaugeChange: boolean;
    segments: Segment[];
}

interface TrainSegment extends Segment {
    segment: Segment;
    price: number;
    rules: Rule[];
    weight: number;
    energy: number;
}

interface VehicleJourney {
    segments: TrainSegment[];
    price: number;
    distance: number;
    energy: number;
}

export type {Rule, Segment, SegmentTrainParams, Train, Line, TrainSegment, VehicleJourney}

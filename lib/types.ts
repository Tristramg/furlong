import { Country, rules } from "../data/countries";
import _ from 'lodash'

interface Rule {
    per_ton_and_km: number;
    per_km: number;
    per_kWh: number;
    label: string;
};


interface Train {
    label: string;
    highSpeed: boolean;
    gaugeChange: boolean;
    weight: number;
    cars: number;
}

interface VehicleJourney {
    label: string,
    edges: TrainEdge[];
    price: number;
    distance: number;
    energy: number;
}

class InfraEdge {
    start: string;
    end: string;
    label: string;
    distance: number;
    country: Country;
}
class Edge extends InfraEdge {
    departure_time: number;
    arrival_time: number;
}

class TrainEdge {
    edge: Edge;
    weight: number;
    energy: number;
    price: number;
    rules: Rule[];

    constructor(edge: Edge, train: Train) {
        this.edge = edge;
        this.weight = train.weight;
        this.energy = edge.distance * 10;
        this.rules = rules(edge, train);
        this.price = _(this.rules).map(r => this.singlePrice(r)).sum()
    }

    singlePrice(rule: Rule): number {
        return this.weight * this.edge.distance * rule.per_ton_and_km +
               this.edge.distance * rule.per_km +
               this.energy * rule.per_kWh
    }
}

interface Route {
    label: string,
    segments: Edge[],
}
export type {Rule, Train, VehicleJourney, Edge, Route}
export { TrainEdge }

import _ from 'lodash'
import { Edge, TrainEdge, Train, VehicleJourney} from './types';

function vehicleJourney(label: string, rawSegments: Edge[], train: Train): VehicleJourney {
    const edges = rawSegments.map(s => new TrainEdge(s, train))
    return {
        edges,
        label,
        price: _(edges).map('price').sum(),
        distance: _(edges).map('edge.distance').sum(),
        energy: _(edges).map('energy').sum(),
    }
}

const fmt = (val: number): string => {
    if(val == 0.0) {
        return "—"
    } else {
        return String(Number(val.toPrecision(3)));
    }
}

const grey = (val: number): string => {
    if (val == 0.0) {
        return "text-gray-500"
    } else {
        return ""
    }
}

const h = (hours: number, minutes: number): number => {
    if(hours < 12) {
        return (24 + hours) * 60 + minutes;
    } else {
        return hours * 60 + minutes;
    }
}

const fh = (time: number): string => {
    const h = String(Math.floor(time / 60) % 24).padStart(2, '0');
    const m = String(time % 60).padStart(2, '0');
    return `${h}:${m}`
}

export {fmt, grey, vehicleJourney, h, fh}

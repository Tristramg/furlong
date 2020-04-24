import _ from 'lodash'
import { Edge, TrainEdge, Train, VehicleJourney} from './types';

function vehicleJourney(label: string, rawSegments: Edge[], train: Train): VehicleJourney {
    const edges = rawSegments.map(s => new TrainEdge(s, train))
    return {
        edges,
        label,
        price: _(edges).map('price').sum(),
        distance: _(edges).map('distance').sum(),
        energy: _(edges).map('energy').sum(),
    }
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

export {fmt, grey, vehicleJourney}

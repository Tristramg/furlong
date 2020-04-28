import { Rule, Edge, Train } from '../lib/types'
import { h } from '../lib/helpers'

function duration(edge: Edge, start: number, end: number):number {
    const d = Math.min(end, edge.arrival_time) - Math.max(start, edge.departure_time)
    return Math.max(0, d)
}

function metro_price(edge: Edge, avg_speed: number): number {
    const considered_speed = Math.max(100, Math.min(160, avg_speed));
    const metro_max = 12.06;
    const metro_min = 5.34;
    return metro_min + (considered_speed - 100) * (metro_max - metro_min) / 60
}

function rules(edge: Edge, train: Train): Rule[] {
    const total_duration = edge.arrival_time - edge.departure_time;
    const night_duration = duration(edge, h(23, 0), h(6, 0));
    const basic_duration = duration(edge, h(20, 0), h(23, 0));
    const metro_duration = duration(edge, 6 * 60, 20 * 60) + duration(edge, (6 + 24) * 60, (20 + 24) * 60 );

    const avg_speed = edge.distance * 60 / total_duration;
    const metro_mid = metro_price(edge, avg_speed);

    return [
        {
            per_km: 2.63 * night_duration / total_duration,
            per_kWh: 0,
            per_ton_and_km: 0,
            label: `Prix nuit « nacht » 2,63€/km sur ${(night_duration * 100 / total_duration).toFixed(0)}%`
        },
        {
            per_km: 4.76 * basic_duration / total_duration,
            per_kWh: 0,
            per_ton_and_km: 0,
            label: `Prix « basic »  4,76 €/km sur ${(basic_duration * 100 / total_duration).toFixed(0)}%`
        },
        {
            per_km: metro_mid * metro_duration / total_duration,
            per_kWh: 0,
            per_ton_and_km: 0,
            label: `Prix « basic »  ${metro_mid.toFixed(2)} €/km, vitesse moyenne ${avg_speed.toFixed(0)} km/h sur ${(metro_duration * 100 / total_duration).toFixed(0)}%`
        },
        {
            per_km: 0,
            per_kWh: 0.0628,
            per_ton_and_km: 0,
            label: 'Distribution électricité',
        }
    ]
}

export default rules;

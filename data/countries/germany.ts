import { Rule, Edge, Train } from '../../lib/types';
import { RuleCategory } from '../../lib/types.d';
import { h } from '../../lib/helpers';
import { stationRules } from '../countries';

function duration(edge: Edge, start: number, end: number):number {
  const d = Math.min(end, edge.arrival.time) - Math.max(start, edge.departure.time);
  return Math.max(0, d);
}

function metroPrice(edge: Edge, avgSpeed: number): number {
  const consideredSpeed = Math.max(100, Math.min(160, avgSpeed));
  const metroMax = 12.06;
  const metroMin = 5.34;
  return metroMin + (consideredSpeed - 100) * (metroMax - metroMin) / 60;
}

function rules(edge: Edge, train: Train,  edges: Edge[], index: number): Rule[] {
  const totalDuration = edge.arrival.time - edge.departure.time;
  const nightDuration = duration(edge, h(23, 0), h(6, 0));
  const basicDuration = duration(edge, h(20, 0), h(23, 0));
  const metroDuration = duration(edge, 6 * 60, 20 * 60) +
                        duration(edge, (6 + 24) * 60, (20 + 24) * 60);

  const avgSpeed = edge.distance * 60 / totalDuration;
  const metroMid = metroPrice(edge, avgSpeed);

  const nightShare = (nightDuration * 100 / totalDuration).toFixed(0);
  const basicShare = (basicDuration * 100 / totalDuration).toFixed(0);
  const metroShare = (metroDuration * 100 / totalDuration).toFixed(0);

  return [
    {
      per_km: 2.63 * nightDuration / totalDuration,
      per_kWh: 0,
      per_ton_and_km: 0,
      fixed: 0,
      label: `Prix nuit « nacht » 2,63€/km sur ${nightShare}%`,
      category: RuleCategory.Tracks,
    },
    {
      per_km: 4.76 * basicDuration / totalDuration,
      per_kWh: 0,
      per_ton_and_km: 0,
      fixed: 0,
      label: `Prix « basic »  4,76 €/km sur ${basicShare}%`,
      category: RuleCategory.Tracks,
    },
    {
      per_km: metroMid * metroDuration / totalDuration,
      per_kWh: 0,
      per_ton_and_km: 0,
      fixed: 0,
      label: `Prix « metro »  ${metroMid.toFixed(2)} €/km, vitesse moyenne ${avgSpeed.toFixed(0)} km/h sur ${metroShare}%`,
      category: RuleCategory.Tracks,
    },
    {
      per_km: 0,
      per_kWh: 0.0628,
      per_ton_and_km: 0,
      fixed: 0,
      label: 'Distribution électricité',
      category: RuleCategory.Energy,
    },
    {
      per_km: 0,
      per_kWh: 0.07,
      per_ton_and_km: 0,
      fixed: 0,
      label: 'Fourniture électricité',
      category: RuleCategory.Energy,
    },
  ].concat(stationRules(edge, index === edges.length - 1));
}

export default rules;

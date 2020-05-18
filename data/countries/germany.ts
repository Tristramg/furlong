import { Train } from '../../lib/types';
import Edge from '../../lib/edge';
import { RuleCategory, Day } from '../../lib/types.d';
import { h, weekEnd } from '../../lib/helpers';
import { Rule, stationRules } from '../../lib/rule';

function duration(edge: Edge, start: number, end: number):number {
  const d = Math.min(end, edge.arrival.time) - Math.max(start, edge.departure.time);
  return Math.max(0, d);
}

function metroPrice(edge: Edge, avgSpeed: number): number {
  const consideredSpeed = Math.max(100, Math.min(160, avgSpeed));
  const metroMax = 12.06;
  const metroMin = 5.34;
  return metroMin + ((consideredSpeed - 100) * (metroMax - metroMin)) / 60;
}

function basic(edge: Edge, day: Day): number {
  if (weekEnd(edge, day)) {
    return duration(edge, h(6, 0), h(9, 0))
           + duration(edge, h(20, 0), h(23, 0));
  }
  return duration(edge, h(20, 0), h(23, 0));
}

function metro(edge: Edge, day: Day): number {
  if (weekEnd(edge, day)) {
    return duration(edge, 9 * 60, 20 * 60)
           + duration(edge, (9 + 24) * 60, (20 + 24) * 60);
  }

  return duration(edge, 6 * 60, 20 * 60)
         + duration(edge, (6 + 24) * 60, (20 + 24) * 60);
}

function rules(edge: Edge, train: Train, edges: Edge[], index: number, day: Day): Rule[] {
  const totalDuration = edge.arrival.time - edge.departure.time;
  const nightDuration = duration(edge, h(23, 0), h(6, 0));
  const basicDuration = basic(edge, day);
  const metroDuration = metro(edge, day);

  const avgSpeed = (edge.distance * 60) / totalDuration;
  const metroMid = metroPrice(edge, avgSpeed);

  const nightShare = ((nightDuration * 100) / totalDuration).toFixed(0);
  const basicShare = ((basicDuration * 100) / totalDuration).toFixed(0);
  const metroShare = ((metroDuration * 100) / totalDuration).toFixed(0);

  return [
    Rule.perKm((2.63 * nightDuration) / totalDuration,
      `Prix „Nacht“ 2,63€/km sur ${nightShare}%`,
      RuleCategory.Tracks),
    Rule.perKm((4.76 * basicDuration) / totalDuration,
      `Prix „Basic“  4,76 €/km sur ${basicShare}%`,
      RuleCategory.Tracks),
    Rule.perKm((metroMid * metroDuration) / totalDuration,
      `Prix „Metro“  ${metroMid.toFixed(2)} €/km, vitesse moyenne ${avgSpeed.toFixed(0)} km/h sur ${metroShare}%`,
      RuleCategory.Tracks),
    Rule.perkWh(0.0628, 'Distribution électricité'),
    Rule.perkWh(0.07, 'Fourniture électricité'),
  ].concat(stationRules(edge, index === edges.length - 1));
}

export default rules;

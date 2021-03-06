import { Rule } from '../../lib/rule';
import Edge from '../../lib/edge';
import { RuleCategory } from '../../lib/types.d';
import channel from './channel';

function highSpeed1(edge: Edge): Rule[] {
  const duration = edge.arrival.time - edge.departure.time;
  const eurosPerPound = 1.13;

  const ircPerMinute = 96.09 * eurosPerPound;
  const aircPerMinute = 1 * eurosPerPound;
  const omrcPerMinute = 52.45 * eurosPerPound;

  return [
    {
      perTonAndKm: 0,
      perKm: 0,
      perkWh: 0,
      fixed: duration * ircPerMinute,
      label: `Investment Recovery Charge (IRC), ${ircPerMinute} par minute`,
      category: RuleCategory.Tracks,
    },
    {
      perTonAndKm: 0,
      perKm: 0,
      perkWh: 0,
      fixed: duration * aircPerMinute,
      label: `Additionnal Investment Recovery Charge (AIRC) for internationnal passenger service, ${aircPerMinute} par minute`,
      category: RuleCategory.Tracks,
    },
    {
      perTonAndKm: 0,
      perKm: 4.14 * eurosPerPound,
      perkWh: 0,
      fixed: duration * omrcPerMinute,
      label: `Operations, Maintenance and RenewalCharge (OMRC), ${omrcPerMinute} par minute`,
      category: RuleCategory.Tracks,
    },
    Rule.perkWh(0.11 * eurosPerPound, 'Traction rates'),
    Rule.perkWh(0.15 * eurosPerPound, 'Non tractio rates'),
  ];
}

export default function rules({ edge, train, day }): Rule[] {
  if (edge.line.label === 'HS1') {
    return highSpeed1(edge);
  }
  if (edge.line.label === 'Channel Fixed Link') {
    return channel({ edge, train, day });
  }

  return [];
}

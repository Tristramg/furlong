import _ from 'lodash';
import Edge from './edge';
import { Day } from './types.d';

const edgeId = (from: string, to: string): string =>
  from < to ? `${from}-${to}` : `${to}-${from}`;

function gen(list, infra): Edge[] {
  return _.zipWith(_.dropRight(list), _.drop(list), (start, end) => {
    const edge = edgeId(start[0], end[0]);
    const infraEdge = infra.edges[edge];

    const departure = infra.nodes[start[0]];
    const arrival = infra.nodes[end[0]];

    return {
      label: infraEdge.label,
      distance: infraEdge.distance,
      country: infraEdge.country,
      line: infraEdge.line,
      departure: {
        label: departure.Name,
        time: start[1],
        commercial: start[2],
        station: departure['Price station'],
        track: departure['Price track (FR)'],
        adifClass: departure['ADIF Class (ES)'],
      },
      arrival: {
        label: arrival.Name,
        time: end[1],
        commercial: end[2],
        station: arrival['Price station'],
        track: arrival['Price track (FR)'],
        adifClass: arrival['ADIF Class (ES)'],
      },
    };
  });
}

const fmt = (val: number): string =>
  val === 0.0 ? '—' : String(Number(val.toPrecision(3)));
const grey = (val: number): string => (val === 0.0 ? 'text-gray-500' : '');

const h = (hours: number, minutes: number): number => {
  if (hours < 12) {
    return (24 + hours) * 60 + minutes;
  }
  return hours * 60 + minutes;
};

const fh = (time: number): string => {
  const hours = String(Math.floor(time / 60) % 24).padStart(2, '0');
  const min = String(time % 60).padStart(2, '0');
  return `${hours}:${min}`;
};

function inPeriod(time: number, start: number, end: number): boolean {
  return (
    time % (24 * 60) > start % (24 * 60) && time % (24 * 60) < end % (24 * 60)
  );
}

function included(edge: Edge, start: number, end: number): boolean {
  return (
    inPeriod(edge.arrival.time, start, end) ||
    inPeriod(edge.departure.time, start, end)
  );
}

function nextDay(edge: Edge, day: Day): Day {
  const nextDays = {
    [Day.Monday]: Day.Tuesday,
    [Day.Tuesday]: Day.Wednesday,
    [Day.Wednesday]: Day.Thursday,
    [Day.Thursday]: Day.Friday,
    [Day.Friday]: Day.Saturday,
    [Day.Saturday]: Day.Sunday,
    [Day.Sunday]: Day.Monday,
  };

  if (edge.arrival.time > 24 * 60) {
    return nextDays[day];
  }

  return day;
}

function weekEnd(edge: Edge, departureDay: Day): boolean {
  const consideredDay = nextDay(edge, departureDay);
  return _.includes([Day.Saturday, Day.Sunday], consideredDay);
}

export { fmt, grey, h, fh, edgeId, gen, included, weekEnd };

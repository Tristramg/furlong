import _ from 'lodash';
import { Infra } from '../data/airtable_importer';
import { Day } from './types.d';
import VehicleJourney from './vehicle_journey';
import Line from './line';
import { smartFmt } from './helpers';
import Lines from '../data/lines';
import Trains from '../data/trains';

const mondays = (off: number) => 4 * 52 + 1 - Math.floor((365 * off) / 100);
const circulations = (off: number) => mondays(off) + 3 * 52;

function generateVJ(lineId: string, year: string, infra: Infra, data: any) {
  const { trainId, pax } = data[lineId][year];
  const line = Lines[lineId];
  const train = Trains[trainId];

  const aller = _([Day.Monday, Day.Friday, Day.Saturday, Day.Sunday])
    .map((day) => [day, new VehicleJourney(line, day, true, infra, train, pax)])
    .fromPairs()
    .value();

  const retour = _([Day.Monday, Day.Friday, Day.Saturday, Day.Sunday])
    .map((day) => [
      day,
      new VehicleJourney(line, day, false, infra, train, pax),
    ])
    .fromPairs()
    .value();

  return { aller, retour };
}

function computeCosts(
  lineId: string,
  year: string,
  infra: Infra,
  off: number,
  yearIndex: number,
  data: any
) {
  const { aller, retour } = generateVJ(lineId, year, infra, data);

  const mondayPrices =
    (aller[Day.Monday].price + retour[Day.Monday].price) * mondays(off);

  const otherPrice =
    _([Day.Friday, Day.Saturday, Day.Sunday])
      .map((day) => aller[day].price + retour[day].price)
      .sum() * 52;

  const mondayReduction =
    (aller[Day.Monday].startReduction(yearIndex) +
      retour[Day.Monday].startReduction(yearIndex)) *
    mondays(off);

  const otherReduction =
    _([Day.Friday, Day.Saturday, Day.Sunday])
      .map(
        (day) =>
          aller[day].startReduction(yearIndex) +
          retour[day].startReduction(yearIndex)
      )
      .sum() * 52;

  return {
    cost: mondayPrices + otherPrice,
    reduction: mondayReduction + otherReduction,
  };
}

class YearData {
  pax: number;

  line: Line;

  trainLabel: string;

  cost: number;

  travellers: number;

  maintenance: number;

  heavyMaintenance: number;

  renting: number;

  circulations: number;

  startReduction: number;

  revenue: number;

  totalCost: number;

  total: number;

  occupancy: string;

  constructor(lineId, year, infra, off, index, data, vjDistance) {
    const cell = data[lineId][year];
    const train = Trains[cell.trainId];
    const distance = vjDistance * circulations(10);
    const { cost, reduction } = computeCosts(
      lineId,
      year,
      infra,
      10,
      index,
      data
    );

    this.pax = cell.pax;
    this.line = Lines[lineId];
    this.trainLabel = train.label;
    this.cost = cost;
    this.travellers = cell.pax * circulations(10) * 2;
    this.maintenance = train.maintenance(distance) * 2;
    this.heavyMaintenance = train.heavyMaintenance(distance) * 2;
    this.renting = train.renting() * 2;
    this.circulations = circulations(10);
    this.startReduction = reduction;
    this.revenue = this.travellers * 150;
    this.totalCost =
      this.cost + this.maintenance + this.heavyMaintenance + this.renting;
    this.total = this.revenue + this.startReduction - this.totalCost;
    this.occupancy = `${smartFmt((100 * this.pax) / train.capacity(), 2)} %`;
  }
}

export default YearData;

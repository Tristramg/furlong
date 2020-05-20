import * as React from 'react';
import _ from 'lodash';
import { fmt } from '../lib/helpers';
import VehicleJourney from '../lib/vehicle_journey';
import { Day } from '../lib/types.d';

type Props = {
  vjs: { [day: string]: VehicleJourney };
  defaultOff: number;
};

const AnnualCosts: React.FunctionComponent<Props> = ({
  vjs,
  defaultOff,
}: Props) => {
  const [off, setOff] = React.useState(defaultOff);
  const selected = {
    [Day.Monday]: Math.floor(4 * 52 + 1 - (365 * off) / 100),
    [Day.Friday]: 52,
    [Day.Saturday]: 52,
    [Day.Sunday]: 52,
  };

  const sum = _(selected)
    .map(
      (count, day) =>
        (vjs[`${day} (aller)`].price + vjs[`${day} (retour)`].price) * count
    )
    .sum();

  return (
    <div>
      <table>
        <tr>
          <td>Couts infrastructure (voies, gare, électricité)</td>
          <td className="text-right">{`${fmt(sum / 1000)} k€`}</td>
        </tr>
        <tr>
          <td>Indisponibilité</td>
          <td className="text-right">
            <label htmlFor="off">
              <input
                className="w-10 text-right"
                type="number"
                id="off"
                min="0"
                max="100"
                onChange={(x) => setOff(x.target.valueAsNumber)}
                value={off}
              />
              %
            </label>
          </td>
        </tr>
        <tr>
          <td>Nombre total d’aller-retours</td>
          <td className="text-right">{_(selected).values().sum()}</td>
        </tr>
        <tr>
          <td className="text-xs py-1 text-right">Aller-retours en semaine</td>
          <td className="text-xs py-1 text-right">{selected[Day.Monday]}</td>
        </tr>
        <tr>
          <td className="text-xs py-1 text-right">Aller-retours un vendredi</td>
          <td className="text-xs py-1 text-right">{selected[Day.Friday]}</td>
        </tr>
        <tr>
          <td className="text-xs py-1 text-right">Aller-retours un samedi</td>
          <td className="text-xs py-1 text-right">{selected[Day.Saturday]}</td>
        </tr>
        <tr>
          <td className="text-xs py-1 text-right">Aller-retours un dimanche</td>
          <td className="text-xs py-1 text-right">{selected[Day.Sunday]}</td>
        </tr>
      </table>
    </div>
  );
};

export default AnnualCosts;

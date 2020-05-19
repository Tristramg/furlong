interface Train {
  label: string;
  highSpeed: boolean;
  gaugeChange: boolean;
  weight: number;
  cars: number;
  multipleUnit: boolean;
  capacity: number;
}

interface RailLine {
  class: string;
  highSpeed: boolean;
  label: string;
  gauge: string;
  signaling: string;
  current: string;
}

function ccCurent(line: RailLine): boolean {
  return /DC/.test(line.current);
}

export type { Train, RailLine };
export { ccCurent };

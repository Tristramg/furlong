interface Train {
  label: string;
  highSpeed: boolean;
  gaugeChange: boolean;
  weight: number;
  cars: number;
  multipleUnit: boolean;
  capacity: number;
}

interface Line {
  class: string;
  highSpeed: boolean;
  label: string;
  gauge: string;
  signaling: string;
  current: string;
}

function ccCurent(line: Line): boolean {
  return /DC/.test(line.current);
}

interface StopTime {
  label: string;
  time: number;
  commercial: boolean;
  station: number;
  track: number;
  adifClass: number;
}

export type { Train, Line, StopTime };
export { ccCurent };

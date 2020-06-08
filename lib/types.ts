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

export type { RailLine };
export { ccCurent };

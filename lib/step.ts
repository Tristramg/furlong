import StopTime from './stop_time';

export default class Step {
  station: string;

  forwardTime: number;

  returnTime: number;

  commercialStop: boolean;

  constructor(s: string, f: number, r: number, c: boolean) {
    this.station = s;
    this.forwardTime = f;
    this.returnTime = r;
    this.commercialStop = c;
  }

  stopTime(rawNode: any, forward: boolean) {
    return new StopTime(
      rawNode,
      forward ? this.forwardTime : this.returnTime,
      this.commercialStop
    );
  }
}

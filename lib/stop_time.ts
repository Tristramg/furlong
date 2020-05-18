class StopTime {
  label: string;

  time: number;

  commercial: boolean;

  station: number;

  track: number;

  adifClass: number;

  constructor(rawNode: any, time: number, commercial: boolean) {
    this.label = rawNode.Name;
    this.time = time;
    this.commercial = commercial;
    this.station = rawNode['Price station'];
    this.track = rawNode['Price track (FR)'];
    this.adifClass = rawNode['ADIF Class (ES)'];
  }
}

export default StopTime;

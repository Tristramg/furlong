export type Unit = {
  id: string;
  name: string;
  pax: number;
};

export type Car = {
  id: string;
  name: string;
  weight: number;
  units: {
    id: string;
    count: number;
    price: number;
  }[];
};

export type Train = {
  id: string;
  name: string;
  cars: {
    id: string;
    count: number;
  }[];
};

export type Station = {
  name: string;
  node: number;
};

export type Segment = {
  country: string;
  duration: number;
  distance: number;
  geojson: GeoJSON.LineString;
};

export type Line = {
  stations: Station[];
  segments: Segment[];
};

export type State = {
  units: Unit[];
  cars: Car[];
  trains: Train[];
  line: Line;
};

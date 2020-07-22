export type Unit = {
  id: string;
  name: string;
  pax: number;
};

export type Car = {
  id: string;
  name: string;
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

export type State = {
  units: Unit[];
  cars: Car[];
  trains: Train[];
};

export interface BestRouteData {
  duration: number;
  arrival: string;
  legs: Array<{
    mode: string;
    instruction: string;
    departure: string;
    arrival: string;
    line: string;
  }>;
  fare?: number;
}

export interface Place {
  placeName: string;
  naptanOrAtco: string;
}

export type RouteLeg = {
  mode: string;
  instruction: string;
  departure: string;
  arrival: string;
  line: string;
};
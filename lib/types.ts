export type Era = "ilk-cag" | "orta-cag" | "yeni-cag" | "modern";

export type GeoPoint = {
  lat: number;
  lng: number;
};

export type StateEntity = {
  id: string;
  name: string;
  founded: number;
  dissolved?: number;
  founder: string;
  capital: string;
  color: string;
  region: string;
  religion: string;
  economy: string;
  army: string;
  culture: string;
  summary: string;
  rulers: string[];
  coordinates: GeoPoint[];
  center: GeoPoint;
  events: string[];
};

export type War = {
  id: string;
  name: string;
  year: number;
  sides: string[];
  commanders: string[];
  result: string;
  location: GeoPoint;
  route: GeoPoint[];
  summary: string;
};

export type Migration = {
  id: string;
  name: string;
  startYear: number;
  endYear: number;
  origin: string;
  destination: string;
  route: GeoPoint[];
  result: string;
};

export type Treaty = {
  id: string;
  name: string;
  year: number;
  parties: string[];
  result: string;
  effects: string[];
};

export type Person = {
  id: string;
  name: string;
  years: string;
  period: string;
  role: string;
  achievements: string[];
  wars: string[];
  summary: string;
};

export type City = {
  id: string;
  name: string;
  oldNames: string[];
  states: string[];
  events: string[];
  location: GeoPoint;
  summary: string;
};

export type Concept = {
  id: string;
  name: string;
  category: "devlet" | "askerlik" | "kultur" | "toplum";
  summary: string;
  details: string;
};

export type TimelineEvent = {
  id: string;
  year: number;
  title: string;
  era: Era;
  type: "state" | "war" | "migration" | "treaty" | "culture";
  summary: string;
  relatedIds: string[];
};

export type TradeRoute = {
  id: string;
  name: string;
  route: GeoPoint[];
  summary: string;
};

export type CultureItem = {
  id: string;
  title: string;
  category: "sanat" | "mimari" | "muzik" | "yemek" | "silah" | "kiyafet";
  period: string;
  summary: string;
};

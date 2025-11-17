import type { Dispatch, SetStateAction } from "react";

export type SetState<T> = Dispatch<SetStateAction<T>>;

export type Section = GeoJSON.Feature<GeoJSON.Polygon, SectionProperties>;

export type Sections = GeoJSON.FeatureCollection<
  GeoJSON.Polygon,
  SectionProperties
>;

export type SectionProperties = {
  section: string;
  capacity?: number;
  price?: string;
  tier?: string;
  seatsSold?: number;
  revenue?: number;
  salesPercentage?: number;
};

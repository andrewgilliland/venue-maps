import type { Dispatch, SetStateAction } from "react";

export type SetState<T> = Dispatch<SetStateAction<T>>;

export type SectionFeature = GeoJSON.Feature<
  GeoJSON.Polygon,
  SectionProperties
>;

export type SectionsFeatureColletion = GeoJSON.FeatureCollection<
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

export type SalesStatus =
  | "🔥 Hot Seller!"
  | "✅ Good Sales"
  | "⚠️ Average Sales"
  | "❄️ Slow Sales";

import { useState } from "react";
import VenueMap from "./components/VenueMap";
import type { SectionsFeatureColletion } from "./types";
import data from "../data/old-trafford-sections.json";

export const apiEndpoint = `${
  import.meta.env.VITE_API_URL
}/sections/notre-dame`;

function App() {
  const [sectionsFeatureCollection, setSectionsFeatureCollection] =
    useState<SectionsFeatureColletion>(data as SectionsFeatureColletion);

  return (
    <div className="min-h-screen bg-neutral-950 p-4">
      <VenueMap
        imageUrl="/old-trafford-2.webp"
        sectionsFeatureCollection={sectionsFeatureCollection}
        setSectionsFeatureCollection={setSectionsFeatureCollection}
      />
    </div>
  );
}

export default App;

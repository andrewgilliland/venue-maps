import { useEffect, useState } from "react";
import VenueMap from "./components/VenueMap";
import type { SectionsFeatureColletion } from "./types";

export const apiEndpoint = `${
  import.meta.env.VITE_API_URL
}/sections/notre-dame`;

function App() {
  const [sectionsFeatureCollection, setSectionsFeatureCollection] =
    useState<SectionsFeatureColletion>({
      type: "FeatureCollection",
      features: [],
    });

  useEffect(() => {
    const fetchSeatingData = async () => {
      try {
        const response = await fetch(apiEndpoint);
        const data = await response.json();
        setSectionsFeatureCollection(data);
      } catch (error) {
        console.error("Error fetching seating data:", error);
      }
    };

    fetchSeatingData();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 p-4">
      <VenueMap
        sectionsFeatureCollection={sectionsFeatureCollection}
        setSectionsFeatureCollection={setSectionsFeatureCollection}
      />
    </div>
  );
}

export default App;

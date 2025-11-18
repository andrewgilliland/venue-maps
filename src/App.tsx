import { useEffect, useState } from "react";
import VenueMap from "./components/VenueMap";
import type { SectionsFeatureColletion } from "./types";

export const apiEndpoint = `${import.meta.env.VITE_API_URL}/sections`;

function App() {
  const [sections, setSections] = useState<SectionsFeatureColletion>({
    type: "FeatureCollection",
    features: [],
  });

  useEffect(() => {
    const fetchSeatingData = async () => {
      try {
        const response = await fetch(apiEndpoint);
        const data = await response.json();
        console.log("data: ", data);
        setSections(data);
      } catch (error) {
        console.error("Error fetching seating data:", error);
      }
    };

    fetchSeatingData();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 p-4">
      <VenueMap sections={sections} setSections={setSections} />
    </div>
  );
}

export default App;

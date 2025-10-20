import { useEffect, useState } from "react";
import VenueMap from "./components/CustomImageMap";

function App() {
  const apiEndpoint = "http://localhost:8787/sections";

  const [sections, setSections] = useState<GeoJSON.FeatureCollection>({
    type: "FeatureCollection",
    features: [],
  });

  useEffect(() => {
    const fetchSeatingData = async () => {
      try {
        const response = await fetch(apiEndpoint);
        const data = await response.json();
        setSections(data);
      } catch (error) {
        console.error("Error fetching seating data:", error);
      }
    };

    fetchSeatingData();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 p-4">
      <VenueMap sections={sections} />
    </div>
  );
}

export default App;

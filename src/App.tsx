import { useEffect, useState } from "react";
import VenueMap from "./components/VenueMap";

export const apiEndpoint = `${import.meta.env.VITE_API_URL}/sections`;

export type Section = GeoJSON.Feature<GeoJSON.Polygon, SectionProperties>;

export type Sections = GeoJSON.FeatureCollection<
  GeoJSON.Polygon,
  SectionProperties
>;

export type SectionProperties = {
  section: string;
  capacity: number;
  price: string;
  tier: string;
  seatsSold: number;
  revenue: number;
  salesPercentage: number;
};

function App() {
  const [sections, setSections] = useState<Sections>({
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
      <VenueMap sections={sections} setSections={setSections} />
    </div>
  );
}

export default App;

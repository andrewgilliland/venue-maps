import { useEffect, useState } from "react";
import SectionCard, { type SectionProperties } from "./SectionCard";

type SectionsViewerProps = {
  sections: GeoJSON.FeatureCollection;
  setSections: React.Dispatch<React.SetStateAction<GeoJSON.FeatureCollection>>;
};

export default function SectionsViewer({
  sections,
  setSections,
}: SectionsViewerProps) {
  const { type, features } = sections;

  const [sectionName, setSectionName] = useState<string>("New Section");
  const [coordinates, setCoordinates] = useState<[number, number][]>([
    [0.5, 0.5],
    [0.5, 0.75],
    [0.75, 0.75],
    [0.75, 0.5],
    [0.5, 0.5],
  ]);

  useEffect(() => {
    // Log the sections data whenever it changes
    console.log("GeoJSON Sections Data:", sections);
  }, [sections]);

  const addNewSection = (newSection: GeoJSON.Feature) => {
    setSections((prevSections) => {
      console.log("Previous Features:", prevSections.features);

      const updatedFeatures = [...prevSections.features, newSection];

      return { ...prevSections, features: updatedFeatures };
    });
  };

  const newSection: GeoJSON.Feature = {
    type: "Feature",
    properties: {
      section: sectionName,
      capacity: 50,
      price: "$60",
      tier: "Upper Level",
      seatsSold: 20,
      revenue: 1200,
      salesPercentage: 40,
    },
    geometry: {
      type: "Polygon",
      coordinates: [coordinates],
    },
  };

  const returnGeoJSON = ({
    type,
    sections,
  }: {
    type: "FeatureCollection";
    sections: GeoJSON.FeatureCollection;
  }): GeoJSON.FeatureCollection => {
    const geoJSON: GeoJSON.FeatureCollection = {
      type,
      features: sections.features,
    };
    console.log("Returning GeoJSON:", geoJSON);
    return geoJSON;
  };

  return (
    <div className="w-[300px] p-4 bg-gray-900 rounded-lg border border-gray-700 h-[660px] overflow-y-auto">
      <h3 className="font-bold text-lg mb-4 text-white">Section Viewer</h3>

      <div className="border border-gray-400 rounded mb-2">
        <label className="block text-sm font-medium text-gray-200 mb-1">
          Section Name
        </label>
        <input
          type="text"
          value={sectionName}
          onChange={(e) => setSectionName(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
          placeholder="Enter section name"
        />

        <label className="block text-sm font-medium text-gray-200 mb-1">
          Coordinates
        </label>
        <div className="grid gap-2 mb-8">
          {coordinates.map(([x, y], index) => (
            <div key={index} className="flex gap-2 first:mt-4">
              <input
                type="number"
                value={x}
                onChange={(e) => {
                  const newX = Number(e.target.value);
                  setCoordinates((prev) => {
                    const updated = [...prev];
                    updated[index] = [newX, updated[index][1]];
                    return updated;
                  });
                }}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                step="0.001"
              />
              <input
                type="number"
                value={y}
                onChange={(e) => {
                  const newY = Number(e.target.value);
                  setCoordinates((prev) => {
                    const updated = [...prev];
                    updated[index] = [updated[index][0], newY];
                    return updated;
                  });
                }}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                step="0.001"
              />
            </div>
          ))}
        </div>

        <button
          className="text-white border border-green-500 px-3 py-2 rounded mb-4 bg-green-600 hover:bg-green-700 transition-colors duration-200"
          onClick={() => addNewSection({ ...newSection })}
        >
          Add New Section
        </button>
        <button
          className="text-white border border-green-500 px-3 py-2 rounded mb-4 bg-green-600 hover:bg-green-700 transition-colors duration-200"
          onClick={() => {
            // hit post endpoint with the geojson data
            fetch(`http://localhost:8787/sections`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(
                returnGeoJSON({ type: "FeatureCollection", sections })
              ),
            })
              .then((response) => response.json())
              .then((data) => {
                console.log("GeoJSON data sent successfully:", data);
              })
              .catch((error) => {
                console.error("Error sending GeoJSON data:", error);
              });
          }}
        >
          Export GeoJSON
        </button>
      </div>

      <div className="border border-gray-50">
        <p className="text-gray-400">Type: {type}</p>
        <div className="mb-4">
          {features.length === 0 ? (
            <p className="text-gray-400">No GeoJSON data available.</p>
          ) : (
            <>
              {features.map((feature, index) => (
                <SectionCard
                  key={index}
                  feature={
                    feature as GeoJSON.Feature<
                      GeoJSON.Geometry,
                      SectionProperties
                    >
                  }
                />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

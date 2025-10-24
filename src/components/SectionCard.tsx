import { useState } from "react";

export type SectionProperties = {
  section: string;
  capacity: number;
  price: string;
  tier: string;
  seatsSold: number;
  revenue: number;
  salesPercentage: number;
};

type SectionCardProps = {
  feature: GeoJSON.Feature<GeoJSON.Geometry, SectionProperties>;
  setSections: React.Dispatch<React.SetStateAction<GeoJSON.FeatureCollection>>;
};

export default function SectionCard({
  feature,
  setSections,
}: SectionCardProps) {
  const { properties, geometry } = feature;
  const [isOpen, setIsOpen] = useState(false);

  const deleteSection = (sectionToDelete: GeoJSON.Feature) => {
    setSections((prevSections) => {
      const updatedFeatures = prevSections.features.filter(
        (feature) =>
          feature.properties &&
          sectionToDelete.properties &&
          feature.properties.section !== sectionToDelete.properties.section
      );

      return { ...prevSections, features: updatedFeatures };
    });
  };

  return (
    <div className="mb-4 border border-gray-700 rounded-lg p-4 bg-gray-900">
      <h4 className="font-semibold text-md text-white mb-2">
        Section: {properties.section}
      </h4>
      <div className="flex flex-col border border-gray-700 rounded p-2 bg-gray-800">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-gray-200">
            Coordinates
          </label>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-sm text-blue-400 border border-blue-400 px-2 py-1 rounded shadow-md shadow-blue-900 hover:bg-blue-500 hover:text-white transition-colors duration-200"
          >
            {isOpen ? "Hide" : "Show"}
          </button>
        </div>
        <div
          className={`grid ${
            isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          } gap-2 overflow-hidden transition-all duration-300 ease-in-out`}
        >
          {geometry.type === "Polygon" &&
            geometry.coordinates.map((coord, index) => (
              <div key={index} className="flex flex-col gap-2 overflow-hidden">
                {coord.map(([x, y], coordIndex) => (
                  <div key={coordIndex} className="flex gap-2 first:mt-4">
                    <input
                      disabled
                      type="number"
                      value={x}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      step="0.001"
                    />
                    <input
                      disabled
                      type="number"
                      value={y}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      step="0.001"
                    />
                  </div>
                ))}
              </div>
            ))}
        </div>
      </div>

      <button
        className="mt-4 w-full px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
        onClick={() => {
          deleteSection(feature);
        }}
      >
        Delete Section
      </button>
    </div>
  );
}

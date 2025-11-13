import { useState } from "react";
import type { Section, Sections } from "../types";

type SectionCardProps = {
  feature: Section;
  setSections: React.Dispatch<React.SetStateAction<Sections>>;
  onHover: (sectionName: string) => void;
  onLeave: () => void;
};

export default function SectionCard({
  feature,
  setSections,
  onHover,
  onLeave,
}: SectionCardProps) {
  const {
    properties: { section },
    geometry: { coordinates },
  } = feature;
  const [isOpen, setIsOpen] = useState(false);

  const updateCoordinate = (
    coordinateValue: number,
    section: string,
    coordIndex: number
  ) => {
    // console.log("coordinateValue:", coordinateValue);
    // console.log("section:", section);
    // console.log("coordIndex:", coordIndex);

    setSections((prevSections) => {
      const updatedFeatures = prevSections.features.map((feature) => {
        if (feature.properties && feature.properties.section === section) {
          const newCoordinates = feature.geometry.coordinates.map(
            (polygon, polygonIndex) => {
              if (polygonIndex === 0) {
                return polygon.map((coord, index) => {
                  if (index === coordIndex) {
                    return [
                      coordIndex === 0 ? coordinateValue : coord[0],
                      coordIndex === 1 ? coordinateValue : coord[1],
                    ];
                  }
                  return coord;
                });
              }
              return polygon;
            }
          );
          return {
            ...feature,
            geometry: {
              ...feature.geometry,
              coordinates: newCoordinates,
            },
          };
        }
        return feature;
      });

      return { ...prevSections, features: updatedFeatures };
    });
  };

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
    <div
      className={`p-3 bg-gray-900 rounded-lg border border-gray-800 transition-all duration-200 cursor-pointer hover:border-blue-400`}
      onMouseEnter={() => section && onHover(section)}
      onMouseLeave={onLeave}
    >
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-md text-white">{section}</h4>
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
        <div className="overflow-hidden">
          <label className="block text-sm font-medium text-gray-200">
            Coordinates
          </label>
          <div>
            {coordinates.map((coord, index) => (
              <div key={index} className="flex flex-col gap-2 overflow-hidden">
                {coord.map(([x, y], coordIndex) => (
                  <div key={coordIndex} className="flex gap-2 first:mt-4">
                    <input
                      type="number"
                      value={x}
                      onChange={(e) =>
                        updateCoordinate(
                          Number(e.target.value),
                          section,
                          coordIndex
                        )
                      }
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      step="0.001"
                    />
                    <input
                      type="number"
                      value={y}
                      onChange={(e) =>
                        updateCoordinate(
                          Number(e.target.value),
                          section,
                          coordIndex + 1
                        )
                      }
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      step="0.001"
                    />
                  </div>
                ))}
              </div>
            ))}
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
      </div>
    </div>
  );
}

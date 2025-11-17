import { useState } from "react";
import type { Section, Sections, SetState } from "../types";

type SectionCardProps = {
  section: Section;
  setSections: SetState<Sections>;
  onHover: (sectionName: string) => void;
  onLeave: () => void;
};

export default function SectionCard({
  section,
  setSections,
  onHover,
  onLeave,
}: SectionCardProps) {
  const {
    properties: { section: sectionName },
    geometry: { coordinates },
  } = section;
  const [isOpen, setIsOpen] = useState(false);

  const updateCoordinate = (
    value: number,
    sectionName: string,
    valueIndex: number,
    coordinateIndex: number,
    setSections: SetState<Sections>
  ) => {
    setSections((prevSections) => {
      const updatedFeatures = prevSections.features.map((feature) => {
        if (feature.properties && feature.properties.section === sectionName) {
          const updatedCoordinates = feature.geometry.coordinates[0].map(
            (coordinate, coordIndex) => {
              if (coordIndex === coordinateIndex) {
                const newCoordinate = [...coordinate];

                newCoordinate[valueIndex] = value;
                return newCoordinate;
              }
              return coordinate;
            }
          );

          return {
            ...feature,
            geometry: {
              ...feature.geometry,
              coordinates: [updatedCoordinates],
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
      onMouseEnter={() => section && onHover(sectionName)}
      onMouseLeave={onLeave}
    >
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-md text-white">{sectionName}</h4>
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
            {coordinates.map((coordinate, index) => (
              <div key={index} className="flex flex-col gap-2 overflow-hidden">
                {coordinate.map((position, coordinateIndex) => (
                  <div key={coordinateIndex} className="flex gap-2 first:mt-4">
                    {position.map((value, valueIndex) => (
                      <input
                        key={valueIndex}
                        type="number"
                        value={value}
                        onChange={(e) =>
                          updateCoordinate(
                            Number(e.target.value),
                            sectionName,
                            valueIndex,
                            coordinateIndex,
                            setSections
                          )
                        }
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        step="0.001"
                      />
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <button
            className="mt-4 w-full px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            onClick={() => {
              deleteSection(section);
            }}
          >
            Delete Section
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { defaultSection } from "./VenueMap";
import type { Section, Sections } from "../App";

type SectionBuilderProps = {
  newSection: Section;
  setNewSection: React.Dispatch<React.SetStateAction<Section>>;
  coordinates: [number, number][];
  setCoordinates: React.Dispatch<React.SetStateAction<[number, number][]>>;
  sections: Sections;
  setSections: React.Dispatch<React.SetStateAction<Sections>>;
};

export default function SectionBuilder({
  newSection,
  setNewSection,
  coordinates,
  setCoordinates,
  sections,
  setSections,
}: SectionBuilderProps) {
  const [sectionName, setSectionName] = useState<string>(
    newSection.properties?.section
  );

  const addSection = (newSection: Section) => {
    setSections((prevSections) => {
      const updatedFeatures = [...prevSections.features, newSection];

      return { ...prevSections, features: updatedFeatures };
    });
  };

  const updateNewSection = (
    updatedNewSection: Section,
    coordinates: [number, number][]
  ) => {
    if (!updatedNewSection.properties) {
      updatedNewSection.properties = {};
    }

    updatedNewSection.properties.section = sectionName;
    updatedNewSection.geometry = {
      type: "Polygon",
      coordinates: [[...coordinates, coordinates[0]]], // Close the polygon
    };

    setNewSection(updatedNewSection);
  };

  const updateNewSectionSectionName = (
    updatedNewSection: Section,
    sectionName: string
  ) => {
    if (!updatedNewSection.properties) {
      updatedNewSection.properties = {};
    }

    updatedNewSection.properties.section = sectionName;

    setNewSection(updatedNewSection);
    setSectionName(sectionName);
  };

  const deleteCoordinate = (index: number) => {
    setCoordinates((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // first make sure section name is unique
    const isUnique = !sections.features.some(
      (feature) => feature.properties?.section === sectionName
    );

    if (!isUnique) {
      alert("Section name must be unique");
      return;
    }

    addSection({ ...newSection });
    setSectionName("");
    setCoordinates([]);
    setNewSection(defaultSection);
  };

  return (
    <section className="w-[300px] p-4 bg-gray-900 rounded-lg border border-gray-700 h-[660px] overflow-y-auto">
      <h3 className="font-bold text-lg mb-4 text-white">Section Builder</h3>
      <div className="text-xs text-gray-400 bg-gray-800 p-2 rounded border">
        <strong>Instructions:</strong>
        <br />
        Click anywhere on the map to capture coordinates. Values will
        automatically appear in the inputs below.
      </div>

      <div className="mt-2">
        <label className="block text-sm font-medium text-gray-200 mb-1">
          Section Name
        </label>
        <input
          type="text"
          value={sectionName}
          onChange={(e) => {
            // setSectionName(e.target.value);
            updateNewSectionSectionName({ ...newSection }, e.target.value);
          }}
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
                  updateNewSection({ ...newSection }, coordinates);
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
                  updateNewSection({ ...newSection }, coordinates);
                }}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                step="0.001"
              />
              <button
                className="text-red-500 hover:text-red-700 font-bold"
                onClick={() => deleteCoordinate(index)}
              >
                &times;
              </button>
            </div>
          ))}
        </div>

        <button
          className="text-white border border-green-500 px-3 py-2 rounded mb-4 bg-green-600 hover:bg-green-700 transition-colors duration-200"
          onClick={handleSubmit}
        >
          Add New Section
        </button>
      </div>
    </section>
  );
}

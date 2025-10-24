import { useEffect, useState } from "react";

type SectionBuilderProps = {
  lng: number;
  lat: number;
  sections: GeoJSON.FeatureCollection;
  setSections: React.Dispatch<React.SetStateAction<GeoJSON.FeatureCollection>>;
};

export default function SectionBuilder({
  lng,
  lat,
  sections,
  setSections,
}: SectionBuilderProps) {
  // const { type, features } = sections;

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

  const addSection = (newSection: GeoJSON.Feature) => {
    setSections((prevSections) => {
      console.log("Previous Features:", prevSections.features);

      const updatedFeatures = [...prevSections.features, newSection];

      return { ...prevSections, features: updatedFeatures };
    });
  };

  const updateSection = (updatedSection: GeoJSON.Feature) => {
    setSections((prevSections) => {
      const updatedFeatures = prevSections.features.map((feature) =>
        feature.properties &&
        updatedSection.properties &&
        feature.properties.section === updatedSection.properties.section
          ? updatedSection
          : feature
      );

      return { ...prevSections, features: updatedFeatures };
    });
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
          Current Coordinates
        </label>

        <div className="flex gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              X
            </label>
            <input
              disabled
              type="number"
              value={lng}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Y
            </label>
            <input
              disabled
              type="number"
              value={lat}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* <div>
        <label className="block text-sm font-medium text-gray-200 mb-1">
          Mapped Coordinates
        </label>
        {coordinates.map(([x, y], index) => (
          <div key={index} className="flex gap-2 mb-2">
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
              placeholder="Click on map to capture"
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
              placeholder="Click on map to capture"
              step="0.001"
            />
          </div>
        ))}
      </div> */}

      <div className="mt-2">
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
                  updateSection({ ...newSection });
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
                  updateSection({ ...newSection });
                }}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                step="0.001"
              />
            </div>
          ))}
        </div>

        <button
          className="text-white border border-green-500 px-3 py-2 rounded mb-4 bg-green-600 hover:bg-green-700 transition-colors duration-200"
          onClick={() => addSection({ ...newSection })}
        >
          Add New Section
        </button>
      </div>
    </section>
  );
}

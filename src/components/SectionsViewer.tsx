import { apiEndpoint, type Sections } from "../App";
import SectionCard from "./SectionCard";

type SectionsViewerProps = {
  sections: Sections;
  setSections: React.Dispatch<React.SetStateAction<Sections>>;
  onSectionCardHover: (sectionId: string) => void;
  onSectionCardLeave: () => void;
};

export default function SectionsViewer({
  sections,
  setSections,
  onSectionCardHover,
  onSectionCardLeave,
}: SectionsViewerProps) {
  const { type, features } = sections;

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

  const handleExport = () => {
    fetch(apiEndpoint, {
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
  };

  return (
    <section className="w-[300px] p-4 bg-gray-900 rounded-lg border border-gray-700 h-[660px] overflow-y-auto">
      <h3 className="font-bold text-lg mb-4 text-white">Sections Viewer</h3>

      <button
        className="text-white border border-green-500 px-3 py-2 rounded mb-4 bg-green-600 hover:bg-green-700 transition-colors duration-200"
        onClick={handleExport}
      >
        Export GeoJSON
      </button>

      <div className="space-y-4 mt-2">
        <div>
          <div className="border-t-2 border-gray-800 pt-4">
            <p className="text-gray-400">Type: {type}</p>
            <p className="text-gray-400">Sections:</p>
            <div className="mt-2 grid gap-3">
              {features.length === 0 ? (
                <p className="text-gray-400">No GeoJSON data available.</p>
              ) : (
                <>
                  {features.map((feature, index) => (
                    <SectionCard
                      key={index}
                      feature={feature}
                      setSections={setSections}
                      onHover={(sectionName) => onSectionCardHover(sectionName)}
                      onLeave={() => onSectionCardLeave()}
                    />
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

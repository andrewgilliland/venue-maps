import SectionCard, { type SectionProperties } from "./SectionCard";

type GeoJSONViewerProps = {
  geoJsonData: GeoJSON.FeatureCollection;
};

export default function GeoJSONViewer({ geoJsonData }: GeoJSONViewerProps) {
  const { type, features } = geoJsonData;

  return (
    <form className="w-[300px] p-4 bg-gray-900 rounded-lg border border-gray-700 h-[660px] overflow-y-auto">
      <h3 className="font-bold text-lg mb-4 text-white">Section Viewer</h3>
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
    </form>
  );
}

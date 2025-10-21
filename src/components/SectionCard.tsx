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
};

export default function SectionCard({ feature }: SectionCardProps) {
  const { properties, geometry } = feature;

  return (
    <div className="mb-4">
      <h4 className="font-semibold text-md text-white mb-2">
        {properties.section}
      </h4>
      <div className="flex flex-col border border-gray-700 rounded p-2 bg-gray-800">
        {geometry.type === "Polygon" &&
          geometry.coordinates.map((coord, index) => (
            <div key={index} className="flex flex-col gap-2 ">
              {coord.map(([x, y], coordIndex) => (
                <div key={coordIndex} className="flex gap-2">
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
  );
}

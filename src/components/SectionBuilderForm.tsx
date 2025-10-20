type SectionBuilderFormProps = {
  lng: number;
  lat: number;
  coordinatesState: [
    coordinates: [number, number][],
    setCoordinates: React.Dispatch<React.SetStateAction<[number, number][]>>
  ];
};

export default function SectionBuilderForm({
  lng,
  lat,
  coordinatesState,
}: SectionBuilderFormProps) {
  const [coordinates, setCoordinates] = coordinatesState;

  return (
    <form className="w-[300px] p-4 bg-gray-900 rounded-lg border border-gray-700 h-[660px] overflow-y-auto">
      <h3 className="font-bold text-lg mb-4 text-white">Section Builder</h3>

      <div className="text-xs text-gray-400 bg-gray-800 p-2 rounded border">
        <strong>Instructions:</strong>
        <br />
        Click anywhere on the map to capture coordinates. Values will
        automatically appear in the inputs below.
      </div>

      <div className="space-y-4 mt-2">
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
              value={lng.toFixed(3)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Click on map to capture"
              step="0.000001"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Y
            </label>
            <input
              disabled
              type="number"
              value={lat.toFixed(3)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Click on map to capture"
              step="0.000001"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">
            Mapped Coordinates
          </label>
          <div>
            {coordinates.map(([x, y], index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  disabled
                  type="number"
                  value={x.toFixed(3)}
                  onChange={() => {
                    setCoordinates;
                  }}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Click on map to capture"
                  step="0.001"
                />
                <input
                  disabled
                  type="number"
                  value={y.toFixed(3)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Click on map to capture"
                  step="0.001"
                />
              </div>
            ))}
          </div>
          <textarea
            className="text-md text-gray-300 bg-gray-800 p-2 rounded border min-h-32 overflow-y-auto w-full"
            value={coordinates
              .map(([x, y]) => `[${x.toFixed(3)}, ${y.toFixed(3)}]`)
              .join(",\n")}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setCoordinates([]);
            }}
            className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
          >
            Clear
          </button>

          <button
            onClick={() => {
              navigator.clipboard.writeText(`[${coordinates}]`);
            }}
            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Copy
          </button>
        </div>
      </div>
    </form>
  );
}

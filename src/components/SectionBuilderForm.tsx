type SectionBuilderFormProps = {
  lngState: [number, React.Dispatch<React.SetStateAction<number>>];
  latState: [number, React.Dispatch<React.SetStateAction<number>>];
  coordinates: [number, number][];
};

export default function SectionBuilderForm({
  lngState,
  latState,
  coordinates,
}: SectionBuilderFormProps) {
  const [lng, setLng] = lngState;
  const [lat, setLat] = latState;

  return (
    <div>
      <div className="w-[300px] h-full p-4 bg-gray-900 rounded-lg border border-gray-700">
        <h3 className="font-bold text-lg mb-4 text-white">Section Builder</h3>

        <div className="space-y-4">
          <div className="flex gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                X
              </label>
              <input
                type="number"
                value={lng.toFixed(6)}
                onChange={(e) => setLng(parseFloat(e.target.value) || 0)}
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
                type="number"
                value={lat.toFixed(6)}
                onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Click on map to capture"
                step="0.000001"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setLng(0);
                setLat(0);
              }}
              className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Clear
            </button>

            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  `[${lng.toFixed(6)}, ${lat.toFixed(6)}]`
                );
              }}
              className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Copy
            </button>
          </div>

          <div className="text-xs text-gray-400 bg-gray-800 p-2 rounded border">
            <strong>Instructions:</strong>
            <br />
            Click anywhere on the map to capture coordinates. Values will
            automatically appear in the inputs above.
          </div>

          <div className="text-sm text-gray-300 bg-gray-800 p-2 rounded border overflow-y-auto">
            {coordinates.length === 0 && (
              <span className="text-gray-500">
                No coordinates captured yet.
              </span>
            )}
            <pre>
              {coordinates.map(([x, y], index) => (
                <div key={index}>
                  [{x.toFixed(6)}, {y.toFixed(6)}],
                </div>
              ))}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

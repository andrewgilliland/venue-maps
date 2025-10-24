import { colors } from "../theme/colors";

const MapLegend = () => {
  return (
    <div className="w-[200px] p-4 bg-gray-900 rounded-lg border border-gray-700">
      <h3 className="font-bold text-lg mb-4 text-white">Sales Heat Map</h3>

      {/* Legend Items */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded"
            style={{ backgroundColor: colors.orange[100] }}
          ></div>
          <span className="text-gray-200">10-25% - Poor Sales</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded"
            style={{ backgroundColor: colors.orange[200] }}
          ></div>
          <span className="text-gray-200">25-50% - Below Average</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded"
            style={{ backgroundColor: colors.orange[300] }}
          ></div>
          <span className="text-gray-200">50-75% - Average</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded"
            style={{ backgroundColor: colors.orange[500] }}
          ></div>
          <span className="text-gray-200">75-90% - Good Sales</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded"
            style={{ backgroundColor: colors.orange[600] }}
          ></div>
          <span className="text-gray-200">90-100% - Excellent</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded"
            style={{ backgroundColor: colors.orange[700] }}
          ></div>
          <span className="text-gray-200">100% - Sold Out</span>
        </div>
      </div>

      {/* Summary Stats */}
      <hr className="my-4 border-gray-600" />
      <div className="text-sm space-y-1">
        <p className="font-semibold text-white">Quick Stats:</p>
        <p className="text-gray-300">Total Capacity: 152 seats</p>
        <p className="text-gray-300">Total Sold: 122 seats</p>
        <p className="text-gray-300">Overall Sales: 80.3%</p>
        <p className="text-gray-300">Total Revenue: $4,265</p>
      </div>

      <hr className="my-4 border-gray-600" />
      <p className="text-xs text-gray-400">
        Click on any section for detailed information
      </p>
    </div>
  );
};

export default MapLegend;

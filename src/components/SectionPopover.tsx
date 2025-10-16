export type SalesStatus =
  | "🔥 Hot Seller!"
  | "✅ Good Sales"
  | "⚠️ Average Sales"
  | "❄️ Slow Sales";

export type SectionProperties = {
  section: number;
  capacity: number;
  price: string;
  tier: string;
  seatsSold: number;
  revenue: number;
  salesPercentage: number;
};

interface SectionPopoverProps {
  properties: SectionProperties;
  seatsAvailable: number;
  salesStatus: SalesStatus;
}

export const SectionPopover: React.FC<SectionPopoverProps> = ({
  properties,
  seatsAvailable,
  salesStatus,
}) => {
  return (
    <div className="p-4 min-w-[240px] bg-white rounded-lg shadow-2xl border border-gray-200">
      <h3 className="font-bold text-lg mb-3 text-gray-900">
        {properties.section}
      </h3>
      <div className="space-y-2 text-sm">
        <p className="text-gray-700">
          <strong>Tier:</strong> {properties.tier}
        </p>
        <p className="text-gray-700">
          <strong>Price:</strong> {properties.price}
        </p>
        <hr className="my-3 border-gray-300" />
        <p className="text-gray-700">
          <strong>Capacity:</strong> {properties.capacity} seats
        </p>
        <p className="text-gray-700">
          <strong>Sold:</strong> {properties.seatsSold} seats
        </p>
        <p className="text-gray-700">
          <strong>Available:</strong> {seatsAvailable} seats
        </p>
        <p className="text-gray-700">
          <strong>Sales:</strong> {properties.salesPercentage}%
        </p>
        <p className="text-gray-700">
          <strong>Revenue:</strong> ${properties.revenue}
        </p>
        <hr className="my-3 border-gray-300" />
        <p className="font-semibold text-gray-900">{salesStatus}</p>
      </div>
    </div>
  );
};

// Helper function to render the component to HTML string for MapLibre popups
export const renderSectionPopoverToString = (
  properties: SectionProperties,
  seatsAvailable: number,
  salesStatus: SalesStatus
): string => {
  // Create a temporary container
  const container = document.createElement("div");

  // Use React's renderToString would be ideal, but since we're in a browser environment,
  // we'll create the HTML manually based on the component structure
  container.innerHTML = `
    <div class="p-4 min-w-[240px] bg-white rounded-lg shadow-2xl border border-gray-200">
      <h3 class="font-bold text-lg mb-3 text-gray-900">${properties.section}</h3>
      <div class="space-y-2 text-sm">
        <p class="text-gray-700"><strong>Tier:</strong> ${properties.tier}</p>
        <p class="text-gray-700"><strong>Price:</strong> ${properties.price}</p>
        <hr class="my-3 border-gray-300">
        <p class="text-gray-700"><strong>Capacity:</strong> ${properties.capacity} seats</p>
        <p class="text-gray-700"><strong>Sold:</strong> ${properties.seatsSold} seats</p>
        <p class="text-gray-700"><strong>Available:</strong> ${seatsAvailable} seats</p>
        <p class="text-gray-700"><strong>Sales:</strong> ${properties.salesPercentage}%</p>
        <p class="text-gray-700"><strong>Revenue:</strong> $${properties.revenue}</p>
        <hr class="my-3 border-gray-300">
        <p class="font-semibold text-gray-900">${salesStatus}</p>
      </div>
    </div>
  `;

  return container.innerHTML;
};

export default SectionPopover;

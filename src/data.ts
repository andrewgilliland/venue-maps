// GeoJSON data for individual seats, concessions, and facilities
export const detailedSeatingData = {
  type: "FeatureCollection" as const,
  features: [
    // Individual seat rows - only visible when very zoomed in
    {
      type: "Feature" as const,
      properties: {
        type: "row",
        section: 101,
        row: "A",
        seats: "1-12",
      },
      geometry: {
        type: "LineString" as const,
        coordinates: [
          [-0.24, -0.75],
          [-0.11, -0.75],
        ],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        type: "row",
        section: 101,
        row: "B",
        seats: "1-12",
      },
      geometry: {
        type: "LineString" as const,
        coordinates: [
          [-0.24, -0.72],
          [-0.11, -0.72],
        ],
      },
    },
    // Concession stands - visible at medium zoom
    {
      type: "Feature" as const,
      properties: {
        type: "concession",
        name: "Hot Dogs & Beverages",
        status: "Open",
      },
      geometry: {
        type: "Point" as const,
        coordinates: [-0.75, 0.3],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        type: "concession",
        name: "Pizza & Snacks",
        status: "Open",
      },
      geometry: {
        type: "Point" as const,
        coordinates: [0.75, 0.3],
      },
    },
    // Facilities - visible at low-medium zoom
    {
      type: "Feature" as const,
      properties: {
        type: "facility",
        name: "Restrooms",
      },
      geometry: {
        type: "Point" as const,
        coordinates: [-0.7, 0.5],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        type: "facility",
        name: "First Aid",
      },
      geometry: {
        type: "Point" as const,
        coordinates: [0.7, 0.5],
      },
    },
  ],
};

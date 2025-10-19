// GeoJSON data for seating sections with sales data
export const seatingData = {
  type: "FeatureCollection" as const,
  features: [
    {
      type: "Feature" as const,
      properties: {
        section: "PS30",
        capacity: 24,
        price: "$45",
        tier: "Field Level",
        seatsSold: 22,
        revenue: 990, // 22 * $45
        salesPercentage: 91.7, // (22/24) * 100
      },
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [-0.27, -0.256], // top-left (origin)
            [-0.27, -0.325], // bottom-left
            [-0.184, -0.325], // bottom-right
            [-0.184, -0.256], // top-right
            [-0.27, -0.256], // close polygon
          ],
        ],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        section: "PS29",
        capacity: 24,
        price: "$45",
        tier: "Field Level",
        seatsSold: 24,
        revenue: 1080, // 24 * $45
        salesPercentage: 100, // (24/24) * 100
      },
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [-0.177, -0.256], // top-left (origin)
            [-0.177, -0.325], // bottom-left
            [-0.09, -0.325], // bottom-right
            [-0.09, -0.256], // top-right
            [-0.177, -0.256], // close polygon
          ],
        ],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        section: "PS28",
        capacity: 24,
        price: "$45",
        tier: "Field Level",
        seatsSold: 18,
        revenue: 810, // 18 * $45
        salesPercentage: 75, // (18/24) * 100
      },
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [-0.08, -0.256], // top-left (origin)
            [-0.08, -0.325], // bottom-left
            [0.04, -0.325], // bottom-right
            [0.04, -0.256], // top-right
            [-0.08, -0.256], // close polygon
          ],
        ],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        section: "PS27",
        capacity: 32,
        price: "$35",
        tier: "Field Level",
        seatsSold: 28,
        revenue: 980, // 28 * $35
        salesPercentage: 87.5, // (28/32) * 100
      },
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [0.046, -0.256], // top-left (origin)
            [0.046, -0.325], // bottom-left
            [0.135, -0.325], // bottom-right
            [0.135, -0.256], // top-right
            [0.046, -0.256], // close polygonom Left corner
          ],
        ],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        section: "PS26",
        capacity: 32,
        price: "$35",
        tier: "Field Level",
        seatsSold: 15,
        revenue: 525, // 15 * $35
        salesPercentage: 46.9, // (15/32) * 100
      },
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [0.14, -0.256], // top-left (origin)
            [0.14, -0.325], // bottom-left
            [0.23, -0.325], // bottom-right
            [0.23, -0.256], // top-right
            [0.14, -0.256], // cl Left corner
          ],
        ],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        section: "25",
        capacity: 40,
        price: "$25",
        tier: "Upper Level",
        seatsSold: 35,
        revenue: 875, // 35 * $25
        salesPercentage: 87.5, // (35/40) * 100
      },
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [0.243, -0.256], // top-left (origin)
            [0.243, -0.325],
            [0.249, -0.325],
            [0.249, -0.334],
            [0.256, -0.334],
            [0.256, -0.356],
            [0.245, -0.356],
            [0.245, -0.362],
            [0.243, -0.362],
            [0.235, -0.362],
            [0.235, -0.51],
            [0.33, -0.51],
            [0.33, -0.325],
            [0.339, -0.325],
            [0.339, -0.256],
            [0.243, -0.256], // top-left corner
          ],
        ],
      },
    },
  ],
};

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

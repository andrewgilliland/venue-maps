import { useEffect, useRef } from "react";
import { Map, Popup, Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default function CustomImageMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);

  // const style = "https://demotiles.maplibre.org/style.json";
  // const globe = "../../data/globe.json";

  // useEffect(() => {
  //   if (map.current || !mapContainer.current) return;

  //   // Coordinates define the corners of your image in "map space"
  //   // (you can think of these as longitude/latitude, but they can be arbitrary if you're not using real-world maps)
  //   // const bounds: [number, number][] = [
  //   //   [0, 0], // bottom-left
  //   //   [1000, 0], // bottom-right
  //   //   [1000, 500], // top-right
  //   //   [0, 500], // top-left
  //   // ];

  //   map.current = new Map({
  //     container: mapContainer.current,
  //     style: globe,
  //     center: [0, 0], // starting position [lng, lat]
  //     zoom: 2, // keeps view within image
  //   });

  //   // Example: add a marker over 2nd base
  //   // map.current.on("load", () => {
  //   //   new Marker({ color: "#e63946" })
  //   //     .setLngLat([-79.5, 34.5])
  //   //     .setPopup(new Popup().setHTML("<b>Second Base</b>"))
  //   //     .addTo(map.current!);
  //   // });

  //   return () => {
  //     console.log(map);
  //     map.current?.remove();
  //     map.current = null; // Reset the ref so map can be recreated
  //   };
  // }, []);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    // 🗺️ 1. Create map with a blank style
    map.current = new Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {},
        layers: [],
      },
      center: [0, 0],
      zoom: 8, // Much higher zoom to see the image better
    });

    map.current.on("load", () => {
      const sourceName = "venue-image";

      // 🖼️ 2. Add your custom image source
      map.current!.addSource(sourceName, {
        type: "image",
        url: "/baseball-field.png", // your custom image file from public folder
        coordinates: [
          [-1, 1], // top-left
          [1, 1], // top-right
          [1, -1], // bottom-right
          [-1, -1], // bottom-left
        ],
      });

      map.current!.on("error", (e) => {
        console.error("Map error:", e);
      });

      map.current!.on("sourcedata", (e) => {
        console.log("Source data event:", e);

        if (e.sourceId === sourceName && e.isSourceLoaded) {
          console.log("Image source loaded successfully");
        }
      });

      // 🧱 3. Add a raster layer to display it
      map.current!.addLayer({
        id: "venue-image-layer",
        type: "raster",
        source: sourceName,
        paint: {
          "raster-fade-duration": 0,
        },
      });

      // 🪑 4. Add seating sections data
      const seatingData = {
        type: "FeatureCollection" as const,
        features: [
          // Home plate sections (behind home plate)
          {
            type: "Feature" as const,
            properties: {
              section: "Section 101",
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
                  [-0.3, -0.8], // bottom-left
                  [-0.1, -0.8], // bottom-right
                  [-0.1, -0.55], // top-right
                  [-0.25, -0.4], // top-left
                  [-0.25, -0.8], // close polygon
                ],
              ],
            },
          },
          {
            type: "Feature" as const,
            properties: {
              section: "Section 102",
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
                  [-0.1, -0.8], // Bottom Left corner
                  [0.1, -0.8], // Bottom Right corner
                  [0.1, -0.675], // Top Right corner
                  [-0.1, -0.675], // Top Left corner
                  [-0.1, -0.8], // Close polygon
                ],
              ],
            },
          },
          {
            type: "Feature" as const,
            properties: {
              section: "Section 103",
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
                  [0.1, -0.8],
                  [0.25, -0.8],
                  [0.25, -0.4],
                  [0.1, -0.55],
                  [0.1, -0.8],
                ],
              ],
            },
          },
          // First base side sections
          {
            type: "Feature" as const,
            properties: {
              section: "Section 201",
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
                  [0.4, -0.4],
                  [0.7, -0.4], // Bottom Right corner
                  [0.7, -0.1], // Top Right corner
                  [0.55, -0.1], // Top Left corner
                  [0.25, -0.4], // Bottom Left corner
                ],
              ],
            },
          },
          // Third base side sections
          {
            type: "Feature" as const,
            properties: {
              section: "Section 301",
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
                  [-0.7, -0.4],
                  [-0.25, -0.4], // Bottom Right corner
                  [-0.55, -0.1], // Top Right corner
                  [-0.7, -0.1], // Top Left corner
                  [-0.7, -0.4], // Bottom Left corner
                ],
              ],
            },
          },
          // Upper deck sections
          {
            type: "Feature" as const,
            properties: {
              section: "Section 401",
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
                  [-0.4, -0.9],
                  [0.4, -0.9],
                  [0.4, -0.85],
                  [-0.4, -0.85],
                  [-0.4, -0.9],
                ],
              ],
            },
          },
        ],
      };

      // 🗂️ 5. Add seating sections source
      map.current!.addSource("seating-sections", {
        type: "geojson",
        data: seatingData,
      });

      // 🎨 6. Add seating sections heat map based on sales percentage
      map.current!.addLayer({
        id: "seating-fill",
        type: "fill",
        source: "seating-sections",
        paint: {
          "fill-color": [
            "interpolate",
            ["linear"],
            ["get", "salesPercentage"],
            // Heat map colors based on sales percentage
            0,
            "#ef4444", // Red - 0% sales (poor)
            25,
            "#f97316", // Orange - 25% sales
            50,
            "#eab308", // Yellow - 50% sales (average)
            75,
            "#22c55e", // Green - 75% sales (good)
            90,
            "#16a34a", // Dark green - 90% sales (excellent)
            100,
            "#15803d", // Darkest green - 100% sold out
          ],
          "fill-opacity": 0.8, // Higher opacity for better heat map visibility
        },
      });

      // 🖼️ 7. Add seating sections outline
      map.current!.addLayer({
        id: "seating-outline",
        type: "line",
        source: "seating-sections",
        paint: {
          "line-color": "#ffffff",
          "line-width": 2,
        },
      });

      // 🏷️ 8. Add section labels
      map.current!.addLayer({
        id: "seating-labels",
        type: "symbol",
        source: "seating-sections",
        layout: {
          "text-field": ["get", "section"],
          "text-font": ["Open Sans Regular"],
          "text-size": 12,
          "text-anchor": "center",
        },
        paint: {
          "text-color": "#ffffff",
          "text-halo-color": "#000000",
          "text-halo-width": 1,
        },
      });

      // 🖱️ 9. Add click interactions with sales data
      map.current!.on("click", "seating-fill", (e) => {
        const properties = e.features![0].properties;
        const seatsAvailable = properties.capacity - properties.seatsSold;
        const salesStatus =
          properties.salesPercentage >= 90
            ? "🔥 Hot Seller!"
            : properties.salesPercentage >= 75
            ? "✅ Good Sales"
            : properties.salesPercentage >= 50
            ? "⚠️ Average Sales"
            : "❄️ Slow Sales";

        new Popup()
          .setLngLat(e.lngLat)
          .setHTML(
            `
            <div class="p-3 min-w-[200px]">
              <h3 class="font-bold text-lg mb-2">${properties.section}</h3>
              <div class="space-y-1 text-sm">
                <p><strong>Tier:</strong> ${properties.tier}</p>
                <p><strong>Price:</strong> ${properties.price}</p>
                <hr class="my-2">
                <p><strong>Capacity:</strong> ${properties.capacity} seats</p>
                <p><strong>Sold:</strong> ${properties.seatsSold} seats</p>
                <p><strong>Available:</strong> ${seatsAvailable} seats</p>
                <p><strong>Sales:</strong> ${properties.salesPercentage}%</p>
                <p><strong>Revenue:</strong> $${properties.revenue}</p>
                <hr class="my-2">
                <p class="font-semibold">${salesStatus}</p>
              </div>
            </div>
          `
          )
          .addTo(map.current!);
      });

      // Change cursor on hover
      map.current!.on("mouseenter", "seating-fill", () => {
        map.current!.getCanvas().style.cursor = "pointer";
      });

      map.current!.on("mouseleave", "seating-fill", () => {
        map.current!.getCanvas().style.cursor = "";
      });

      // 📍 10. Add a marker on top
      new Marker({ color: "#e63946" })
        .setLngLat([0, 0])
        .setPopup(new Popup().setText("Center of the field"))
        .addTo(map.current!);
    });
  }, []);

  return (
    <div className="flex gap-4">
      {/* Map Container */}
      <div
        ref={mapContainer}
        className="w-[650px] h-[650px] rounded-lg border border-gray-300"
      />

      {/* Heat Map Legend */}
      <div className="w-[200px] p-4 bg-gray-50 rounded-lg border border-gray-300">
        <h3 className="font-bold text-lg mb-4">Sales Heat Map</h3>

        {/* Legend Items */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>0-25% - Poor Sales</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span>25-50% - Below Average</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span>50-75% - Average</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>75-90% - Good Sales</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-600 rounded"></div>
            <span>90%+ - Excellent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-800 rounded"></div>
            <span>100% - Sold Out</span>
          </div>
        </div>

        {/* Summary Stats */}
        <hr className="my-4" />
        <div className="text-sm space-y-1">
          <p className="font-semibold">Quick Stats:</p>
          <p>Total Capacity: 152 seats</p>
          <p>Total Sold: 122 seats</p>
          <p>Overall Sales: 80.3%</p>
          <p>Total Revenue: $4,265</p>
        </div>

        <hr className="my-4" />
        <p className="text-xs text-gray-600">
          Click on any section for detailed information
        </p>
      </div>
    </div>
  );
}

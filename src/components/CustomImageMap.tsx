import { useEffect, useRef } from "react";
import { Map, Popup, Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./CustomImageMap.css";
import { renderSectionPopoverToString } from "./SectionPopover";
import type { SectionProperties } from "./SectionPopover";

export default function CustomImageMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);
  const hoverPopup = useRef<Popup | null>(null);

  // Define source names as constants
  const imageSourceName = "venue-image";
  const seatingLayerName = "seating-sections";
  const detailLayerName = "detailed-features";

  // GeoJSON data for seating sections with sales data
  const seatingData = {
    type: "FeatureCollection" as const,
    features: [
      // Home plate sections (behind home plate)
      {
        type: "Feature" as const,
        properties: {
          section: 101,
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
          section: 102,
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
          section: 103,
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
          section: 201,
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
          section: 301,
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
          section: 401,
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

  // GeoJSON data for individual seats, concessions, and facilities
  const detailedSeatingData = {
    type: "FeatureCollection" as const,
    features: [
      // Individual seat rows - only visible when very zoomed in
      {
        type: "Feature" as const,
        properties: {
          type: "seat-row",
          section: 101,
          row: "A",
          seats: "1-12",
        },
        geometry: {
          type: "LineString" as const,
          coordinates: [
            [-0.29, -0.75],
            [-0.11, -0.75],
          ],
        },
      },
      {
        type: "Feature" as const,
        properties: {
          type: "seat-row",
          section: 101,
          row: "B",
          seats: "1-12",
        },
        geometry: {
          type: "LineString" as const,
          coordinates: [
            [-0.29, -0.72],
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
          coordinates: [-0.5, 0.3],
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
          coordinates: [0.5, 0.3],
        },
      },
      // Facilities - visible at low-medium zoom
      {
        type: "Feature" as const,
        properties: {
          type: "facility",
          name: "Restrooms",
          icon: "�",
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
          icon: "🏥",
        },
        geometry: {
          type: "Point" as const,
          coordinates: [0.7, 0.5],
        },
      },
    ],
  };

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    // 🗺️ 1. Create map with a blank style
    map.current = new Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {},
        layers: [],
        glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
      },
      center: [0, 0],
      zoom: 8, // Much higher zoom to see the image better
    });

    map.current.on("load", () => {
      console.log("Map loaded, initial zoom:", map.current!.getZoom());

      // 🖼️ 2. Add your custom image source
      map.current!.addSource(imageSourceName, {
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

      // map.current!.on("sourcedata", (e) => {
      //   console.log("Source data event:", e);

      //   if (e.sourceId === imageSourceName && e.isSourceLoaded) {
      //     console.log("Image source loaded successfully");
      //   }
      // });

      // 🧱 3. Add a raster layer to display it
      map.current!.addLayer({
        id: "venue-image-layer",
        type: "raster",
        source: imageSourceName,
        paint: {
          "raster-fade-duration": 0,
        },
      });

      // 🗂️ 5. Add seating sections source
      map.current!.addSource(seatingLayerName, {
        type: "geojson",
        data: seatingData,
      });

      // 🎨 6. Add seating sections heat map based on sales percentage
      map.current!.addLayer({
        id: "seating-fill",
        type: "fill",
        source: seatingLayerName,
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
        source: seatingLayerName,
        paint: {
          "line-color": "#ffffff",
          "line-width": 2,
        },
      });

      // 🏷️ 8. Add section labels (visible at medium zoom)
      map.current!.addLayer({
        id: "seating-labels",
        type: "symbol",
        source: seatingLayerName,
        minzoom: 8, // Only show labels when zoomed in enough
        maxzoom: 24,
        layout: {
          "text-field": ["get", "section"],
          // Remove font specification - let MapLibre use default
          "text-size": 14, // Increase size to make more visible
          "text-anchor": "center",
          "text-allow-overlap": true, // Prevent labels from hiding due to collisions
          "text-ignore-placement": false,
        },
        paint: {
          "text-color": "#000000",
          "text-halo-color": "#ffffff",
          "text-halo-width": 1, // Increase halo for better visibility
        },
      });

      // Add detailed seating source
      map.current!.addSource(detailLayerName, {
        type: "geojson",
        data: detailedSeatingData,
      });

      // Add zoom change debugging
      map.current!.on("zoom", () => {
        console.log("Current zoom level:", map.current!.getZoom());
      });

      // 🧪 TEST: Add a simple test marker that should always be visible
      map.current!.addSource("test-marker", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [0, 0.5], // Center-top of the image
          },
          properties: {
            name: "TEST MARKER",
          },
        },
      });

      map.current!.addLayer({
        id: "test-marker",
        type: "circle",
        source: "test-marker",
        paint: {
          "circle-radius": 10,
          "circle-color": "red", // Bright red
          "circle-stroke-width": 3,
          "circle-stroke-color": "#ffffff",
        },
      });

      // 🎯 10. Add facility markers (visible at zoom 6-15)
      map.current!.addLayer({
        id: "facilities",
        type: "symbol",
        source: detailLayerName,
        minzoom: 6,
        maxzoom: 15,
        filter: ["==", ["get", "type"], "facility"],
        layout: {
          "text-field": ["concat", ["get", "icon"], " ", ["get", "name"]],
          "text-size": 14,
          "text-anchor": "center",
          "text-offset": [0, 1],
          "text-allow-overlap": true,
        },
        paint: {
          "text-color": "#2563eb",
          "text-halo-color": "#ffffff",
          "text-halo-width": 2,
        },
      });

      // 🍕 11. Add concession stands (visible at zoom 8-16)
      map.current!.addLayer({
        id: "concessions",
        type: "circle",
        source: detailLayerName,
        minzoom: 8,
        maxzoom: 16,
        filter: ["==", ["get", "type"], "concession"],
        paint: {
          "circle-radius": 8,
          "circle-color": "blue",
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
        },
      });

      // 🍕 12. Add concession labels (visible at zoom 10-16)
      map.current!.addLayer({
        id: "concession-labels",
        type: "symbol",
        source: detailLayerName,
        minzoom: 10,
        maxzoom: 16,
        filter: ["==", ["get", "type"], "concession"],
        layout: {
          "text-field": ["get", "name"],
          "text-size": 11,
          "text-anchor": "top",
          "text-offset": [0, 1],
          "text-allow-overlap": true,
        },
        paint: {
          "text-color": "#f59e0b",
          "text-halo-color": "#ffffff",
          "text-halo-width": 1,
        },
      });

      // 💺 13. Add individual seat rows (visible at zoom 8+)
      map.current!.addLayer({
        id: "seat-rows",
        type: "line",
        source: detailLayerName,
        minzoom: 8,
        filter: ["==", ["get", "type"], "seat-row"],
        paint: {
          "line-color": "#6b7280",
          "line-width": 2,
          "line-opacity": 0.8,
        },
      });

      // 💺 14. Add seat row labels (visible at zoom 14+)
      map.current!.addLayer({
        id: "seat-row-labels",
        type: "symbol",
        source: detailLayerName,
        minzoom: 14,
        filter: ["==", ["get", "type"], "seat-row"],
        layout: {
          "text-field": [
            "concat",
            "Row ",
            ["get", "row"],
            " (",
            ["get", "seats"],
            ")",
          ],
          "text-size": 10,
          "symbol-placement": "line",
          "text-allow-overlap": true,
        },
        paint: {
          "text-color": "#374151",
          "text-halo-color": "#ffffff",
          "text-halo-width": 1,
        },
      });

      // �🖱️ 15. Add click interactions with sales data
      map.current!.on("click", "seating-fill", (e) => {
        const properties = e.features![0].properties as SectionProperties;
        const seatsAvailable = properties.capacity - properties.seatsSold;
        const salesStatus =
          properties.salesPercentage >= 90
            ? "🔥 Hot Seller!"
            : properties.salesPercentage >= 75
            ? "✅ Good Sales"
            : properties.salesPercentage >= 50
            ? "⚠️ Average Sales"
            : "❄️ Slow Sales";

        new Popup({
          className: "custom-click-popup",
        })
          .setLngLat(e.lngLat)
          .setHTML(
            renderSectionPopoverToString(
              properties,
              seatsAvailable,
              salesStatus
            )
          )
          .addTo(map.current!);
      });

      // 🖱️ Hover popup functionality
      map.current!.on("mouseenter", "seating-fill", (e) => {
        // Change cursor
        map.current!.getCanvas().style.cursor = "pointer";

        // Get section info
        const properties = e.features![0].properties;

        // Remove existing hover popup if any
        if (hoverPopup.current) {
          hoverPopup.current.remove();
        }

        // Create new hover popup with completely custom styling
        hoverPopup.current = new Popup({
          closeButton: false,
          closeOnClick: false,
          className: "custom-hover-popup",
          offset: [0, -15], // Position slightly above cursor
        })
          .setLngLat(e.lngLat)
          .setHTML(
            `
            <div class="p-3 text-center bg-gray-900 text-white rounded-lg shadow-xl border-0">
              <div class="font-semibold text-sm">${properties.section}</div>
            </div>
          `
          )
          .addTo(map.current!);
      });

      map.current!.on("mouseleave", "seating-fill", () => {
        // Reset cursor
        map.current!.getCanvas().style.cursor = "";

        // Remove hover popup
        if (hoverPopup.current) {
          hoverPopup.current.remove();
          hoverPopup.current = null;
        }
      });

      // 📍 10. Add a marker on top
      new Marker({ color: "#e63946" })
        .setLngLat([0, 0])
        .setPopup(new Popup().setText("Center of the field"))
        .addTo(map.current!);
    });

    // Cleanup function
    return () => {
      if (hoverPopup.current) {
        hoverPopup.current.remove();
        hoverPopup.current = null;
      }
      map.current?.remove();
      map.current = null;
    };
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

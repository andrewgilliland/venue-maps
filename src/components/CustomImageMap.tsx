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
            },
            geometry: {
              type: "Polygon" as const,
              coordinates: [
                [
                  [-0.3, -0.8], // bottom-left
                  [-0.1, -0.8], // bottom-right
                  [-0.1, -0.6], // top-right
                  [-0.3, -0.6], // top-left
                  [-0.3, -0.8], // close polygon
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
            },
            geometry: {
              type: "Polygon" as const,
              coordinates: [
                [
                  [-0.1, -0.8],
                  [0.1, -0.8],
                  [0.1, -0.6],
                  [-0.1, -0.6],
                  [-0.1, -0.8],
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
            },
            geometry: {
              type: "Polygon" as const,
              coordinates: [
                [
                  [0.1, -0.8],
                  [0.3, -0.8],
                  [0.3, -0.6],
                  [0.1, -0.6],
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
            },
            geometry: {
              type: "Polygon" as const,
              coordinates: [
                [
                  [0.4, -0.4],
                  [0.7, -0.4],
                  [0.7, -0.1],
                  [0.4, -0.1],
                  [0.4, -0.4],
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
            },
            geometry: {
              type: "Polygon" as const,
              coordinates: [
                [
                  [-0.7, -0.4],
                  [-0.4, -0.4],
                  [-0.4, -0.1],
                  [-0.7, -0.1],
                  [-0.7, -0.4],
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

      // 🎨 6. Add seating sections fill layer
      map.current!.addLayer({
        id: "seating-fill",
        type: "fill",
        source: "seating-sections",
        paint: {
          "fill-color": [
            "case",
            ["==", ["get", "tier"], "Field Level"],
            "#3b82f6", // blue for field level
            ["==", ["get", "tier"], "Upper Level"],
            "#10b981", // green for upper level
            "#6b7280", // gray fallback
          ],
          "fill-opacity": 0.6,
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

      // 🖱️ 9. Add click interactions
      map.current!.on("click", "seating-fill", (e) => {
        const properties = e.features![0].properties;
        new Popup()
          .setLngLat(e.lngLat)
          .setHTML(
            `
            <div class="p-2">
              <h3 class="font-bold">${properties.section}</h3>
              <p>Capacity: ${properties.capacity} seats</p>
              <p>Price: ${properties.price}</p>
              <p>Tier: ${properties.tier}</p>
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
    <div
      ref={mapContainer}
      className="w-[650px] h-[650px] rounded-lg border border-gray-300"
    />
  );
}

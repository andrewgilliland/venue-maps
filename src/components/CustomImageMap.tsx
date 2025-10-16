import { useEffect, useRef } from "react";
import { Map, Popup, Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default function CustomImageMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);

  const style = "https://demotiles.maplibre.org/style.json";
  const globe = "../../data/globe.json";

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

      // 📍 4. Add a marker on top
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

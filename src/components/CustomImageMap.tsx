import { useEffect, useRef } from "react";
import { Map } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default function CustomImageMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    // Coordinates define the corners of your image in "map space"
    // (you can think of these as longitude/latitude, but they can be arbitrary if you're not using real-world maps)
    // const bounds: [number, number][] = [
    //   [0, 0], // bottom-left
    //   [1000, 0], // bottom-right
    //   [1000, 500], // top-right
    //   [0, 500], // top-left
    // ];

    map.current = new Map({
      container: mapContainer.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [0, 0], // starting position [lng, lat]
      zoom: 2, // keeps view within image
    });

    // Example: add a marker over 2nd base
    // map.current.on("load", () => {
    //   new Marker({ color: "#e63946" })
    //     .setLngLat([-79.5, 34.5])
    //     .setPopup(new Popup().setHTML("<b>Second Base</b>"))
    //     .addTo(map.current!);
    // });

    return () => {
      console.log(map);
      map.current?.remove();
      map.current = null; // Reset the ref so map can be recreated
    };
  }, []);

  return (
    <div
      ref={mapContainer}
      className="w-[650px] h-[650px] rounded-lg border border-gray-300"
    />
  );
}

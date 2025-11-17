import { useCallback } from "react";
import type { Map, GeoJSONSource } from "maplibre-gl";

/**
 * Custom hook for highlighting map sections without causing React re-renders
 * Uses direct MapLibre GL JS API calls for optimal performance
 */
export const useMap = (mapRef: React.RefObject<Map | null>) => {
  const highlightSection = useCallback(
    (sectionId: string) => {
      if (!mapRef.current) return;

      // Set filter to show outline for specific section
      mapRef.current.setFilter("seating-hover-outline", [
        "==",
        ["get", "section"],
        sectionId,
      ]);

      // Optional: Dim other sections for better focus
      //   mapRef.current.setPaintProperty("seating-fill", "fill-opacity", [
      //     "case",
      //     ["==", ["get", "section"], sectionId],
      //     0.9, // Full opacity for highlighted section
      //     0.4, // Reduced opacity for others
      //   ]);
    },
    [mapRef]
  );

  const clearHighlight = useCallback(() => {
    if (!mapRef.current) return;

    // Clear the outline filter
    mapRef.current.setFilter("seating-hover-outline", ["==", "section", ""]);

    // Reset all sections to normal opacity
    mapRef.current.setPaintProperty("seating-fill", "fill-opacity", 0.8);
  }, [mapRef]);

  const setSectionsData = useCallback(
    (sections: any) => {
      if (!mapRef.current) return;

      const source = mapRef.current.getSource("seating-sections");
      if (source && source.type === "geojson") {
        // Cast to GeoJSONSource and use setData
        const geoJsonSource = source as GeoJSONSource;
        geoJsonSource.setData(sections);
      }
    },
    [mapRef]
  );

  return {
    highlightSection,
    clearHighlight,
    setSectionsData,
  };
};

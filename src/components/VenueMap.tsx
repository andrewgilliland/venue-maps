import { useEffect, useRef, useState } from "react";
import { Map, Popup, Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "../styles/CustomImageMap.css";
import { colors } from "../theme/colors";
import SectionsViewer from "./SectionsViewer";
import SectionBuilder from "./SectionBuilder";
import type {
  Section,
  SectionsFeatureColletion,
  Sections,
  SetState,
} from "../types";
import { useMap } from "../hooks/useMap";
// import { renderSectionPopoverToString } from "./SectionPopover";
// import type { Section } from "./SectionPopover";
// import MapLegend from "./MapLegend";

export const defaultSection: Section = {
  type: "Feature",
  properties: {
    section: "",
    capacity: 50,
    price: "$60",
    tier: "Upper Level",
    seatsSold: 20,
    revenue: 1200,
    salesPercentage: 40,
  },
  geometry: {
    type: "Polygon",
    coordinates: [[]],
  },
};

type VenueMapProps = {
  sections: SectionsFeatureColletion;
  setSections: SetState<Sections>;
};

export default function VenueMap({ sections, setSections }: VenueMapProps) {
  const imageUrl = "/notre-dame-stadium.webp"; // Path to your custom image
  // Define source names as constants
  const imageSourceName = "venue-image";
  const seatingLayerName = "seating-sections";
  const newSectionLayerName = "new-section";
  // const detailLayerName = "detailed-features";

  const minZoom = 7;
  const mediumZoom = 8;
  // const highZoom = 9;
  const maxZoom = 12;

  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);
  const hoverPopup = useRef<Popup | null>(null);

  const {
    highlightSection,
    clearHighlight,
    setSectionsData,
    setNewSectionData,
  } = useMap(map);

  const [mapZoom, setMapZoom] = useState(mediumZoom);
  const [mapCenter, setMapCenter] = useState<[number, number]>([0, 0]);
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [coordinates, setCoordinates] = useState<[number, number][]>([]);
  const [newSection, setNewSection] = useState<Section>({
    type: "Feature",
    properties: {
      section: "",
      capacity: 50,
      price: "$60",
      tier: "Upper Level",
      seatsSold: 20,
      revenue: 1200,
      salesPercentage: 40,
    },
    geometry: {
      type: "Polygon",
      coordinates: [coordinates],
    },
  });

  const newGeoJson: SectionsFeatureColletion = {
    type: "FeatureCollection",
    features: [newSection],
  };

  // useMap hook calls
  setSectionsData(sections);
  setNewSectionData(newGeoJson);

  const updateNewSection = (
    updatedNewSection: Section,
    coords: [number, number][]
  ) => {
    if (!updatedNewSection.properties) {
      updatedNewSection.properties = { section: "" };
    }

    setCoordinates((prev) => [...prev, coords[0]]);

    updatedNewSection.geometry = {
      type: "Polygon",
      coordinates: [[...coordinates]],
    };

    setNewSection(updatedNewSection);
  };

  const zoomIn = () => {
    if (map.current) {
      map.current.zoomIn();
    }
  };

  const zoomOut = () => {
    if (map.current) {
      map.current.zoomOut();
    }
  };

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    // Map with a blank style
    map.current = new Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {},
        layers: [],
        glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
      },
      center: mapCenter,
      zoom: mapZoom, // Much higher zoom to see the image better
      minZoom: minZoom,
      maxZoom: maxZoom,
    });

    map.current.on("load", () => {
      // Set cursor to crosshair for entire map
      map.current!.getCanvas().style.cursor = "crosshair";

      // Image source
      map.current!.addSource(imageSourceName, {
        type: "image",
        url: imageUrl, // your custom image file from public folder
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

      // Raster layer to display it
      map.current!.addLayer({
        id: "venue-image-layer",
        type: "raster",
        source: imageSourceName,
        paint: {
          "raster-fade-duration": 0,
        },
      });

      // Seating sections source
      map.current!.addSource(seatingLayerName, {
        type: "geojson",
        data: sections as GeoJSON.FeatureCollection,
      });

      // Seating sections heat map based on sales percentage
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
            10,
            colors.orange[100], // 10% sales (poor)
            25,
            colors.orange[200], //  25% sales
            50,
            colors.orange[300], //  50% sales (average)
            75,
            colors.orange[500], // 75% sales (good)
            90,
            colors.orange[600], // 90% sales (excellent)
            100,
            colors.orange[700], // 100% sold out
          ],
          "fill-opacity": 0.8, // Higher opacity for better heat map visibility
        },
      });

      // New section source
      map.current!.addSource(newSectionLayerName, {
        type: "geojson",
        data: newGeoJson as GeoJSON.FeatureCollection,
      });

      // New section layer
      map.current!.addLayer({
        id: "new-section-fill",
        type: "fill",
        source: newSectionLayerName,
        paint: {
          "fill-color": colors.blue[500],
          "fill-opacity": 0.5,
        },
      });

      // Seating sections outline
      map.current!.addLayer({
        id: "seating-outline",
        type: "line",
        source: seatingLayerName,
        paint: {
          "line-color": colors.gray[600],
          "line-width": 1,
        },
      });

      // Hover outline layer (initially hidden)
      map.current!.addLayer({
        id: "seating-hover-outline",
        type: "line",
        source: seatingLayerName,
        paint: {
          "line-color": colors.black,
          "line-width": 3,
          "line-opacity": 0.8,
        },
        filter: ["==", "section", ""], // Initially hide all features
      });

      // Section labels
      map.current!.addLayer({
        id: "section-labels",
        type: "symbol",
        source: seatingLayerName,
        minzoom: mediumZoom, // Only show labels when zoomed in enough
        maxzoom: maxZoom,
        layout: {
          "text-field": ["get", "section"],
          // Remove font specification - let MapLibre use default
          "text-size": 12, // Increase size to make more visible
          "text-anchor": "center",
          "text-allow-overlap": true, // Prevent labels from hiding due to collisions
          "text-ignore-placement": false,
        },
        paint: {
          "text-color": colors.black,
          "text-halo-color": colors.white,
          "text-halo-width": 1, // Increase halo for better visibility
        },
      });

      map.current!.addLayer({
        id: "new-section-label",
        type: "symbol",
        source: newSectionLayerName,
        minzoom: mediumZoom, // Only show labels when zoomed in enough
        maxzoom: maxZoom,
        layout: {
          "text-field": ["get", "section"],
          // Remove font specification - let MapLibre use default
          "text-size": 12, // Increase size to make more visible
          "text-anchor": "center",
          "text-allow-overlap": true, // Prevent labels from hiding due to collisions
          "text-ignore-placement": false,
        },
        paint: {
          "text-color": colors.black,
          "text-halo-color": colors.white,
          "text-halo-width": 1, // Increase halo for better visibility
        },
      });

      // Add detailed seating source
      // map.current!.addSource(detailLayerName, {
      //   type: "geojson",
      //   data: detailedSeatingData,
      // });

      // map.current!.addLayer({
      //   id: "facilities",
      //   type: "circle",
      //   source: detailLayerName,
      //   minzoom: mediumZoom,
      //   maxzoom: maxZoom,
      //   filter: ["==", ["get", "type"], "facility"],
      //   paint: {
      //     "circle-radius": 8,
      //     "circle-color": colors.white,
      //     "circle-stroke-width": 2,
      //     "circle-stroke-color": colors.black,
      //   },
      // });

      // 🎯 Facility labels
      // map.current!.addLayer({
      //   id: "facility-label",
      //   type: "symbol",
      //   source: detailLayerName,
      //   minzoom: mediumZoom,
      //   maxzoom: maxZoom,
      //   filter: ["==", ["get", "type"], "facility"],
      //   layout: {
      //     "text-field": ["get", "name"],
      //     "text-size": 12,
      //     "text-anchor": "top",
      //     "text-offset": [0, 1],
      //     "text-allow-overlap": true,
      //   },
      //   paint: {
      //     "text-color": colors.black,
      //     "text-halo-color": colors.white,
      //     "text-halo-width": 2,
      //   },
      // });

      // 🍕 Concession stands
      // map.current!.addLayer({
      //   id: "concessions",
      //   type: "circle",
      //   source: detailLayerName,
      //   minzoom: mediumZoom,
      //   maxzoom: maxZoom,
      //   filter: ["==", ["get", "type"], "concession"],
      //   paint: {
      //     "circle-radius": 8,
      //     "circle-color": colors.white,
      //     "circle-stroke-width": 2,
      //     "circle-stroke-color": colors.black,
      //   },
      // });

      // 🍕 Concession labels
      // map.current!.addLayer({
      //   id: "concession-labels",
      //   type: "symbol",
      //   source: detailLayerName,
      //   minzoom: mediumZoom,
      //   maxzoom: maxZoom,
      //   filter: ["==", ["get", "type"], "concession"],
      //   layout: {
      //     "text-field": ["get", "name"],
      //     "text-size": 11,
      //     "text-anchor": "top",
      //     "text-offset": [0, 1],
      //     "text-allow-overlap": true,
      //   },
      //   paint: {
      //     "text-color": colors.black,
      //     "text-halo-color": colors.white,
      //     "text-halo-width": 1,
      //   },
      // });

      // Rows
      // map.current!.addLayer({
      //   id: "rows",
      //   type: "line",
      //   source: detailLayerName,
      //   minzoom: highZoom,
      //   filter: ["==", ["get", "type"], "row"],
      //   paint: {
      //     "line-color": "#6b7280",
      //     "line-width": 2,
      //     "line-opacity": 0.8,
      //   },
      // });

      // Row labels
      // map.current!.addLayer({
      //   id: "row-labels",
      //   type: "symbol",
      //   source: detailLayerName,
      //   minzoom: highZoom,
      //   filter: ["==", ["get", "type"], "row"],
      //   layout: {
      //     "text-field": [
      //       "concat",
      //       "Row ",
      //       ["get", "row"],
      //       " (",
      //       ["get", "seats"],
      //       ")",
      //     ],
      //     "text-size": 12,
      //     "symbol-placement": "line",
      //     "text-allow-overlap": true,
      //   },
      //   paint: {
      //     "text-color": "#374151",
      //     "text-halo-color": "#ffffff",
      //     "text-halo-width": 1,
      //   },
      // });

      // lick interactions with sales data
      // map.current!.on("click", "seating-fill", (e) => {
      //   const properties = e.features![0].properties as Section;
      //   const seatsAvailable = properties.capacity - properties.seatsSold;
      //   const salesStatus =
      //     properties.salesPercentage >= 90
      //       ? "🔥 Hot Seller!"
      //       : properties.salesPercentage >= 75
      //       ? "✅ Good Sales"
      //       : properties.salesPercentage >= 50
      //       ? "⚠️ Average Sales"
      //       : "❄️ Slow Sales";

      //   new Popup({
      //     className: "custom-click-popup",
      //   })
      //     .setLngLat(e.lngLat)
      //     .setHTML(
      //       renderSectionPopoverToString(
      //         properties,
      //         seatsAvailable,
      //         salesStatus
      //       )
      //     )
      //     .addTo(map.current!);
      // });

      // �️ General map click handler for coordinate capture
      map.current!.on("click", (e) => {
        const coords = e.lngLat;

        const x = Number(coords.lng.toFixed(3));
        const y = Number(coords.lat.toFixed(3));

        updateNewSection({ ...newSection }, [[x, y]]);
      });

      // �🖱️ Hover popup functionality
      map.current!.on("mouseenter", "seating-fill", (e) => {
        // Change cursor
        map.current!.getCanvas().style.cursor = "crosshair";

        // Get section info
        const properties = e.features![0].properties;

        // Show hover outline for this section
        map.current!.setFilter("seating-hover-outline", [
          "==",
          "section",
          properties.section,
        ]);

        // Remove existing hover popup if any
        if (hoverPopup.current) {
          hoverPopup.current.remove();
        }

        // Create new hover popup with completely custom styling
        hoverPopup.current = new Popup({
          closeButton: false,
          closeOnClick: false,
          className: "custom-hover-popup",
          offset: [0, -5], // Position slightly above cursor
        })
          .setLngLat(e.lngLat)
          .setHTML(
            `
            <div class="px-2 py-1 text-center bg-gray-900 text-white rounded-lg shadow-xl border-0">
              <div class="font-semibold text-sm">Section ${properties.section}</div>
            </div>
          `
          )
          .addTo(map.current!);
      });

      map.current!.on("mouseleave", "seating-fill", () => {
        // Reset cursor
        map.current!.getCanvas().style.cursor = "crosshair";

        // Hide hover outline
        map.current!.setFilter("seating-hover-outline", ["==", "section", ""]);

        // Remove hover popup
        if (hoverPopup.current) {
          hoverPopup.current.remove();
          hoverPopup.current = null;
        }
      });

      map.current!.on("mousemove", (e) => {
        const coords = e.lngLat;

        setLng(Number(coords.lng.toFixed(3)));
        setLat(Number(coords.lat.toFixed(3)));
      });

      map.current!.on("moveend", () => {
        const center = map.current!.getCenter();
        setMapCenter([center.lng, center.lat]);
      });

      map.current!.on("zoomend", () => {
        const zoomLevel = map.current!.getZoom();

        setMapZoom(zoomLevel);
      });

      // Marker at center
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
    <div className="flex justify-between gap-4">
      <SectionBuilder
        newSection={newSection}
        setNewSection={setNewSection}
        coordinates={coordinates}
        setCoordinates={setCoordinates}
        sections={sections}
        setSections={setSections}
      />
      <div className="relative">
        <div
          ref={mapContainer}
          className="w-[660px] h-[660px] rounded-lg border border-gray-300 bg-neutral-100"
        />

        {/* Custom Zoom Controls - Modern Dark Theme */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button
            onClick={zoomIn}
            className="w-10 h-10 bg-gray-900 text-white rounded-lg shadow-lg hover:bg-gray-700 flex items-center justify-center text-xl font-bold transition-all duration-200 hover:scale-105"
            title="Zoom In"
          >
            +
          </button>
          <button
            onClick={zoomOut}
            className="w-10 h-10 bg-gray-900 text-white rounded-lg shadow-lg hover:bg-gray-700 flex items-center justify-center text-xl font-bold transition-all duration-200 hover:scale-105"
            title="Zoom Out"
          >
            −
          </button>
        </div>

        <div className="absolute bottom-4 left-4 bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg">
          <div className="text-xs font-mono">
            <div>X: {lng}</div>
            <div>Y: {lat}</div>
          </div>
        </div>
      </div>

      <SectionsViewer
        sections={sections}
        setSections={setSections}
        onSectionCardHover={highlightSection}
        onSectionCardLeave={clearHighlight}
      />
    </div>
  );
}

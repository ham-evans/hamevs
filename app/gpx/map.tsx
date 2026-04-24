"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Waypoint } from "./page";

interface MapProps {
  points: { lat: number; lon: number; ele: number }[];
  waypoints: Waypoint[];
  hoveredIndex: number | null;
  onWaypointClick: (index: number) => void;
  selectedWaypoint: number | null;
}

export default function MapView({
  points,
  waypoints,
  hoveredIndex,
  onWaypointClick,
  selectedWaypoint,
}: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.CircleMarker | null>(null);
  const wpMarkersRef = useRef<L.CircleMarker[]>([]);

  useEffect(() => {
    if (!containerRef.current || points.length === 0) return;

    if (mapRef.current) {
      mapRef.current.remove();
    }

    const map = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: true,
    });

    L.control.zoom({ position: "topright" }).addTo(map);

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 19,
      }
    ).addTo(map);

    const latLngs = points.map((p) => [p.lat, p.lon] as [number, number]);

    // Route line
    L.polyline(latLngs, {
      color: "#000",
      weight: 3,
      opacity: 0.8,
    }).addTo(map);

    // Start marker
    L.circleMarker(latLngs[0], {
      radius: 6,
      fillColor: "#000",
      fillOpacity: 1,
      color: "#f6f4f0",
      weight: 2,
    }).addTo(map);

    // End marker
    L.circleMarker(latLngs[latLngs.length - 1], {
      radius: 6,
      fillColor: "#f6f4f0",
      fillOpacity: 1,
      color: "#000",
      weight: 2,
    }).addTo(map);

    // Waypoint markers
    const wpMarkers: L.CircleMarker[] = [];
    for (let i = 0; i < waypoints.length; i++) {
      const wp = waypoints[i];
      const wpMarker = L.circleMarker([wp.lat, wp.lon], {
        radius: 5,
        fillColor: "#f6f4f0",
        fillOpacity: 1,
        color: "#000",
        weight: 1.5,
        className: "cursor-pointer",
      }).addTo(map);

      const tooltip = L.tooltip({
        permanent: true,
        direction: "top",
        offset: [0, -8],
        className: "gpx-waypoint-label",
      }).setContent(wp.name);
      wpMarker.bindTooltip(tooltip);

      const idx = i;
      wpMarker.on("click", () => {
        onWaypointClick(idx);
      });

      wpMarkers.push(wpMarker);
    }
    wpMarkersRef.current = wpMarkers;

    // Hover marker
    const marker = L.circleMarker([0, 0], {
      radius: 6,
      fillColor: "#e00",
      fillOpacity: 0,
      color: "#fff",
      weight: 2,
      opacity: 0,
    } as L.CircleMarkerOptions).addTo(map);
    markerRef.current = marker;

    const bounds = L.latLngBounds(latLngs);
    map.fitBounds(bounds, { padding: [40, 40] });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // onWaypointClick is stable from useState setter, safe to include
  }, [points, waypoints, onWaypointClick]);

  // Update hover marker
  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return;

    if (hoveredIndex !== null && hoveredIndex < points.length) {
      const p = points[hoveredIndex];
      marker.setLatLng([p.lat, p.lon]);
      marker.setStyle({ opacity: 1, fillOpacity: 1 });
    } else {
      marker.setStyle({ opacity: 0, fillOpacity: 0 });
    }
  }, [hoveredIndex, points]);

  // Highlight selected waypoint
  useEffect(() => {
    wpMarkersRef.current.forEach((m, i) => {
      if (i === selectedWaypoint) {
        m.setStyle({ fillColor: "#000", fillOpacity: 1, weight: 2, radius: 7 } as L.PathOptions);
      } else {
        m.setStyle({ fillColor: "#f6f4f0", fillOpacity: 1, weight: 1.5, radius: 5 } as L.PathOptions);
      }
    });
  }, [selectedWaypoint]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
    />
  );
}

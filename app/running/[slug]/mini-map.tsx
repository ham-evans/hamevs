"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Point {
  lat: number;
  lon: number;
  ele: number;
}

export default function MiniMap({
  points,
  hoveredIndex,
}: {
  points: Point[];
  hoveredIndex: number | null;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.CircleMarker | null>(null);

  useEffect(() => {
    if (!containerRef.current || points.length === 0) return;

    if (mapRef.current) mapRef.current.remove();

    const map = L.map(containerRef.current, {
      zoomControl: true,
      attributionControl: true,
      scrollWheelZoom: false,
    });

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 19,
      }
    ).addTo(map);

    const latLngs = points.map((p) => [p.lat, p.lon] as [number, number]);

    L.polyline(latLngs, {
      color: "#000",
      weight: 3,
      opacity: 0.6,
    }).addTo(map);

    L.circleMarker(latLngs[0], {
      radius: 5,
      fillColor: "#000",
      fillOpacity: 1,
      color: "#fafaf9",
      weight: 2,
    }).addTo(map);

    L.circleMarker(latLngs[latLngs.length - 1], {
      radius: 5,
      fillColor: "#fafaf9",
      fillOpacity: 1,
      color: "#000",
      weight: 2,
    }).addTo(map);

    const marker = L.circleMarker([0, 0], {
      radius: 5,
      fillColor: "#e00",
      fillOpacity: 0,
      color: "#fff",
      weight: 2,
      opacity: 0,
    } as L.CircleMarkerOptions).addTo(map);
    markerRef.current = marker;

    map.fitBounds(L.latLngBounds(latLngs), { padding: [20, 20] });
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [points]);

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

  return <div ref={containerRef} className="w-full h-full" />;
}

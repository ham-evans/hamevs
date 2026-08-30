"use client";

import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { haversine, type Waypoint } from "@/lib/gpx";

const LABEL_GAP_PX = -8; // label sits this far above its dot (negative = up)
const LABEL_GUTTER_PX = 3; // breathing room between stacked / neighbouring labels
// Two rows for the odd pair of stops that sit close enough to collide at low zoom.
// Anything that still doesn't fit is hidden rather than pushed higher — a label floating
// rows above its dot is worse than no label, and zooming in brings it straight back.
const MAX_LABEL_ROWS = 2;
// Two passes at the same aid station are metres apart at most; distinct stops are miles.
const SAME_STOP_M = 150;

/** One place on the map, however many times the course visits it. */
interface Stop {
  lat: number;
  lon: number;
  label: string;
  /** Indices into `waypoints`, in course order — one per visit. */
  visits: number[];
}

/** "Twin Lakes: aid (out, CREW)" -> "Twin Lakes". Names without a colon are kept whole. */
function stopName(name: string): string {
  const colon = name.indexOf(":");
  return (colon === -1 ? name : name.slice(0, colon)).trim();
}

// An out-and-back visits every aid station twice, and the GPX names the two passes
// separately ("… (out, CREW)" / "… (in, CREW + PACERS START)"). Drawn as-is that's two
// dots a few metres apart wearing two long labels. Collapse each place to a single dot
// labelled with the place's name; the per-pass detail lives in the panel and profile.
function groupWaypoints(waypoints: Waypoint[]): Stop[] {
  const stops: Stop[] = [];
  waypoints.forEach((wp, i) => {
    const existing = stops.find(
      (s) => haversine(s.lat, s.lon, wp.lat, wp.lon) <= SAME_STOP_M
    );
    if (existing) {
      existing.visits.push(i);
      // Start and Finish share a coordinate but not a name — keep both.
      const name = stopName(wp.name);
      if (!existing.label.split(" / ").includes(name)) {
        existing.label += ` / ${name}`;
      }
    } else {
      // Anchor on the first pass rather than the group's centre: that point is known
      // to sit on the track, a midpoint between two parallel passes need not.
      stops.push({ lat: wp.lat, lon: wp.lon, label: stopName(wp.name), visits: [i] });
    }
  });
  return stops;
}

/** A stop you pass twice gets a slightly fatter dot — the only hint that it holds two splits. */
function stopRadius(stop: Stop): number {
  return stop.visits.length > 1 ? 6 : 5;
}

interface MapProps {
  points: { lat: number; lon: number; ele: number }[];
  waypoints: Waypoint[];
  hoveredIndex: number | null;
  onWaypointClick: (index: number) => void;
  selectedWaypoint: number | null;
  /** Permanent stop-name labels. Off leaves the dots clickable but unlabelled. */
  showWaypointLabels?: boolean;
}

export default function MapView({
  points,
  waypoints,
  hoveredIndex,
  onWaypointClick,
  selectedWaypoint,
  showWaypointLabels = true,
}: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.CircleMarker | null>(null);
  const wpMarkersRef = useRef<L.CircleMarker[]>([]);
  const highlightLineRef = useRef<L.Polyline | null>(null);
  // The map is built once per route; the click handler reads the live selection from here
  // rather than closing over a prop that would force a rebuild on every click.
  const selectedRef = useRef<number | null>(selectedWaypoint);

  const stops = useMemo(() => groupWaypoints(waypoints), [waypoints]);

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
      opacity: 0.35,
    }).addTo(map);

    // Highlight line (initially empty)
    const hlLine = L.polyline([], {
      color: "#000",
      weight: 4,
      opacity: 0.9,
    }).addTo(map);
    highlightLineRef.current = hlLine;

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

    // Stop markers — one per place, not one per pass
    const wpMarkers: L.CircleMarker[] = [];
    const wpTooltips: L.Tooltip[] = [];
    for (const stop of stops) {
      const wpMarker = L.circleMarker([stop.lat, stop.lon], {
        radius: stopRadius(stop),
        fillColor: "#f6f4f0",
        fillOpacity: 1,
        color: "#000",
        weight: 1.5,
        className: "cursor-pointer",
      }).addTo(map);

      if (showWaypointLabels) {
      const tooltip = L.tooltip({
        permanent: true,
        interactive: true, // clicking the label selects the stop, same as the dot
        direction: "top",
        offset: [0, LABEL_GAP_PX],
        className: "gpx-waypoint-label",
      }).setContent(stop.label);
      wpMarker.bindTooltip(tooltip);
      wpTooltips.push(tooltip);
      }

      const { visits } = stop;
      wpMarker.on("click", () => {
        // Clicking a twice-visited stop steps to its next pass, so both the outbound and
        // inbound splits stay reachable from the one dot.
        const at = visits.indexOf(selectedRef.current ?? -1);
        onWaypointClick(visits[at === -1 ? 0 : (at + 1) % visits.length]);
      });

      wpMarkers.push(wpMarker);
    }
    wpMarkersRef.current = wpMarkers;

    // Labels are permanent, so at low zoom neighbouring stops can still pile up. Lay them
    // out in pixel space at the current zoom: each label takes the lowest row that clears
    // every label already placed, so a crowded pair stacks and then drops back to a single
    // row once zoom separates the dots. Earlier stops win the bottom row, which keeps the
    // pile in course order.
    const layoutLabels = () => {
      const placed: { x0: number; x1: number; y0: number; y1: number }[] = [];
      for (let i = 0; i < wpTooltips.length; i++) {
        const el = wpTooltips[i].getElement();
        if (!el) continue;

        const p = map.latLngToLayerPoint([stops[i].lat, stops[i].lon]);
        const halfW = el.offsetWidth / 2 + LABEL_GUTTER_PX;
        const h = el.offsetHeight;
        const step = h + LABEL_GUTTER_PX;

        const boxAt = (r: number) => {
          const bottom = p.y + LABEL_GAP_PX - r * step;
          return { x0: p.x - halfW, x1: p.x + halfW, y0: bottom - h, y1: bottom };
        };
        const clashes = (r: number) =>
          placed.some((q) => {
            const box = boxAt(r);
            return box.x0 < q.x1 && box.x1 > q.x0 && box.y0 < q.y1 && box.y1 > q.y0;
          });

        let row = 0;
        while (row < MAX_LABEL_ROWS && clashes(row)) row++;

        if (row === MAX_LABEL_ROWS) {
          // Nowhere to put it at this zoom. visibility (not display) keeps the element
          // measurable, so the next pass can place it again once zoom opens up room.
          el.style.visibility = "hidden";
          continue;
        }

        el.style.visibility = "";
        placed.push(boxAt(row));
        wpTooltips[i].options.offset = L.point(0, LABEL_GAP_PX - row * step);
        wpTooltips[i].update();
      }
    };

    // Tooltips need a frame in the DOM before offsetWidth is real.
    requestAnimationFrame(layoutLabels);
    map.on("zoomend", layoutLabels);

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
  }, [points, stops, onWaypointClick, showWaypointLabels]);

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

  // Highlight the selected stop + segment
  useEffect(() => {
    selectedRef.current = selectedWaypoint;

    wpMarkersRef.current.forEach((m, i) => {
      const stop = stops[i];
      if (selectedWaypoint !== null && stop.visits.includes(selectedWaypoint)) {
        m.setStyle({
          fillColor: "#000",
          fillOpacity: 1,
          weight: 2,
          radius: stopRadius(stop) + 2,
        } as L.PathOptions);
      } else {
        m.setStyle({
          fillColor: "#f6f4f0",
          fillOpacity: 1,
          weight: 1.5,
          radius: stopRadius(stop),
        } as L.PathOptions);
      }
    });

    const hlLine = highlightLineRef.current;
    if (!hlLine) return;

    if (selectedWaypoint !== null && selectedWaypoint < waypoints.length) {
      const selWp = waypoints[selectedWaypoint];
      const fromIdx = selectedWaypoint > 0 ? waypoints[selectedWaypoint - 1].nearestTrackIndex : 0;
      const toIdx = selWp.nearestTrackIndex;
      const segStart = Math.min(fromIdx, toIdx);
      const segEnd = Math.max(fromIdx, toIdx);
      const segLatLngs = points.slice(segStart, segEnd + 1).map((p) => [p.lat, p.lon] as [number, number]);
      hlLine.setLatLngs(segLatLngs);
    } else {
      hlLine.setLatLngs([]);
    }
  }, [selectedWaypoint, waypoints, stops, points]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
    />
  );
}

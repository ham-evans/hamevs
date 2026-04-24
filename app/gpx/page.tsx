"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";

interface GpxPoint {
  lat: number;
  lon: number;
  ele: number;
  time?: string;
}

export interface Waypoint {
  lat: number;
  lon: number;
  name: string;
  distanceAlongRoute: number; // meters from start
  nearestTrackIndex: number;
}

export interface WaypointSegment {
  waypoint: Waypoint;
  index: number;
  distFromStart: number;
  distFromPrev: number;
  elevationAtPoint: number; // feet
  gainFromPrev: number; // feet
  lossFromPrev: number; // feet
  distToNext: number | null;
}

interface GpxData {
  name: string;
  points: GpxPoint[];
  waypoints: Waypoint[];
  totalDistance: number;
  elevationGain: number;
  elevationLoss: number;
  minEle: number;
  maxEle: number;
}

function haversine(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function parseGpx(xml: string): GpxData {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "text/xml");

  const name =
    doc.querySelector("trk > name")?.textContent ||
    doc.querySelector("metadata > name")?.textContent ||
    "Untitled Route";

  const trkpts = doc.querySelectorAll("trkpt");
  const points: GpxPoint[] = [];

  trkpts.forEach((pt) => {
    const lat = parseFloat(pt.getAttribute("lat") || "0");
    const lon = parseFloat(pt.getAttribute("lon") || "0");
    const eleEl = pt.querySelector("ele");
    const timeEl = pt.querySelector("time");
    points.push({
      lat,
      lon,
      ele: eleEl ? parseFloat(eleEl.textContent || "0") : 0,
      time: timeEl?.textContent || undefined,
    });
  });

  if (points.length === 0) {
    const rtepts = doc.querySelectorAll("rtept");
    rtepts.forEach((pt) => {
      const lat = parseFloat(pt.getAttribute("lat") || "0");
      const lon = parseFloat(pt.getAttribute("lon") || "0");
      const eleEl = pt.querySelector("ele");
      points.push({
        lat,
        lon,
        ele: eleEl ? parseFloat(eleEl.textContent || "0") : 0,
      });
    });
  }

  const cumDists = [0];
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    cumDists.push(cumDists[i - 1] + haversine(prev.lat, prev.lon, curr.lat, curr.lon));
  }

  const wptEls = doc.querySelectorAll("wpt");
  const waypoints: Waypoint[] = [];
  wptEls.forEach((wpt) => {
    const lat = parseFloat(wpt.getAttribute("lat") || "0");
    const lon = parseFloat(wpt.getAttribute("lon") || "0");
    const wptName = wpt.querySelector("name")?.textContent || "Waypoint";

    let minDist = Infinity;
    let nearestIdx = 0;
    for (let i = 0; i < points.length; i++) {
      const d = haversine(lat, lon, points[i].lat, points[i].lon);
      if (d < minDist) {
        minDist = d;
        nearestIdx = i;
      }
    }

    waypoints.push({
      lat,
      lon,
      name: wptName,
      distanceAlongRoute: cumDists[nearestIdx],
      nearestTrackIndex: nearestIdx,
    });
  });

  waypoints.sort((a, b) => a.distanceAlongRoute - b.distanceAlongRoute);

  let totalDistance = 0;
  let elevationGain = 0;
  let elevationLoss = 0;
  let minEle = Infinity;
  let maxEle = -Infinity;

  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    if (p.ele < minEle) minEle = p.ele;
    if (p.ele > maxEle) maxEle = p.ele;
    if (i > 0) {
      const prev = points[i - 1];
      totalDistance += haversine(prev.lat, prev.lon, p.lat, p.lon);
      const dEle = p.ele - prev.ele;
      if (dEle > 0) elevationGain += dEle;
      else elevationLoss += Math.abs(dEle);
    }
  }

  return { name, points, waypoints, totalDistance, elevationGain, elevationLoss, minEle, maxEle };
}

function metersToMiles(m: number): number {
  return m * 0.000621371;
}

function metersToFeet(m: number): number {
  return m * 3.28084;
}

function computeSegments(
  points: GpxPoint[],
  waypoints: Waypoint[],
  totalDistance: number
): WaypointSegment[] {
  return waypoints.map((wp, i) => {
    const prevIdx = i === 0 ? 0 : waypoints[i - 1].nearestTrackIndex;
    const currIdx = wp.nearestTrackIndex;

    let gain = 0;
    let loss = 0;
    const from = Math.min(prevIdx, currIdx);
    const to = Math.max(prevIdx, currIdx);
    for (let j = from + 1; j <= to; j++) {
      const dEle = points[j].ele - points[j - 1].ele;
      if (dEle > 0) gain += dEle;
      else loss += Math.abs(dEle);
    }

    const distFromPrev =
      i === 0
        ? wp.distanceAlongRoute
        : wp.distanceAlongRoute - waypoints[i - 1].distanceAlongRoute;

    const distToNext =
      i < waypoints.length - 1
        ? waypoints[i + 1].distanceAlongRoute - wp.distanceAlongRoute
        : totalDistance - wp.distanceAlongRoute;

    return {
      waypoint: wp,
      index: i,
      distFromStart: wp.distanceAlongRoute,
      distFromPrev,
      elevationAtPoint: metersToFeet(points[currIdx].ele),
      gainFromPrev: metersToFeet(gain),
      lossFromPrev: metersToFeet(loss),
      distToNext: distToNext > 0 ? distToNext : null,
    };
  });
}

const MapView = dynamic(() => import("./map"), { ssr: false });

export default function GpxPage() {
  const [gpxData, setGpxData] = useState<GpxData | null>(null);
  const [dragging, setDragging] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedWaypoint, setSelectedWaypoint] = useState<number | null>(null);
  const [showClimbLabels, setShowClimbLabels] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const segments = useMemo(() => {
    if (!gpxData || gpxData.waypoints.length === 0) return [];
    return computeSegments(gpxData.points, gpxData.waypoints, gpxData.totalDistance);
  }, [gpxData]);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      try {
        const data = parseGpx(text);
        if (data.points.length === 0) {
          alert("No track points found in this GPX file.");
          return;
        }
        setGpxData(data);
        setHoveredIndex(null);
        setSelectedWaypoint(null);
      } catch {
        alert("Failed to parse GPX file.");
      }
    };
    reader.readAsText(file);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const elevationHeight = 210;

  return (
    <main className="flex flex-1 flex-col items-center">
      {!gpxData ? (
        <div
          className="flex flex-1 w-full items-center justify-center px-6"
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
        >
          <button
            onClick={() => fileInputRef.current?.click()}
            className={`
              w-full max-w-lg border-2 border-dashed rounded-lg p-16
              flex flex-col items-center gap-4 cursor-pointer
              transition-all duration-300
              ${
                dragging
                  ? "border-fg bg-fg/5 scale-[1.02]"
                  : "border-fg/20 hover:border-fg/40"
              }
            `}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-fg/40"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <polyline points="9 15 12 12 15 15" />
            </svg>
            <div className="text-center">
              <p className="text-fg/70 text-sm">
                Drop a <span className="font-bold text-fg">.gpx</span> file
                here
              </p>
              <p className="text-fg/30 text-xs mt-1">or click to browse</p>
            </div>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".gpx"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </div>
      ) : (
        <div className="w-full flex flex-col" style={{ height: "calc(100vh - 44px)" }}>
          {/* Header bar */}
          <div className="px-6 py-3 flex items-center justify-between border-b border-fg/10 shrink-0">
            <div className="flex items-center gap-6 min-w-0">
              <h1 className="text-sm font-bold tracking-tight truncate max-w-lg">
                {gpxData.name}
              </h1>
              <div className="hidden sm:flex gap-5 text-xs text-fg/50">
                <Stat
                  label="dist"
                  value={`${metersToMiles(gpxData.totalDistance).toFixed(1)} mi`}
                />
                <Stat
                  label="gain"
                  value={`${metersToFeet(gpxData.elevationGain).toFixed(0)} ft`}
                />
                <Stat
                  label="loss"
                  value={`${metersToFeet(gpxData.elevationLoss).toFixed(0)} ft`}
                />
                <Stat
                  label="high"
                  value={`${metersToFeet(gpxData.maxEle).toFixed(0)} ft`}
                />
                <Stat
                  label="low"
                  value={`${metersToFeet(gpxData.minEle).toFixed(0)} ft`}
                />
              </div>
            </div>
            <button
              onClick={() => setGpxData(null)}
              className="text-xs text-fg/40 hover:text-fg underline underline-offset-4 shrink-0"
            >
              new file
            </button>
          </div>

          {/* Mobile stats */}
          <div className="sm:hidden px-6 py-2 flex gap-4 text-xs text-fg/50 border-b border-fg/10 overflow-x-auto shrink-0">
            <Stat
              label="dist"
              value={`${metersToMiles(gpxData.totalDistance).toFixed(1)} mi`}
            />
            <Stat
              label="gain"
              value={`${metersToFeet(gpxData.elevationGain).toFixed(0)} ft`}
            />
            <Stat
              label="loss"
              value={`${metersToFeet(gpxData.elevationLoss).toFixed(0)} ft`}
            />
          </div>

          {/* Main content row: map/chart + optional side panel */}
          <div className="flex flex-1 min-h-0">
            {/* Left: map + elevation */}
            <div className="flex-1 min-w-0 flex flex-col">
              <div className="flex-1 min-h-0">
                <MapView
                  points={gpxData.points}
                  waypoints={gpxData.waypoints}
                  hoveredIndex={hoveredIndex}
                  onWaypointClick={setSelectedWaypoint}
                  selectedWaypoint={selectedWaypoint}
                />
              </div>
              <div className="shrink-0">
                <ElevationProfile
                  points={gpxData.points}
                  waypoints={gpxData.waypoints}
                  totalDistance={gpxData.totalDistance}
                  onHover={setHoveredIndex}
                  onWaypointClick={setSelectedWaypoint}
                  showClimbLabels={showClimbLabels}
                  onToggleClimbLabels={() => setShowClimbLabels((v) => !v)}
                  height={elevationHeight}
                />
              </div>
            </div>

            {/* Right: waypoint detail panel */}
            <WaypointPanel
              segments={segments}
              points={gpxData.points}
              waypoints={gpxData.waypoints}
              selectedIndex={selectedWaypoint}
              totalDistance={gpxData.totalDistance}
              onClose={() => setSelectedWaypoint(null)}
              onSelect={setSelectedWaypoint}
            />
          </div>
        </div>
      )}
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="whitespace-nowrap">
      <span className="text-fg/30">{label}</span>{" "}
      <span className="font-bold text-fg/70">{value}</span>
    </div>
  );
}

function WaypointPanel({
  segments,
  points,
  waypoints,
  selectedIndex,
  totalDistance,
  onClose,
  onSelect,
}: {
  segments: WaypointSegment[];
  points: GpxPoint[];
  waypoints: Waypoint[];
  selectedIndex: number | null;
  totalDistance: number;
  onClose: () => void;
  onSelect: (i: number) => void;
}) {
  const open = selectedIndex !== null;
  const seg = open ? segments[selectedIndex] : null;

  // Compute the slice of track points for this segment (prev station -> this station)
  const segmentSlice = useMemo(() => {
    if (!seg) return null;
    const fromIdx = seg.index > 0 ? waypoints[seg.index - 1].nearestTrackIndex : 0;
    const toIdx = seg.waypoint.nearestTrackIndex;
    const start = Math.min(fromIdx, toIdx);
    const end = Math.max(fromIdx, toIdx);
    if (end - start < 2) return null;
    return points.slice(start, end + 1);
  }, [seg, points, waypoints]);

  return (
    <div
      className="shrink-0 bg-bg border-l border-fg/10 flex flex-col overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{ width: open ? "380px" : "0px" }}
    >
      {seg && (
        <>
          {/* Panel header */}
          <div className="px-5 py-4 border-b border-fg/10 flex items-start justify-between gap-3 shrink-0">
            <div className="min-w-0">
              <p className="text-xs text-fg/30 uppercase tracking-wider">
                {seg.index === 0
                  ? "Start"
                  : seg.index === segments.length - 1
                  ? "Finish"
                  : `Station ${seg.index}`}
              </p>
              <h2 className="text-sm font-bold mt-1 leading-tight">
                {seg.waypoint.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-fg/30 hover:text-fg text-lg leading-none shrink-0 mt-0.5"
            >
              &times;
            </button>
          </div>

          {/* Stats + chart */}
          <div className="px-5 py-4 flex-1 overflow-y-auto">
            {/* Segment elevation mini chart */}
            {segmentSlice && segmentSlice.length >= 2 && (
              <div className="mb-4">
                <p className="text-[10px] text-fg/30 uppercase tracking-wider mb-2">
                  Elevation profile
                </p>
                <SegmentElevationChart points={segmentSlice} />
              </div>
            )}

            <div className="space-y-4">
              <PanelStatGroup label="From start">
                <PanelStat
                  label="Distance"
                  value={`${metersToMiles(seg.distFromStart).toFixed(1)} mi`}
                />
                <PanelStat
                  label="Elevation"
                  value={`${seg.elevationAtPoint.toFixed(0)} ft`}
                />
                <PanelStat
                  label="Progress"
                  value={`${((seg.distFromStart / totalDistance) * 100).toFixed(0)}%`}
                />
              </PanelStatGroup>

              {seg.index > 0 && (
                <PanelStatGroup
                  label={`From ${segments[seg.index - 1].waypoint.name}`}
                >
                  <PanelStat
                    label="Distance"
                    value={`${metersToMiles(seg.distFromPrev).toFixed(1)} mi`}
                  />
                  <PanelStat
                    label="Gain"
                    value={`+${seg.gainFromPrev.toFixed(0)} ft`}
                  />
                  <PanelStat
                    label="Loss"
                    value={`-${seg.lossFromPrev.toFixed(0)} ft`}
                  />
                  <PanelStat
                    label="Net"
                    value={`${(seg.gainFromPrev - seg.lossFromPrev) >= 0 ? "+" : ""}${(seg.gainFromPrev - seg.lossFromPrev).toFixed(0)} ft`}
                  />
                </PanelStatGroup>
              )}

              {seg.distToNext !== null && seg.index < segments.length - 1 && (
                <PanelStatGroup
                  label={`To ${segments[seg.index + 1].waypoint.name}`}
                >
                  <PanelStat
                    label="Distance"
                    value={`${metersToMiles(seg.distToNext).toFixed(1)} mi`}
                  />
                  <PanelStat
                    label="Gain"
                    value={`+${segments[seg.index + 1].gainFromPrev.toFixed(0)} ft`}
                  />
                  <PanelStat
                    label="Loss"
                    value={`-${segments[seg.index + 1].lossFromPrev.toFixed(0)} ft`}
                  />
                </PanelStatGroup>
              )}

              {seg.distToNext !== null && seg.index === segments.length - 1 && (
                <PanelStatGroup label="To finish">
                  <PanelStat
                    label="Remaining"
                    value={`${metersToMiles(seg.distToNext).toFixed(1)} mi`}
                  />
                </PanelStatGroup>
              )}
            </div>

            {/* Mini waypoint list for quick nav */}
            <div className="mt-6 pt-4 border-t border-fg/10">
              <p className="text-[10px] text-fg/30 uppercase tracking-wider mb-2">
                All stations
              </p>
              <div className="space-y-0.5">
                {segments.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => onSelect(i)}
                    className={`
                      w-full text-left px-2 py-1.5 rounded text-xs
                      transition-colors duration-150
                      ${
                        i === selectedIndex
                          ? "bg-fg/10 text-fg font-bold"
                          : "text-fg/50 hover:bg-fg/5 hover:text-fg"
                      }
                    `}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate">{s.waypoint.name}</span>
                      <span className="text-fg/30 shrink-0">
                        {metersToMiles(s.distFromStart).toFixed(1)}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function PanelStatGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[10px] text-fg/30 uppercase tracking-wider mb-2">
        {label}
      </p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">{children}</div>
    </div>
  );
}

function PanelStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] text-fg/30">{label}</p>
      <p className="text-sm font-bold">{value}</p>
    </div>
  );
}

function SegmentElevationChart({ points }: { points: GpxPoint[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const chartHeight = 140;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const obs = new ResizeObserver((entries) => {
      setContainerWidth(entries[0].contentRect.width);
    });
    obs.observe(container);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || containerWidth === 0 || points.length < 2) return;

    const w = containerWidth;
    const h = chartHeight;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    const padding = { top: 14, right: 8, bottom: 22, left: 36 };
    const plotW = w - padding.left - padding.right;
    const plotH = h - padding.top - padding.bottom;

    ctx.fillStyle = "#f6f4f0";
    ctx.fillRect(0, 0, w, h);

    // Compute cumulative distances for this segment
    const dists = [0];
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      dists.push(dists[i - 1] + haversine(prev.lat, prev.lon, curr.lat, curr.lon));
    }
    const totalDist = dists[dists.length - 1];

    const elevations = points.map((p) => metersToFeet(p.ele));
    const minEle = Math.min(...elevations);
    const maxEle = Math.max(...elevations);
    const eleRange = maxEle - minEle || 1;
    const elePad = eleRange * 0.12;

    const xScale = (d: number) => padding.left + (d / totalDist) * plotW;
    const yScale = (e: number) =>
      padding.top + plotH - ((e - (minEle - elePad)) / (eleRange + 2 * elePad)) * plotH;

    // Subtle grid
    ctx.strokeStyle = "rgba(0,0,0,0.04)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 3; i++) {
      const ele = minEle - elePad + ((eleRange + 2 * elePad) * i) / 3;
      const y = yScale(ele);
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();

      ctx.fillStyle = "rgba(0,0,0,0.18)";
      ctx.font = "8px monospace";
      ctx.textAlign = "right";
      ctx.fillText(`${Math.round(ele)}`, padding.left - 4, y + 3);
    }

    // Distance labels on bottom
    const numDist = Math.min(3, Math.floor(plotW / 50));
    for (let i = 0; i <= numDist; i++) {
      const d = (totalDist * i) / numDist;
      ctx.fillStyle = "rgba(0,0,0,0.18)";
      ctx.font = "8px monospace";
      ctx.textAlign = "center";
      ctx.fillText(`${metersToMiles(d).toFixed(1)}`, xScale(d), h - 5);
    }

    // Fill
    const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + plotH);
    gradient.addColorStop(0, "rgba(0, 0, 0, 0.08)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0.01)");

    ctx.beginPath();
    ctx.moveTo(xScale(0), yScale(elevations[0]));
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(xScale(dists[i]), yScale(elevations[i]));
    }
    ctx.lineTo(xScale(totalDist), padding.top + plotH);
    ctx.lineTo(xScale(0), padding.top + plotH);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.moveTo(xScale(0), yScale(elevations[0]));
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(xScale(dists[i]), yScale(elevations[i]));
    }
    ctx.strokeStyle = "rgba(0,0,0,0.55)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Find local peaks and valleys using a smoothed approach
    const windowSize = Math.max(3, Math.floor(points.length / 40));
    const smoothed = elevations.map((_, i) => {
      let sum = 0;
      let count = 0;
      for (let j = Math.max(0, i - windowSize); j <= Math.min(elevations.length - 1, i + windowSize); j++) {
        sum += elevations[j];
        count++;
      }
      return sum / count;
    });

    const minProminence = eleRange * 0.08;
    const minPixelSpacing = 45;

    interface TurningPoint {
      index: number;
      elevation: number;
      type: "peak" | "valley";
      x: number;
      y: number;
    }

    const rawTurns: TurningPoint[] = [];
    for (let i = 1; i < smoothed.length - 1; i++) {
      const prev = smoothed[i - 1];
      const curr = smoothed[i];
      const next = smoothed[i + 1];
      if (curr > prev && curr > next) {
        rawTurns.push({ index: i, elevation: elevations[i], type: "peak", x: xScale(dists[i]), y: yScale(elevations[i]) });
      } else if (curr < prev && curr < next) {
        rawTurns.push({ index: i, elevation: elevations[i], type: "valley", x: xScale(dists[i]), y: yScale(elevations[i]) });
      }
    }

    // Filter: keep only prominent turns, merging close same-type points
    const significantPoints: TurningPoint[] = [];
    for (const tp of rawTurns) {
      let dominated = false;
      for (const sp of significantPoints) {
        if (Math.abs(tp.x - sp.x) < minPixelSpacing) {
          if (tp.type === sp.type) {
            if ((tp.type === "peak" && tp.elevation > sp.elevation) ||
                (tp.type === "valley" && tp.elevation < sp.elevation)) {
              if (Math.abs(tp.elevation - sp.elevation) > minProminence) {
                significantPoints.splice(significantPoints.indexOf(sp), 1);
              } else {
                dominated = true;
              }
            } else {
              dominated = true;
            }
          }
        }
      }
      if (!dominated) significantPoints.push(tp);
    }

    // Build the full sequence: start + turning points + end
    const keyPoints: TurningPoint[] = [
      { index: 0, elevation: elevations[0], type: "valley", x: xScale(0), y: yScale(elevations[0]) },
      ...significantPoints,
      { index: elevations.length - 1, elevation: elevations[elevations.length - 1], type: "valley", x: xScale(totalDist), y: yScale(elevations[elevations.length - 1]) },
    ];

    // Remove points too close together, keeping the more extreme
    const finalPoints: TurningPoint[] = [];
    for (const kp of keyPoints) {
      const tooClose = finalPoints.some((f) => Math.abs(f.x - kp.x) < minPixelSpacing);
      if (!tooClose) finalPoints.push(kp);
    }

    // Draw dots at each key point
    for (const kp of finalPoints) {
      ctx.beginPath();
      ctx.arc(kp.x, kp.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.fill();
    }

    // Draw elevation label at each key point
    for (const kp of finalPoints) {
      const label = `${Math.round(kp.elevation)}`;
      ctx.font = "bold 8px monospace";
      const tm = ctx.measureText(label);
      const lx = Math.min(Math.max(kp.x - tm.width / 2, padding.left), w - padding.right - tm.width);
      const ly = kp.type === "peak" ? kp.y - 8 : kp.y + 13;

      ctx.fillStyle = "rgba(246,244,240,0.85)";
      ctx.fillRect(lx - 1, ly - 7, tm.width + 2, 9);
      ctx.fillStyle = "rgba(0,0,0,0.45)";
      ctx.fillText(label, lx, ly);
    }

    // Draw +/- delta labels between consecutive key points
    for (let i = 1; i < finalPoints.length; i++) {
      const prev = finalPoints[i - 1];
      const curr = finalPoints[i];
      const delta = Math.round(curr.elevation - prev.elevation);
      if (Math.abs(delta) < minProminence * 0.5) continue; // skip tiny changes

      const isClimb = delta > 0;
      const label = isClimb ? `+${delta}` : `${delta}`;

      // Position at midpoint between the two key points
      const midX = (prev.x + curr.x) / 2;
      const midY = (prev.y + curr.y) / 2;

      ctx.font = "bold 9px monospace";
      const tm = ctx.measureText(label);
      const lx = Math.min(Math.max(midX - tm.width / 2, padding.left), w - padding.right - tm.width);

      // Place above line for climbs, below for descents
      const ly = isClimb ? midY - 4 : midY + 12;

      // Background pill
      ctx.fillStyle = isClimb ? "rgba(30,120,60,0.12)" : "rgba(180,40,40,0.10)";
      ctx.beginPath();
      ctx.roundRect(lx - 3, ly - 9, tm.width + 6, 13, 3);
      ctx.fill();

      // Text
      ctx.fillStyle = isClimb ? "rgba(30,120,60,0.75)" : "rgba(180,40,40,0.70)";
      ctx.fillText(label, lx, ly)
    }
  }, [points, containerWidth]);

  return (
    <div ref={containerRef} className="w-full rounded border border-fg/8 overflow-hidden">
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: `${chartHeight}px`, display: "block" }}
      />
    </div>
  );
}

function ElevationProfile({
  points,
  waypoints,
  totalDistance,
  onHover,
  onWaypointClick,
  showClimbLabels,
  onToggleClimbLabels,
  height,
}: {
  points: GpxPoint[];
  waypoints: Waypoint[];
  totalDistance: number;
  onHover: (index: number | null) => void;
  onWaypointClick: (index: number) => void;
  showClimbLabels: boolean;
  onToggleClimbLabels: () => void;
  height: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [hoverInfo, setHoverInfo] = useState<{
    x: number;
    index: number;
  } | null>(null);

  // Zoom/pan state: xZoom >= 1 (1 = full), xOffset 0..1 (left edge as fraction of total)
  const [xZoom, setXZoom] = useState(1);
  const [xOffset, setXOffset] = useState(0);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartOffset = useRef(0);

  const cumulativeDistances = useRef<number[]>([]);
  useEffect(() => {
    const dists = [0];
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      dists.push(dists[i - 1] + haversine(prev.lat, prev.lon, curr.lat, curr.lon));
    }
    cumulativeDistances.current = dists;
  }, [points]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const obs = new ResizeObserver((entries) => {
      setContainerWidth(entries[0].contentRect.width);
    });
    obs.observe(container);
    return () => obs.disconnect();
  }, []);

  // Store waypoint hit zones for click detection
  const waypointHitZones = useRef<{ x: number; y: number; wpIndex: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || containerWidth === 0) return;

    const w = containerWidth;
    const h = height;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    const padding = { top: 16, right: 20, bottom: 38, left: 50 };
    const plotW = w - padding.left - padding.right;
    const plotH = h - padding.top - padding.bottom;

    ctx.fillStyle = "#f6f4f0";
    ctx.fillRect(0, 0, w, h);

    if (points.length < 2) return;

    const elevations = points.map((p) => metersToFeet(p.ele));
    const minEle = Math.min(...elevations);
    const maxEle = Math.max(...elevations);
    const eleRange = maxEle - minEle || 1;
    const elePad = eleRange * 0.08;

    const dists = cumulativeDistances.current;
    const totalDist = dists[dists.length - 1];

    // Visible range based on zoom/pan
    const visibleFraction = 1 / xZoom;
    const visStart = xOffset * totalDist;
    const visEnd = (xOffset + visibleFraction) * totalDist;
    const visRange = visEnd - visStart;

    const xScale = (d: number) => padding.left + ((d - visStart) / visRange) * plotW;
    const yScale = (e: number) =>
      padding.top + plotH - ((e - (minEle - elePad)) / (eleRange + 2 * elePad)) * plotH;

    // Grid lines + y-axis labels (drawn outside clip)
    ctx.strokeStyle = "rgba(0,0,0,0.05)";
    ctx.lineWidth = 1;
    const numGridLines = 4;
    for (let i = 0; i <= numGridLines; i++) {
      const ele = minEle - elePad + ((eleRange + 2 * elePad) * i) / numGridLines;
      const y = yScale(ele);
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();

      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.font = "9px monospace";
      ctx.textAlign = "right";
      ctx.fillText(`${Math.round(ele)}`, padding.left - 6, y + 3);
    }

    // Clip the plot area for all remaining drawing
    ctx.save();
    ctx.beginPath();
    ctx.rect(padding.left, 0, plotW, h);
    ctx.clip();

    // Gradient fill
    const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + plotH);
    gradient.addColorStop(0, "rgba(0, 0, 0, 0.10)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0.01)");

    ctx.beginPath();
    ctx.moveTo(xScale(0), yScale(elevations[0]));
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(xScale(dists[i]), yScale(elevations[i]));
    }
    ctx.lineTo(xScale(totalDist), padding.top + plotH);
    ctx.lineTo(xScale(0), padding.top + plotH);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Elevation line
    ctx.beginPath();
    ctx.moveTo(xScale(0), yScale(elevations[0]));
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(xScale(dists[i]), yScale(elevations[i]));
    }
    ctx.strokeStyle = "rgba(0,0,0,0.6)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Waypoint markers
    const zones: { x: number; y: number; wpIndex: number }[] = [];
    for (let wi = 0; wi < waypoints.length; wi++) {
      const wp = waypoints[wi];
      const wx = xScale(wp.distanceAlongRoute);
      const idx = wp.nearestTrackIndex;
      const wy = yScale(elevations[idx]);

      ctx.strokeStyle = "rgba(0,0,0,0.15)";
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(wx, wy);
      ctx.lineTo(wx, padding.top + plotH);
      ctx.stroke();
      ctx.setLineDash([]);

      // Diamond
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.beginPath();
      ctx.moveTo(wx, wy - 5);
      ctx.lineTo(wx + 4, wy);
      ctx.lineTo(wx, wy + 5);
      ctx.lineTo(wx - 4, wy);
      ctx.closePath();
      ctx.fill();

      zones.push({ x: wx, y: wy, wpIndex: wi });
    }
    waypointHitZones.current = zones;

    // Climb/descent labels on the main chart
    if (showClimbLabels) {
      const smoothWindow = Math.max(5, Math.floor(points.length / 60));
      const smoothedEle = elevations.map((_, i) => {
        let sum = 0;
        let count = 0;
        for (let j = Math.max(0, i - smoothWindow); j <= Math.min(elevations.length - 1, i + smoothWindow); j++) {
          sum += elevations[j];
          count++;
        }
        return sum / count;
      });

      interface KeyPt { index: number; elevation: number; type: "peak" | "valley"; x: number; y: number }
      const rawKp: KeyPt[] = [];
      for (let i = 1; i < smoothedEle.length - 1; i++) {
        if (smoothedEle[i] > smoothedEle[i - 1] && smoothedEle[i] > smoothedEle[i + 1]) {
          rawKp.push({ index: i, elevation: elevations[i], type: "peak", x: xScale(dists[i]), y: yScale(elevations[i]) });
        } else if (smoothedEle[i] < smoothedEle[i - 1] && smoothedEle[i] < smoothedEle[i + 1]) {
          rawKp.push({ index: i, elevation: elevations[i], type: "valley", x: xScale(dists[i]), y: yScale(elevations[i]) });
        }
      }

      const climbMinPx = 40;
      const climbMinProm = eleRange * 0.06;
      const filteredKp: KeyPt[] = [];
      for (const kp of rawKp) {
        let skip = false;
        for (const f of filteredKp) {
          if (Math.abs(kp.x - f.x) < climbMinPx) {
            if (kp.type === f.type) {
              if ((kp.type === "peak" && kp.elevation > f.elevation) || (kp.type === "valley" && kp.elevation < f.elevation)) {
                filteredKp.splice(filteredKp.indexOf(f), 1);
              } else {
                skip = true;
              }
            }
          }
        }
        if (!skip) filteredKp.push(kp);
      }

      const allKp: KeyPt[] = [
        { index: 0, elevation: elevations[0], type: "valley", x: xScale(0), y: yScale(elevations[0]) },
        ...filteredKp,
        { index: elevations.length - 1, elevation: elevations[elevations.length - 1], type: "valley", x: xScale(totalDist), y: yScale(elevations[elevations.length - 1]) },
      ];
      const dedupedKp: KeyPt[] = [];
      for (const kp of allKp) {
        if (!dedupedKp.some((f) => Math.abs(f.x - kp.x) < climbMinPx)) dedupedKp.push(kp);
      }

      for (let i = 1; i < dedupedKp.length; i++) {
        const prev = dedupedKp[i - 1];
        const curr = dedupedKp[i];
        const delta = Math.round(curr.elevation - prev.elevation);
        if (Math.abs(delta) < climbMinProm * 0.5) continue;

        const midX = (prev.x + curr.x) / 2;
        // Skip if the label midpoint is outside the visible plot area
        if (midX < padding.left || midX > w - padding.right) continue;

        const isClimb = delta > 0;
        const label = isClimb ? `+${delta}` : `${delta}`;
        const midY = (prev.y + curr.y) / 2;

        ctx.font = "bold 9px monospace";
        const tm = ctx.measureText(label);
        const lx = midX - tm.width / 2;
        const ly = isClimb ? midY - 4 : midY + 12;

        ctx.fillStyle = isClimb ? "rgba(30,120,60,0.12)" : "rgba(180,40,40,0.10)";
        ctx.beginPath();
        ctx.roundRect(lx - 3, ly - 9, tm.width + 6, 13, 3);
        ctx.fill();

        ctx.fillStyle = isClimb ? "rgba(30,120,60,0.75)" : "rgba(180,40,40,0.70)";
        ctx.fillText(label, lx, ly);
      }
    }

    ctx.restore(); // release clip

    // Mile markers along x-axis (drawn outside clip so labels aren't cut)
    const visStartMi = metersToMiles(visStart);
    const visEndMi = metersToMiles(visEnd);
    const visRangeMi = visEndMi - visStartMi;
    const maxLabels = Math.floor(plotW / 55);
    const rawInterval = visRangeMi / maxLabels;
    const niceIntervals = [0.5, 1, 2, 5, 10, 20, 50];
    const mileInterval = niceIntervals.find((n) => n >= rawInterval) || 50;
    const firstMile = Math.ceil(visStartMi / mileInterval) * mileInterval;
    for (let mi = firstMile; mi <= visEndMi; mi += mileInterval) {
      const d = mi / 0.000621371;
      const x = xScale(d);
      if (x < padding.left || x > w - padding.right) continue;
      // Tick mark
      ctx.strokeStyle = "rgba(0,0,0,0.1)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, padding.top + plotH);
      ctx.lineTo(x, padding.top + plotH + 5);
      ctx.stroke();
      // Label
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.font = "9px monospace";
      ctx.textAlign = "center";
      const label = mileInterval >= 1 ? `${mi}` : `${mi.toFixed(1)}`;
      ctx.fillText(label, x, padding.top + plotH + 16);
    }
    // "mi" unit label
    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.font = "8px monospace";
    ctx.textAlign = "right";
    ctx.fillText("mi", w - padding.right, padding.top + plotH + 16);

    // Zoom indicator bar (if zoomed in)
    if (xZoom > 1) {
      const barY = h - 3;
      const barH = 2;
      ctx.fillStyle = "rgba(0,0,0,0.06)";
      ctx.fillRect(padding.left, barY, plotW, barH);
      const thumbW = plotW / xZoom;
      const thumbX = padding.left + xOffset * (plotW - thumbW);
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.beginPath();
      ctx.roundRect(thumbX, barY, thumbW, barH, 1);
      ctx.fill();
    }

    // Hover crosshair + tooltip (drawn last, fully unclipped)
    if (hoverInfo) {
      const idx = hoverInfo.index;
      const hx = xScale(dists[idx]);
      const hy = yScale(elevations[idx]);

      if (hx >= padding.left && hx <= w - padding.right) {
        // Reset any lingering state
        ctx.globalAlpha = 1;
        ctx.setLineDash([3, 3]);
        ctx.strokeStyle = "rgba(0,0,0,0.3)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(hx, padding.top);
        ctx.lineTo(hx, padding.top + plotH);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.beginPath();
        ctx.arc(hx, hy, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#000";
        ctx.fill();

        const tooltipText = `${elevations[idx].toFixed(0)} ft  ${metersToMiles(dists[idx]).toFixed(2)} mi`;
        ctx.font = "bold 10px monospace";
        const tm = ctx.measureText(tooltipText);
        const tooltipW = tm.width + 12;
        const tooltipH = 18;
        // Keep tooltip fully within canvas
        const tx = Math.min(Math.max(hx - tooltipW / 2, 2), w - tooltipW - 2);
        const ty = Math.max(hy - 26, 2);

        ctx.fillStyle = "rgba(0,0,0,0.85)";
        ctx.beginPath();
        ctx.roundRect(tx, ty, tooltipW, tooltipH, 3);
        ctx.fill();

        ctx.fillStyle = "#f6f4f0";
        ctx.textAlign = "left";
        ctx.fillText(tooltipText, tx + 6, ty + 13);
      }
    }
  }, [points, waypoints, containerWidth, height, hoverInfo, showClimbLabels, xZoom, xOffset]);

  // Convert pixel x to distance along route, accounting for zoom/pan
  const pixelToDist = useCallback(
    (px: number, rectWidth: number) => {
      const padding = { left: 50, right: 20 };
      const plotW = rectWidth - padding.left - padding.right;
      const ratio = (px - padding.left) / plotW;
      if (ratio < 0 || ratio > 1) return null;
      const visFraction = 1 / xZoom;
      const visStart = xOffset;
      const dists = cumulativeDistances.current;
      const totalDist = dists[dists.length - 1];
      return (visStart + ratio * visFraction) * totalDist;
    },
    [xZoom, xOffset]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas || points.length < 2) return;

      // Handle dragging for pan
      if (isDragging.current) {
        const rect = canvas.getBoundingClientRect();
        const dx = e.clientX - dragStartX.current;
        const padding = { left: 50, right: 20 };
        const plotW = rect.width - padding.left - padding.right;
        const visFraction = 1 / xZoom;
        const distDelta = -(dx / plotW) * visFraction;
        const newOffset = Math.max(0, Math.min(1 - visFraction, dragStartOffset.current + distDelta));
        setXOffset(newOffset);
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const targetDist = pixelToDist(x, rect.width);

      if (targetDist === null) {
        setHoverInfo(null);
        onHover(null);
        return;
      }

      const dists = cumulativeDistances.current;
      let lo = 0;
      let hi = dists.length - 1;
      while (lo < hi - 1) {
        const mid = (lo + hi) >> 1;
        if (dists[mid] < targetDist) lo = mid;
        else hi = mid;
      }
      const idx =
        Math.abs(dists[lo] - targetDist) < Math.abs(dists[hi] - targetDist)
          ? lo
          : hi;

      setHoverInfo({ x, index: idx });
      onHover(idx);
    },
    [points, onHover, pixelToDist, xZoom]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const hitRadius = 12;
      for (const zone of waypointHitZones.current) {
        const dx = x - zone.x;
        const dy = y - zone.y;
        if (Math.abs(dx) < hitRadius && Math.abs(dy) < hitRadius) {
          onWaypointClick(zone.wpIndex);
          return;
        }
      }
    },
    [onWaypointClick]
  );

  // Wheel zoom
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const padding = { left: 50, right: 20 };
      const plotW = rect.width - padding.left - padding.right;
      const mouseRatio = (e.clientX - rect.left - padding.left) / plotW;

      const zoomDelta = e.deltaY < 0 ? 1.12 : 1 / 1.12;

      setXZoom((prev) => {
        const newZoom = Math.max(1, Math.min(30, prev * zoomDelta));
        const oldVisFrac = 1 / prev;
        const newVisFrac = 1 / newZoom;
        // Keep the point under the mouse stationary
        const pointOnRoute = xOffset + mouseRatio * oldVisFrac;
        const newOffset = Math.max(0, Math.min(1 - newVisFrac, pointOnRoute - mouseRatio * newVisFrac));
        setXOffset(newOffset);
        return newZoom;
      });
    };
    canvas.addEventListener("wheel", handler, { passive: false });
    return () => canvas.removeEventListener("wheel", handler);
  }, [xOffset]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (xZoom <= 1) return;
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartOffset.current = xOffset;
  }, [xZoom, xOffset]);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full border-t border-fg/10 relative"
      style={{ height: `${height}px` }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", cursor: xZoom > 1 ? "grab" : "crosshair" }}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={handleClick}
        onMouseLeave={() => {
          isDragging.current = false;
          setHoverInfo(null);
          onHover(null);
        }}
      />
      <label className="absolute top-2 right-3 flex items-center gap-1.5 text-[10px] text-fg/35 hover:text-fg/55 cursor-pointer select-none z-10">
        <input
          type="checkbox"
          checked={showClimbLabels}
          onChange={onToggleClimbLabels}
          className="accent-fg w-3 h-3"
        />
        climbs
      </label>
      {xZoom > 1 && (
        <button
          onClick={() => { setXZoom(1); setXOffset(0); }}
          className="absolute top-2 right-20 text-[10px] text-fg/35 hover:text-fg/55 underline underline-offset-2 select-none z-10"
        >
          reset zoom
        </button>
      )}
    </div>
  );
}

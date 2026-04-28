"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import {
  parseGpx,
  haversine,
  metersToMiles,
  metersToFeet,
  type GpxData,
} from "@/lib/gpx";

const MiniMap = dynamic(() => import("./mini-map"), { ssr: false });

export default function MiniGpxViewer({ src }: { src: string }) {
  const [data, setData] = useState<GpxData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(src)
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load GPX (${r.status})`);
        return r.text();
      })
      .then((text) => {
        if (cancelled) return;
        const parsed = parseGpx(text);
        if (parsed.points.length === 0) {
          setError("No track points in GPX file.");
          return;
        }
        setData(parsed);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, [src]);

  if (error) {
    return (
      <p className="my-6 text-sm text-fg/40 italic">
        Could not load route: {error}
      </p>
    );
  }

  if (!data) {
    return (
      <div className="my-6 h-72 w-full animate-pulse rounded border border-fg/10 bg-fg/5" />
    );
  }

  return (
    <div className="my-8 not-prose overflow-hidden rounded border border-fg/10">
      <div className="flex flex-wrap gap-x-5 gap-y-2 px-4 py-3 text-xs text-fg/50 border-b border-fg/10">
        <Stat
          label="dist"
          value={`${metersToMiles(data.totalDistance).toFixed(1)} mi`}
        />
        <Stat
          label="gain"
          value={`${metersToFeet(data.elevationGain).toFixed(0)} ft`}
        />
        <Stat
          label="loss"
          value={`${metersToFeet(data.elevationLoss).toFixed(0)} ft`}
        />
        <Stat
          label="high"
          value={`${metersToFeet(data.maxEle).toFixed(0)} ft`}
        />
        <Stat
          label="low"
          value={`${metersToFeet(data.minEle).toFixed(0)} ft`}
        />
      </div>
      <div className="h-72 w-full">
        <MiniMap points={data.points} hoveredIndex={hoveredIndex} />
      </div>
      <MiniElevationChart
        points={data.points}
        onHover={setHoveredIndex}
      />
    </div>
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

function MiniElevationChart({
  points,
  onHover,
}: {
  points: { lat: number; lon: number; ele: number }[];
  onHover: (i: number | null) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [hoverX, setHoverX] = useState<number | null>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const distsRef = useRef<number[]>([]);
  const height = 140;

  useEffect(() => {
    const dists = [0];
    for (let i = 1; i < points.length; i++) {
      dists.push(
        dists[i - 1] +
          haversine(
            points[i - 1].lat,
            points[i - 1].lon,
            points[i].lat,
            points[i].lon
          )
      );
    }
    distsRef.current = dists;
  }, [points]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver((e) => setWidth(e[0].contentRect.width));
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || width === 0 || points.length < 2) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    const padding = { top: 10, right: 14, bottom: 24, left: 42 };
    const plotW = width - padding.left - padding.right;
    const plotH = height - padding.top - padding.bottom;

    ctx.fillStyle = "#f6f4f0";
    ctx.fillRect(0, 0, width, height);

    const elevs = points.map((p) => metersToFeet(p.ele));
    const minE = Math.min(...elevs);
    const maxE = Math.max(...elevs);
    const range = maxE - minE || 1;
    const pad = range * 0.1;

    const dists = distsRef.current;
    const total = dists[dists.length - 1];

    const xScale = (d: number) => padding.left + (d / total) * plotW;
    const yScale = (e: number) =>
      padding.top + plotH - ((e - (minE - pad)) / (range + 2 * pad)) * plotH;

    ctx.strokeStyle = "rgba(0,0,0,0.05)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 3; i++) {
      const e = minE - pad + ((range + 2 * pad) * i) / 3;
      const y = yScale(e);
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.font = "9px monospace";
      ctx.textAlign = "right";
      ctx.fillText(`${Math.round(e)}`, padding.left - 5, y + 3);
    }

    const grad = ctx.createLinearGradient(0, padding.top, 0, padding.top + plotH);
    grad.addColorStop(0, "rgba(0,0,0,0.10)");
    grad.addColorStop(1, "rgba(0,0,0,0.01)");
    ctx.beginPath();
    ctx.moveTo(xScale(0), yScale(elevs[0]));
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(xScale(dists[i]), yScale(elevs[i]));
    }
    ctx.lineTo(xScale(total), padding.top + plotH);
    ctx.lineTo(xScale(0), padding.top + plotH);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(xScale(0), yScale(elevs[0]));
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(xScale(dists[i]), yScale(elevs[i]));
    }
    ctx.strokeStyle = "rgba(0,0,0,0.6)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    const totalMi = metersToMiles(total);
    const maxLabels = Math.floor(plotW / 55);
    const niceIntervals = [0.5, 1, 2, 5, 10, 20, 50];
    const interval =
      niceIntervals.find((n) => n >= totalMi / maxLabels) || 50;
    for (let mi = 0; mi <= totalMi; mi += interval) {
      const d = mi / 0.000621371;
      const x = xScale(d);
      ctx.strokeStyle = "rgba(0,0,0,0.1)";
      ctx.beginPath();
      ctx.moveTo(x, padding.top + plotH);
      ctx.lineTo(x, padding.top + plotH + 4);
      ctx.stroke();
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.font = "9px monospace";
      ctx.textAlign = "center";
      ctx.fillText(`${mi}`, x, padding.top + plotH + 16);
    }
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.font = "8px monospace";
    ctx.textAlign = "right";
    ctx.fillText("mi", width - padding.right, padding.top + plotH + 16);

    if (hoverX !== null && hoverIdx !== null) {
      const hx = xScale(dists[hoverIdx]);
      const hy = yScale(elevs[hoverIdx]);
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = "rgba(0,0,0,0.3)";
      ctx.beginPath();
      ctx.moveTo(hx, padding.top);
      ctx.lineTo(hx, padding.top + plotH);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(hx, hy, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#000";
      ctx.fill();

      const tip = `${elevs[hoverIdx].toFixed(0)} ft  ${metersToMiles(
        dists[hoverIdx]
      ).toFixed(2)} mi`;
      ctx.font = "bold 10px monospace";
      const tw = ctx.measureText(tip).width + 12;
      const tx = Math.min(Math.max(hx - tw / 2, 2), width - tw - 2);
      const ty = Math.max(hy - 26, 2);
      ctx.fillStyle = "rgba(0,0,0,0.85)";
      ctx.beginPath();
      ctx.roundRect(tx, ty, tw, 18, 3);
      ctx.fill();
      ctx.fillStyle = "#f6f4f0";
      ctx.textAlign = "left";
      ctx.fillText(tip, tx + 6, ty + 13);
    }
  }, [points, width, hoverX, hoverIdx]);

  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const padding = { left: 42, right: 14 };
      const plotW = rect.width - padding.left - padding.right;
      const ratio = (x - padding.left) / plotW;
      if (ratio < 0 || ratio > 1) {
        setHoverX(null);
        setHoverIdx(null);
        onHover(null);
        return;
      }
      const dists = distsRef.current;
      const total = dists[dists.length - 1];
      const target = ratio * total;
      let lo = 0;
      let hi = dists.length - 1;
      while (lo < hi - 1) {
        const mid = (lo + hi) >> 1;
        if (dists[mid] < target) lo = mid;
        else hi = mid;
      }
      const idx =
        Math.abs(dists[lo] - target) < Math.abs(dists[hi] - target) ? lo : hi;
      setHoverX(x);
      setHoverIdx(idx);
      onHover(idx);
    },
    [onHover]
  );

  return (
    <div ref={containerRef} className="w-full border-t border-fg/10">
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: `${height}px`, display: "block", cursor: "crosshair" }}
        onMouseMove={handleMove}
        onMouseLeave={() => {
          setHoverX(null);
          setHoverIdx(null);
          onHover(null);
        }}
      />
    </div>
  );
}

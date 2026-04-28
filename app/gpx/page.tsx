"use client";

import { useState, useRef, useCallback } from "react";
import { parseGpx, type GpxData } from "@/lib/gpx";
import GpxViewer from "./viewer";

export default function GpxPage() {
  const [gpxData, setGpxData] = useState<GpxData | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        <GpxViewer gpxData={gpxData} onReset={() => setGpxData(null)} />
      )}
    </main>
  );
}

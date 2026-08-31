import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";
import { getAllRaces, getRace } from "@/lib/races";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Race route";

export async function generateStaticParams() {
  return getAllRaces().map((r) => ({ slug: r.slug }));
}

function readGpxPoints(gpxFile: string): { lat: number; lon: number }[] {
  try {
    const text = fs.readFileSync(
      path.join(process.cwd(), "public/race-routes", gpxFile),
      "utf-8"
    );
    const matches = [
      ...text.matchAll(/<trkpt\s+lat="([\d.-]+)"\s+lon="([\d.-]+)"/g),
    ];
    return matches.map((m) => ({
      lat: parseFloat(m[1]),
      lon: parseFloat(m[2]),
    }));
  } catch {
    return [];
  }
}

function buildRoutePath(
  points: { lat: number; lon: number }[],
  boxW: number,
  boxH: number,
  padding: number
): string | null {
  if (points.length < 2) return null;

  const step = Math.max(1, Math.floor(points.length / 1000));
  const sampled = points.filter((_, i) => i % step === 0);

  const mercY = (lat: number) =>
    Math.log(Math.tan(Math.PI / 4 + ((lat * Math.PI) / 180) / 2));

  const xs = sampled.map((p) => (p.lon * Math.PI) / 180);
  const ys = sampled.map((p) => mercY(p.lat));
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const w = maxX - minX;
  const h = maxY - minY;
  if (w === 0 || h === 0) return null;

  const innerW = boxW - 2 * padding;
  const innerH = boxH - 2 * padding;
  const scale = Math.min(innerW / w, innerH / h);
  const drawnW = w * scale;
  const drawnH = h * scale;
  const offX = padding + (innerW - drawnW) / 2;
  const offY = padding + (innerH - drawnH) / 2;

  const coords = sampled.map((_, i) => {
    const x = offX + (xs[i] - minX) * scale;
    const y = offY + (maxY - ys[i]) * scale;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return `M ${coords.join(" L ")}`;
}

function firstImageFromMarkdown(slug: string): string | null {
  try {
    const md = fs.readFileSync(
      path.join(process.cwd(), "content/races", `${slug}.md`),
      "utf-8"
    );
    const m = md.match(/!\[[^\]]*\]\(([^)]+)\)/);
    return m ? m[1] : null;
  } catch {
    return null;
  }
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const race = await getRace(slug);

  const bg = "#fafaf9";
  const fg = "#1a1a1a";

  const points = race.gpx ? readGpxPoints(race.gpx) : [];
  const routePath = buildRoutePath(points, size.width, size.height, 80);

  const fallbackImg = !routePath ? firstImageFromMarkdown(slug) : null;
  let fallbackSrc: string | null = null;
  if (fallbackImg) {
    try {
      const filePath = path.join(process.cwd(), "public", fallbackImg);
      const buf = fs.readFileSync(filePath);
      const ext = path.extname(filePath).slice(1).toLowerCase();
      const mime = ext === "png" ? "image/png" : "image/jpeg";
      fallbackSrc = `data:${mime};base64,${buf.toString("base64")}`;
    } catch {
      fallbackSrc = null;
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: bg,
          color: fg,
          position: "relative",
        }}
      >
        {routePath ? (
          <svg
            width={size.width}
            height={size.height}
            viewBox={`0 0 ${size.width} ${size.height}`}
            style={{ position: "absolute", top: 0, left: 0 }}
          >
            <path
              d={routePath}
              fill="none"
              stroke={fg}
              strokeWidth={6}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.85}
            />
          </svg>
        ) : fallbackSrc ? (
          <img
            src={fallbackSrc}
            alt=""
            width={size.width}
            height={size.height}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.55)",
            }}
          />
        ) : null}

        <div
          style={{
            position: "absolute",
            left: 60,
            bottom: 50,
            display: "flex",
            flexDirection: "column",
            color: fallbackSrc && !routePath ? bg : fg,
          }}
        >
          <div
            style={{
              fontSize: 76,
              fontWeight: 700,
              letterSpacing: -1.5,
              lineHeight: 1,
            }}
          >
            {race.title}
          </div>
          <div
            style={{
              fontSize: 28,
              marginTop: 18,
              opacity: 0.7,
              display: "flex",
              gap: 18,
            }}
          >
            <span>{race.date}</span>
            <span>·</span>
            <span>{race.distance}</span>
            <span>·</span>
            <span>{race.time}</span>
            {race.elevation ? (
              <>
                <span>·</span>
                <span>{race.elevation} gain</span>
              </>
            ) : null}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            right: 60,
            top: 50,
            fontSize: 22,
            opacity: 0.55,
            color: fallbackSrc && !routePath ? bg : fg,
          }}
        >
          hamiltonevans.com
        </div>
      </div>
    ),
    { ...size }
  );
}

export interface GpxPoint {
  lat: number;
  lon: number;
  ele: number;
  time?: string;
}

export interface Waypoint {
  lat: number;
  lon: number;
  name: string;
  distanceAlongRoute: number;
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

export interface GpxData {
  name: string;
  points: GpxPoint[];
  waypoints: Waypoint[];
  totalDistance: number;
  elevationGain: number;
  elevationLoss: number;
  minEle: number;
  maxEle: number;
}

export function haversine(
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

export function metersToMiles(m: number): number {
  return m * 0.000621371;
}

export function metersToFeet(m: number): number {
  return m * 3.28084;
}

export function parseGpx(xml: string): GpxData {
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
    cumDists.push(
      cumDists[i - 1] + haversine(prev.lat, prev.lon, curr.lat, curr.lon)
    );
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

  return {
    name,
    points,
    waypoints,
    totalDistance,
    elevationGain,
    elevationLoss,
    minEle,
    maxEle,
  };
}

export function computeSegments(
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

import stations from "../data/output.json";
import { renderPage } from "./page";

const TABLE_URL =
  "https://provoz.spravazeleznic.cz/Tabule/Pages/StationTable.aspx?Key=";

function getClosestStation(lat: number, lon: number) {
  // Equirectangular approximation — accurate enough at country scale
  const cosLat = Math.cos((lat * Math.PI) / 180);
  let closest = stations[0];
  let closestDistance = Infinity;

  for (const station of stations) {
    const dLat = station.lat - lat;
    const dLon = (station.lon - lon) * cosLat;
    const distance = dLat * dLat + dLon * dLon;
    if (distance < closestDistance) {
      closest = station;
      closestDistance = distance;
    }
  }

  return closest;
}

function parseCoords(lat: unknown, lon: unknown) {
  if (lat == null || lat === "" || lon == null || lon === "") return null;
  const la = Number(lat);
  const lo = Number(lon);
  if (!Number.isFinite(la) || !Number.isFinite(lo)) return null;
  if (Math.abs(la) > 90 || Math.abs(lo) > 180) return null;
  return { lat: la, lon: lo };
}

function redirect(location: string) {
  return new Response(null, {
    status: 302,
    headers: { Location: location, "Cache-Control": "no-store" },
  });
}

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/nearest") {
      const coords = parseCoords(
        url.searchParams.get("lat"),
        url.searchParams.get("lon"),
      );
      if (!coords) return new Response("Bad coordinates", { status: 400 });
      return redirect(TABLE_URL + getClosestStation(coords.lat, coords.lon).id);
    }

    if (url.pathname !== "/") {
      return new Response("Not found", { status: 404 });
    }

    const id = url.searchParams.get("id");
    if (id) {
      return redirect(TABLE_URL + encodeURIComponent(id));
    }

    const coords = parseCoords(request.cf?.latitude, request.cf?.longitude);
    const station = coords ? getClosestStation(coords.lat, coords.lon) : null;

    return new Response(
      renderPage(station, station ? TABLE_URL + station.id : null),
      {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store",
        },
      },
    );
  },
} satisfies ExportedHandler<Env>;

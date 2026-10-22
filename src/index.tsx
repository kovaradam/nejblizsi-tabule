import stations from "../data/output.json";
import { Hono } from "hono";
import { Page } from "./page";

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

const app = new Hono<{ Bindings: Env }>();

app.use(async (c, next) => {
  await next();
  c.header("Cache-Control", "no-store");
});

app.get("/", (c) => {
  const id = c.req.query("id");
  if (id) return c.redirect(TABLE_URL + encodeURIComponent(id));

  const cf = c.req.raw.cf;
  const coords = parseCoords(cf?.latitude, cf?.longitude);
  const station = coords ? getClosestStation(coords.lat, coords.lon) : null;

  return c.html(
    <Page station={station} href={station ? TABLE_URL + station.id : null} />,
  );
});

app.get("/nearest", (c) => {
  const coords = parseCoords(c.req.query("lat"), c.req.query("lon"));
  if (!coords) return c.text("Bad coordinates", 400);
  return c.redirect(TABLE_URL + getClosestStation(coords.lat, coords.lon).id);
});

app.get("/api/nearest", (c) => {
  const coords = parseCoords(c.req.query("lat"), c.req.query("lon"));
  if (!coords) return c.json({ error: "Bad coordinates" }, 400);
  const station = getClosestStation(coords.lat, coords.lon);
  return c.json({ name: station.name, href: TABLE_URL + station.id });
});

export default app;

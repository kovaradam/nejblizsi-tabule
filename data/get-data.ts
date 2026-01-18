"use cache";

import fs from "fs";
import { fileURLToPath } from "url";
import * as cheerio from "cheerio";

import path from "path";

export type Station = {
  name: string;
  id: string;
  lat: number;
  lon: number;
};

function relativePath(filename: string) {
  return path.join(fileURLToPath(import.meta.url), "..", filename);
}

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

export async function getStations() {
  // data indexing from https://provoz.spravazeleznic.cz/tabule/Pages/StationList.aspx
  const pages = Promise.all(
    [
      "A",
      "B",
      "C",
      "Č",
      "D",
      "E",
      "F",
      "G",
      "H",
      "CH",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "R",
      "Ř",
      "S",
      "Š",
      "T",
      "U",
      "Ú",
      "V",
      "Z",
      "Ž",
    ].flatMap(async (key) => {
      const url = `https://provoz.spravazeleznic.cz/tabule/Pages/StationList.aspx?Key=${key}`;
      const html = await (await fetch(url)).text();
      return html;
    }),
  );

  const stations = (await pages).flatMap((html) => {
    const $ = cheerio.load(html);

    return $.extract({
      links: [
        {
          selector:
            "#OGMainContent_BFLStations [href^='StationTable.aspx?Key=']",
          value: (el) => {
            const href = $(el).attr("href");

            return {
              name: $(el).text(),
              id: href?.replace("StationTable.aspx?Key=", ""),
            };
          },
        },
      ],
    }).links;
  });

  return stations.filter(
    (station, index, array) =>
      station.id && array.findIndex((s) => s.id === station.id) === index,
  );
}

export async function getData() {
  if (fs.existsSync(relativePath("output.json"))) {
    return JSON.parse(
      fs.readFileSync(relativePath("output.json"), "utf8"),
    ) as Station[];
  }

  let stations;
  try {
    stations = JSON.parse(
      fs.readFileSync(relativePath("stations.json"), "utf8"),
    );
  } catch {
    stations = await getStations();
    fs.writeFileSync(relativePath("stations.json"), JSON.stringify(stations));
  }

  const overpassQuery = `
[out:json][timeout:120];
area["name"="Česko"]["admin_level"="2"]->.cz;
(
  node["railway"~"station|halt|stop"](area.cz);
  way["railway"~"station|halt|stop"](area.cz);
);
out center tags;
`;

  let overpassData;

  try {
    overpassData = JSON.parse(
      fs.readFileSync(relativePath("overpass.json"), "utf8"),
    );
  } catch {
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: overpassQuery,
    });
    overpassData = await res.json();
    fs.writeFileSync(
      relativePath("overpass.json"),
      JSON.stringify(overpassData),
    );
  }

  const osm = overpassData.elements
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((e: any) => e.tags?.name)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((e: any) => ({
      name: e.tags.name,
      key: normalize(e.tags.name),
      lat: e.lat ?? e.center?.lat,
      lon: e.lon ?? e.center?.lon,
    }));

  const rows = stations
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((station: any) => {
      const key = normalize(station.name);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const match = osm.find((s: any) => s.key === key);

      if (!match) {
        console.warn(`No match for station ${station.name}`);
        return null;
      }

      if (typeof match.lat !== "number" || typeof match.lon !== "number") {
        console.warn(`Missing coordinates for station ${station.name}`);
        return null;
      }

      return {
        name: station.name,
        id: station.id,
        lat: match?.lat ?? null,
        lon: match?.lon ?? null,
      };
    })
    .filter(Boolean);

  fs.writeFileSync(relativePath("output.json"), JSON.stringify(rows));

  return rows as Station[];
}
// const csv = [
//   "name,id,lat,lon",
//   ...rows.map((r) => `"${r.name}",${r.id},${r.lat},${r.lon}`),
// ].join("\n");

// fs.writeFileSync(relativePath("stations.csv"), csv);

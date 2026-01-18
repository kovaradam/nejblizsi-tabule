"use cache";
import fs from "fs";

export async function getStations() {
  return JSON.parse(
    fs.readFileSync("data/stations.json", { encoding: "utf-8" }),
  ) as {
    name: string;
    id: number;
    lat: number;
    lon: number;
  }[];
}

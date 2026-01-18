import { Station } from "@/data/get-data";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function stationHref(station: Station) {
  return `/?id=${station.id}`;
}

import { Station } from "./get-data";

export function getClosestStation(
  position: GeolocationPosition,
  stations: Station[],
) {
  return stations.reduce(
    (closest, station) => {
      const distance = Math.sqrt(
        Math.pow(station.lat - position.coords.latitude, 2) +
          Math.pow(station.lon - position.coords.longitude, 2),
      );
      return distance < closest?.distance ? { station, distance } : closest;
    },
    { station: null as Station | null, distance: Infinity },
  ).station;
}

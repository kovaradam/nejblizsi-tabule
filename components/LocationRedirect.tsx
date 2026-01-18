"use client";
import { getClosestStation } from "@/data/get-closest-station";
import { Station } from "@/data/get-data";
import { getLocationFromNavigator } from "@/lib/get-logation-navigator";
import { stationHref } from "@/lib/utils";
import { useRouter } from "next/navigation";
import React from "react";

const locationPromise = getLocationFromNavigator();

export function LocationRedirect(props: { stations: Station[] }) {
  const router = useRouter();

  const location = React.use(locationPromise);

  const event = React.useEffectEvent(() => {
    if (location) {
      const station = getClosestStation(location, props.stations);
      if (station) {
        router.push(stationHref(station));
      }
    }
  });

  React.useEffect(() => event(), []);

  return null;
}

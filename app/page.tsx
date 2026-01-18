import { StationsCommand } from "@/components/StationsCommand";
import { getData } from "@/data/get-data";
import { TableIframe } from "@/components/TableIframe";
import { LocationRedirect } from "@/components/LocationRedirect";
import { getLocationFromIp } from "@/lib/get-location-from-ip";
import React from "react";
import { Spinner } from "@/components/ui/spinner";

export default async function Home({ searchParams }: PageProps<"/">) {
  const stations = await getData();
  const stationId = (await searchParams)?.id;
  // const location = await getLocationFromIp();

  return (
    <div className="">
      <LocationRedirect stations={stations} />
      <main className="">
        {/*<header>
            <StationsCommand stations={stations} />
          </header>*/}
        <div>
          {typeof stationId === "string" && <TableIframe id={stationId} />}
        </div>
      </main>
    </div>
  );
}

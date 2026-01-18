"use client";

import { redirect } from "next/navigation";

export function TableIframe(props: { id: string }) {
  return redirect(
    `https://provoz.spravazeleznic.cz/Tabule/Pages/StationTable.aspx?Key=${props.id}`,
  );
  return (
    <iframe
      width={"100%"}
      height={1000}
      src={`https://provoz.spravazeleznic.cz/Tabule/Pages/StationTable.aspx?Key=${props.id}`}
    />
  );
}

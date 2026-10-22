import { raw } from "hono/html";
import clientScript from "./geolocation.client.js";
import styles from "./styles.css";

const STATION_LIST_URL =
  "https://provoz.spravazeleznic.cz/tabule/Pages/StationList.aspx";

const externalIcon = (
  <svg
    style="width: 1.5ex;"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M7 7h10v10" />
    <path d="M7 17 17 7" />
  </svg>
);
export function Page(props: {
  station: { name: string } | null;
  href: string | null;
}) {
  const { station, href } = props;

  return (
    <>
      {raw("<!doctype html>")}
      <html lang="cs">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta
            name="description"
            content="Stránka najde odkaz na nejbližší vlakovou tabuli ze seznamu stanic
          na provoz.spravazeleznic.cz . Dostanete se tak k
          aktuálním informacím na online tabulích bez hledání v
          seznamu."
          />
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
          <title>Nejbližší vlaková tabule</title>
          <style dangerouslySetInnerHTML={{ __html: styles }} />
        </head>
        <body>
          <main>
            <h1 class="table" style={"grid-template-columns: 1fr 1fr 1fr;"}>
              {["Nejbližší", "", "", "", "vlaková", "", "", "", "tabule"].map(
                (cell) => (
                  <span class="table-cell">{cell}</span>
                ),
              )}
            </h1>
            <div style={"height: 10rem;"}>
              <div id="status">
                {station && href ? (
                  <a href={href} style={"color:var(--fg)"}>
                    Přejít na tabuli <strong>{station.name}</strong>{" "}
                    {externalIcon}
                  </a>
                ) : (
                  "Polohu se nepodařilo určit z IP adresy."
                )}
              </div>
              <div id="precise-location">
                <p style="color: var(--muted); margin: 0.7rem 0;">nebo</p>
                <p>
                  <button id="precise" type="button">
                    Použít přesnou polohu
                  </button>
                </p>
              </div>
            </div>
            <div id="description" style="margin-top:3rem">
              <h2>Co to dělá?</h2>
              <p>
                Stránka najde odkaz na nejbližší vlakovou tabuli ze seznamu
                stanic na{" "}
                <span style={"white-space:nowrap;"}>
                  <a href={STATION_LIST_URL}>
                    provoz.spravazeleznic.cz {externalIcon}
                  </a>
                  .
                </span>{" "}
                Dostanete se tak k aktuálním informacím na online tabulích bez
                hledání v seznamu.
              </p>
            </div>
          </main>
          <script dangerouslySetInnerHTML={{ __html: clientScript }} />
        </body>
      </html>
    </>
  );
}

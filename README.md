# Nejbližší vlaková tabule

Worker that serves page with link to the departures board of the nearest Czech train station.

Data is collected by scraping each train station name from [provoz.spravazeleznic.cz](https://provoz.spravazeleznic.cz/tabule/Pages/StationList.aspx) and matching it with coordinates from overpass api.

- `/` — page linking to the station closest to the visitor's IP location, with action for fetching nearest station by devices location.
- `/nearest?lat=<lat>&lon=<lon>` — redirects to the station closest to the given coordinates
- `/api/nearest?lat=<lat>&lon=<lon>` — JSON `{ name, href }` for the closest station (used by the page)
- `/?id=<key>` — redirects straight to the board for that station key

Station data lives in `data/output.json`. To regenerate it, delete the file and run `pnpm update-data`.

```sh
pnpm dev      # local dev
pnpm deploy   # deploy to Cloudflare
```

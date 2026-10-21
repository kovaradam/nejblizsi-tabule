# nejblizsi-tabule

Cloudflare Worker that redirects to the departures board of the nearest Czech train station.

- `/` — page that redirects (after 3 s) to the station closest to the visitor's IP location (`request.cf.latitude` / `longitude`). It offers a "Použít přesnou polohu" button to use the device location instead, and uses it automatically if location access was already granted
- `/nearest?lat=<lat>&lon=<lon>` — redirects to the station closest to the given coordinates
- `/?id=<key>` — redirects straight to the board for that station key

Station data lives in `data/output.json` (scraped from provoz.spravazeleznic.cz, then matched to OSM coordinates). To regenerate it, delete the file and run `pnpm update-data`.

```sh
pnpm dev      # local dev
pnpm deploy   # deploy to Cloudflare
```

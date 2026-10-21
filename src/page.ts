type Station = { name: string; id: string };

const REDIRECT_DELAY_MS = 3000;

function escapeHtml(s: string) {
  return s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
}

export function renderPage(station: Station | null, href: string | null) {
  const status = station
    ? `Přesměrovávám na <strong>${escapeHtml(station.name)}</strong>…`
    : "Polohu se nepodařilo určit z IP adresy.";

  return `<!doctype html>
<html lang="cs">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Nejbližší tabule</title>
${href ? `<noscript><meta http-equiv="refresh" content="0;url=${escapeHtml(href)}"></noscript>` : ""}
<style>
  :root { color-scheme: light dark; --fg: #111; --bg: #fff; --muted: #666; --accent: #0057b8; }
  @media (prefers-color-scheme: dark) { :root { --fg: #eee; --bg: #111; --muted: #999; --accent: #5ea2ff; } }
  body { margin: 0; min-height: 100vh; display: grid; place-items: center; font: 16px/1.5 system-ui, sans-serif; color: var(--fg); background: var(--bg); }
  main { padding: 24px; max-width: 28rem; text-align: center; }
  p { margin: 0 0 16px; }
  #hint { color: var(--muted); font-size: 14px; min-height: 1.5em; }
  button { font: inherit; padding: 10px 18px; border: 0; border-radius: 8px; background: var(--accent); color: #fff; cursor: pointer; }
  button:disabled { opacity: .6; cursor: default; }
  a { color: var(--accent); }
</style>
</head>
<body>
<main>
  <p id="status">${status}</p>
  <p id="hint"></p>
  <p><button id="precise" type="button">Použít přesnou polohu</button></p>
  <p><a href="https://provoz.spravazeleznic.cz/tabule/Pages/StationList.aspx">Seznam všech stanic</a></p>
</main>
<script>
(() => {
  const fallback = ${JSON.stringify(href)};
  const status = document.getElementById("status");
  const hint = document.getElementById("hint");
  const button = document.getElementById("precise");
  let timer = null;

  function startCountdown() {
    if (!fallback) return;
    let left = ${REDIRECT_DELAY_MS / 1000};
    hint.textContent = "za " + left + " s";
    timer = setInterval(() => {
      left -= 1;
      if (left > 0) { hint.textContent = "za " + left + " s"; return; }
      clearInterval(timer);
      location.replace(fallback);
    }, 1000);
  }

  function usePreciseLocation() {
    clearInterval(timer);
    button.disabled = true;
    status.textContent = "Zjišťuji polohu…";
    hint.textContent = "";
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        location.replace("/nearest?lat=" + latitude + "&lon=" + longitude);
      },
      () => {
        button.disabled = false;
        if (fallback) {
          status.textContent = "Přesnou polohu se nepodařilo získat, použiji přibližnou.";
          startCountdown();
        } else {
          status.textContent = "Přesnou polohu se nepodařilo získat.";
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  }

  if (!("geolocation" in navigator)) {
    button.hidden = true;
    startCountdown();
    return;
  }

  button.addEventListener("click", usePreciseLocation);

  // If the user already granted location access, use it right away.
  (navigator.permissions
    ? navigator.permissions.query({ name: "geolocation" }).then((p) => p.state, () => null)
    : Promise.resolve(null)
  ).then((state) => (state === "granted" ? usePreciseLocation() : startCountdown()));
})();
</script>
</body>
</html>`;
}

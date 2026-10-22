// @ts-check
(() => {
  const preciseLocation = document.getElementById("precise-location");
  const button = document.getElementById("precise");
  const status = document.getElementById("status");
  if (
    !button ||
    !(button instanceof HTMLButtonElement) ||
    !(preciseLocation instanceof HTMLElement) ||
    !status
  ) {
    return;
  }

  if (!("geolocation" in navigator)) {
    preciseLocation.hidden = true;
    return;
  }

  const originalStatus = status.innerHTML;

  // Resolve the nearest station in place and offer a link to it instead of
  // redirecting away.
  function showNearestLink() {
    function fail() {
      status.removeAttribute("aria-busy");
      status.innerHTML = originalStatus;
      preciseLocation.hidden = false;
      button.textContent = "Polohu se nepodařilo získat, zkusit znovu";
      // Focus was lost when the button got hidden; return it so the error is announced.
      button.focus();
    }

    preciseLocation.hidden = true;
    // Only animate swaps made from here on, not the server-rendered state.
    status.classList.add("animate");
    status.setAttribute("aria-busy", "true");
    status.innerHTML =
      '<span><span class="spinner" aria-hidden="true"></span>Hledám nejbližší stanici…</span>';

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        fetch("/api/nearest?lat=" + latitude + "&lon=" + longitude)
          .then((res) => (res.ok ? res.json() : Promise.reject()))
          .then((/** @type {{ name: string, href: string }} */ station) => {
            const link = document.createElement("a");
            link.className = "button";
            link.href = station.href;
            const name = document.createElement("strong");
            name.textContent = station.name;
            link.append("Přejít na tabuli ", name);
            status.removeAttribute("aria-busy");
            status.replaceChildren(link);
            link.focus();
          })
          .catch(fail);
      },
      fail,
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  }

  button.addEventListener("click", showNearestLink);

  navigator.permissions
    ?.query({ name: "geolocation" })
    .then((p) => p.state === "granted" && showNearestLink(), () => {});
})();

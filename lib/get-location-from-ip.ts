import { headers } from "next/headers";

export const getLocationFromIp = async () => {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (!ip) {
    return null;
  }

  const res = await fetch(`https://ipapi.co/${ip}/json/`);
  const data = await res.json();

  if (data.error) {
    return null;
  }

  return data;
};

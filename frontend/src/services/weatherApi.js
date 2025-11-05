const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in ms

// Backend base URL:
const BACKEND_BASE =
  import.meta.env.VITE_API_BASE ??
  (window.location.hostname === "localhost" &&
  window.location.port &&
  window.location.port !== "8080"
    ? "http://localhost:8080"
    : "");

function url(path) {
  return BACKEND_BASE ? `${BACKEND_BASE}${path}` : path;
}

export async function getCities(token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch(url("/api/weather/cities"), { headers });
  if (!res.ok) throw new Error("Failed to load cities");
  return res.json();
}

export async function getWeather(cityId, token) {
  const key = `weather_${cityId}`;
  try {
    const cached = sessionStorage.getItem(key);
    if (cached) {
      const obj = JSON.parse(cached);
      if (Date.now() - obj.t < CACHE_TTL) {
        return { data: obj.data, fetchedAt: obj.t };
      }
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("Cache read error:", error);
    }
  }

  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch(url(`/api/weather/${cityId}`), { headers });
  if (!res.ok) throw new Error("Failed to load weather for " + cityId);
  const data = await res.json();
  try {
    const now = Date.now();
    sessionStorage.setItem(key, JSON.stringify({ t: now, data }));
    return { data, fetchedAt: now };
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("Cache write error:", error);
    }
  }
  return { data, fetchedAt: Date.now() };
}

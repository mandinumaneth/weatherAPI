import { useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import WeatherCard from "./components/WeatherCard";
import WeatherDetailModal from "./components/WeatherDetailModal";
import { getCities, getWeather } from "./services/weatherApi";

export default function App() {
  const [cityIds, setCityIds] = useState([]);
  const [weathers, setWeathers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedWeather, setSelectedWeather] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const ids = await getCities();
        if (!mounted) return;
        setCityIds(ids || []);

        // fetch weather for each city in parallel but limit slightly by mapping
        const promises = (ids || []).map((id) =>
          getWeather(id).catch((e) => ({ _error: true, message: e.message }))
        );
        const results = await Promise.all(promises);
        if (!mounted) return;
        setWeathers(results);

        // Set last updated time from first successful result
        const firstValid = results.find((r) => r && !r._error && r.fetchedAt);
        if (firstValid) {
          setLastUpdated(firstValid.fetchedAt);
        }
      } catch (e) {
        setError(e.message || String(e));
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div
      className="min-h-screen bg-center bg-fixed relative flex flex-col"
      style={{
        backgroundImage: "url('/background.png')",
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header lastUpdated={lastUpdated} />

        <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 flex-grow">
          {loading && (
            <div className="text-center py-12 sm:py-16 md:py-20 text-white text-base sm:text-lg">
              Loading weather data…
            </div>
          )}

          {error && (
            <div className="text-red-300 bg-red-900/30 p-3 sm:p-4 rounded-lg backdrop-blur text-sm sm:text-base">
              Error: {error}
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {weathers && weathers.length > 0 ? (
                weathers.map((w, idx) =>
                  w && w._error ? (
                    <div
                      key={`err-${idx}`}
                      className="bg-red-500/20 backdrop-blur p-4 rounded-lg text-sm text-red-200"
                    >
                      Failed: {w.message}
                    </div>
                  ) : (
                    <WeatherCard
                      key={cityIds[idx] || idx}
                      data={w.data}
                      fetchedAt={w.fetchedAt}
                      onClick={() => setSelectedWeather(w.data)}
                    />
                  )
                )
              ) : (
                <div className="text-gray-300">No cities available</div>
              )}
            </div>
          )}
        </main>

        <Footer />
      </div>

      {/* Weather Detail Modal */}
      {selectedWeather && (
        <WeatherDetailModal
          data={selectedWeather}
          onClose={() => setSelectedWeather(null)}
        />
      )}
    </div>
  );
}

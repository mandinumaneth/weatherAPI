import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import WeatherCard from "./components/WeatherCard";
import WeatherDetailModal from "./components/WeatherDetailModal";
import LoginButton from "./components/LoginButton";
import LogoutButton from "./components/LogoutButton";
import { getCities, getWeather } from "./services/weatherApi";

export default function App() {
  const {
    isLoading: authLoading,
    isAuthenticated,
    getAccessTokenSilently,
  } = useAuth0();
  const [cityIds, setCityIds] = useState([]);
  const [weathers, setWeathers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedWeather, setSelectedWeather] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || authLoading) {
      setLoading(false);
      return;
    }

    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        // Get access token
        const token = await getAccessTokenSilently();

        const ids = await getCities(token);
        if (!mounted) return;
        setCityIds(ids || []);

        // fetch weather for each city in parallel but limit slightly by mapping
        const promises = (ids || []).map((id) =>
          getWeather(id, token).catch((e) => ({
            _error: true,
            message: e.message,
          }))
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
  }, [isAuthenticated, authLoading, getAccessTokenSilently]);

  // Show loading screen while Auth0 is initializing
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen bg-center bg-fixed relative flex flex-col items-center justify-center"
        style={{
          backgroundImage: "url('/background.png')",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl text-center max-w-md">
          <div className="flex flex-col items-center mb-6">
            <img
              src="/logo.png"
              alt="Weather App Logo"
              className="w-20 h-20 object-contain mb-4 filter drop-shadow-2xl"
            />
            <h1 className="text-4xl font-bold text-white">Weather App</h1>
          </div>
          <p className="text-white/80 mb-8">
            Please log in to view weather information
          </p>
          <LoginButton />
        </div>
      </div>
    );
  }

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
        <Header lastUpdated={lastUpdated}>
          <LogoutButton />
        </Header>

        <main className="container mx-auto max-w-7xl px-3 sm:px-4 py-4 sm:py-6 md:py-8 flex-grow">
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

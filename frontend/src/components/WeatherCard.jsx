export default function WeatherCard({ data, fetchedAt, onClick }) {
  if (!data) return null;

  function timeAgo(ts) {
    if (!ts) return "";
    const delta = Math.floor((Date.now() - ts) / 1000);
    let relative;
    if (delta < 60) {
      relative = `${delta}s ago`;
    } else if (delta < 3600) {
      relative = `${Math.floor(delta / 60)}m ago`;
    } else if (delta < 86400) {
      relative = `${Math.floor(delta / 3600)}h ago`;
    } else {
      relative = `${Math.floor(delta / 86400)}d ago`;
    }
    return relative;
  }

  // Predefined color palette for weather cards
  const colors = ["#388ee7", "#de944e", "#6249cc", "#40b681", "#9c3a3a"];

  // Map weather descriptions to specific colors from the palette
  function getColor(description) {
    const desc = (description || "").toLowerCase();
    if (desc.includes("clear")) return colors[3]; // #40b681 - green
    if (desc.includes("cloud")) return colors[0]; // #388ee7 - blue
    if (desc.includes("rain") || desc.includes("drizzle")) return colors[1]; // #de944e - orange
    if (desc.includes("snow")) return colors[2]; // #6249cc - purple
    if (desc.includes("mist") || desc.includes("fog")) return colors[0]; // #388ee7 - blue
    if (desc.includes("thunder")) return colors[4]; // #9c3a3a - red
    return colors[0]; // default - blue
  }

  // Map weather descriptions to emoji icons
  function getWeatherIcon(description) {
    const desc = (description || "").toLowerCase();
    if (desc.includes("clear")) return "☀️";
    if (desc.includes("few clouds")) return "🌤️";
    if (desc.includes("cloud")) return "☁️";
    if (desc.includes("rain")) return "🌧️";
    if (desc.includes("drizzle")) return "🌦️";
    if (desc.includes("snow")) return "❄️";
    if (desc.includes("mist") || desc.includes("fog")) return "🌫️";
    if (desc.includes("thunder")) return "⛈️";
    return "🌤️";
  }

  const cardColor = getColor(data.description);
  const icon = getWeatherIcon(data.description);

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer text-white"
      style={{ backgroundColor: cardColor }}
      onClick={onClick}
    >
      {/* Clouds background overlay */}
      <div
        className="absolute inset-0 opacity-95"
        style={{
          backgroundImage: "url('/clouds.png')",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      ></div>

      {/* City and Temperature */}
      <div className="relative z-10 flex items-start justify-between mb-3 md:mb-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold">{data.cityName}</h3>
        </div>
        <div className="text-3xl sm:text-4xl md:text-5xl font-bold">
          {Math.round(data.temperature)}°C
        </div>
      </div>

      {/* Weather Icon and Description */}
      <div className="relative z-10 flex items-center space-x-2 sm:space-x-3">
        <span className="text-3xl sm:text-4xl">{icon}</span>
        <div>
          <p className="text-base sm:text-lg font-medium capitalize">
            {data.description}
          </p>
        </div>
      </div>

      {/* Decorative background circles */}
      <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
      <div className="absolute -left-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
    </div>
  );
}

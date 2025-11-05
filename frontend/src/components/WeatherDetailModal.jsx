export default function WeatherDetailModal({ data, onClose }) {
  if (!data) return null;

  function formatTime(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

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

// Weather card colors
const colors = [
    "#388ee7", // Blue
    "#de944e", // Orange
    "#6249cc", // Purple
    "#40b681", // Green
    "#9c3a3a", // Red
];

  // Map weather descriptions to specific colors from the palette
  function getColor(description) {
    const desc = (description || "").toLowerCase();
    if (desc.includes("clear")) return colors[3]; // green
    if (desc.includes("cloud")) return colors[0]; // blue
    if (desc.includes("rain") || desc.includes("drizzle")) return colors[1]; // orange
    if (desc.includes("snow")) return colors[2]; // purple
    if (desc.includes("mist") || desc.includes("fog")) return colors[0]; // blue
    if (desc.includes("thunder")) return colors[4]; // red
    return colors[0]; // default - blue
  }

  const icon = getWeatherIcon(data.description);
  const cardColor = getColor(data.description);

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-5 sm:p-2"
      onClick={onClose}
    >
      <div
        className="rounded-2xl shadow-2xl max-w-2xl w-full text-white relative overflow-hidden max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: cardColor }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Clouds background overlay */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "url('/clouds.png')",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        ></div>

        {/* Header */}
        <div className="relative z-10 p-3 sm:p-4 text-center border-b border-white/20">
          <button
            onClick={onClose}
            className="absolute top-2 left-2 sm:top-3 sm:left-3 w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors text-xs sm:text-sm"
          >
            x
          </button>
          <h2 className="text-xl sm:text-2xl font-bold">{data.cityName}</h2>
          <p className="text-[10px] sm:text-xs opacity-90 mt-1">
            {new Date().toLocaleString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Main Temperature Section */}
        <div className="relative z-10 p-3 sm:p-4 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mb-2">
            <span className="text-4xl sm:text-5xl">{icon}</span>
            <div className="hidden sm:block border-l-2 border-white/30 h-16"></div>
            <div className="text-4xl sm:text-5xl font-bold">
              {Math.round(data.temperature)}°C
            </div>
          </div>
          <p className="text-sm sm:text-base capitalize mb-2 sm:mb-3">
            {data.description}
          </p>
          <div className="flex justify-center gap-4 sm:gap-6 text-[10px] sm:text-xs">
            <span>Temp Min: {Math.round(data.tempMin)}°c</span>
            <span>Temp Max: {Math.round(data.tempMax)}°c</span>
          </div>
        </div>

        {/* Additional Details */}
        <div
          className="relative z-10 backdrop-blur-sm p-3 sm:p-4 rounded-b-2xl"
          style={{ backgroundColor: "#383b47" }}
        >
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="text-center">
              <div className="text-[10px] sm:text-xs opacity-75">Humidity</div>
              <div className="text-sm sm:text-base font-semibold">
                {data.humidity}%
              </div>
            </div>
            <div className="text-center">
              <div className="text-[10px] sm:text-xs opacity-75">
                Wind Speed
              </div>
              <div className="text-sm sm:text-base font-semibold">
                {data.windSpeed.toFixed(1)}m/s
              </div>
            </div>
            <div className="text-center">
              <div className="text-[10px] sm:text-xs opacity-75">Sunrise</div>
              <div className="text-sm sm:text-base font-semibold">
                {formatTime(data.sunrise)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-[10px] sm:text-xs opacity-75">Sunset</div>
              <div className="text-sm sm:text-base font-semibold">
                {formatTime(data.sunset)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Header({ lastUpdated }) {
  function formatDateTime(ts) {
    if (!ts) return "";
    const date = new Date(ts);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <header className="relative py-6 md:py-10 text-white">
      <div className="container mx-auto px-4">
        {/* Last Updated Time - Top Right */}
        {lastUpdated && (
          <div className="absolute top-2 right-2 md:top-4 md:right-4 text-[10px] md:text-xs text-gray-300 bg-black/30 backdrop-blur-sm px-2 py-1 md:px-3 md:py-1.5 rounded-lg">
            <span className="hidden sm:inline">Last Updated: </span>
            <span className="sm:hidden">Updated: </span>
            {formatDateTime(lastUpdated)}
          </div>
        )}

        {/* Logo and Title - Center */}
        <div className="flex items-center justify-center space-x-2 md:space-x-4">
          <img
            src="/logo.png"
            alt="Weather App Logo"
            className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain filter drop-shadow-2xl"
          />
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold drop-shadow-2xl">
            Weather App
          </h1>
        </div>
      </div>
    </header>
  );
}

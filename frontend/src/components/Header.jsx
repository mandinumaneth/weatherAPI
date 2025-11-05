export default function Header({ lastUpdated, children }) {
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
        {/* Logout Button - Top Right */}
        {children && (
          <div className="absolute top-2 right-2 md:top-4 md:right-4 z-20">
            {children}
          </div>
        )}

        {/* Logo and Title - Center */}
        <div className="flex flex-col items-center justify-center space-y-3 pt-5 md:pt-0">
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

          {/* Last Updated Time - Below title on mobile, top left on desktop */}
          {lastUpdated && (
            <div className="text-[10px] md:text-xs text-gray-300 bg-black/30 backdrop-blur-sm px-2 py-1 md:px-3 md:py-1.5 rounded-lg md:absolute md:top-4 md:left-4">
              <span className="hidden sm:inline">Last Updated: </span>
              <span className="sm:hidden">Updated: </span>
              {formatDateTime(lastUpdated)}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

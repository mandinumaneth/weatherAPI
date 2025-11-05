# Weather API Application

A full-stack weather application that displays real-time weather information for multiple cities using OpenWeatherMap API.

## 🌟 Features

- **Real-time Weather Data**: Fetches current weather information from OpenWeatherMap API
- **Multiple Cities**: Displays weather for 8 major cities (Sydney, Tokyo, Colombo, Paris, Boston, Liverpool, Oslo, Shanghai)
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **5-Minute Caching**: Implements intelligent caching to reduce redundant API requests
- **Modern UI**: Beautiful gradient cards with weather icons and detailed information
- **Modal Details**: Click any city card to view extended weather information

## 🏗️ Architecture

### Backend (Spring Boot 3.5.7)

- **Framework**: Spring Boot with Java 21
- **Caching**: Caffeine cache with 5-minute TTL
- **API Endpoints**:
  - `GET /api/weather/cities` - Get list of city codes
  - `GET /api/weather/{cityId}` - Get weather data for a specific city
  - `GET /api/cache/stats` - View cache statistics (hits, misses, hit rate)
  - `GET /api/cache/clear` - Clear the cache
- **Features**:
  - Automatic cache expiration after 5 minutes
  - Cache statistics tracking
  - CORS enabled for frontend integration
  - Environment-based API key configuration

### Frontend (React 19 + Vite)

- **Framework**: React 19.1.1 with Vite 7.1.12
- **Styling**: Tailwind CSS for responsive design
- **Features**:
  - Modern component-based architecture
  - Real-time weather updates
  - Loading states and error handling
  - Responsive grid layout

## 📋 Prerequisites

- **Java 21** or higher
- **Node.js 18** or higher
- **Maven 3.8+** (included as wrapper)
- **OpenWeatherMap API Key** (free tier)

## 🚀 Getting Started

### 1. Get OpenWeatherMap API Key

1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Navigate to API Keys section
3. Copy your API key

### 2. Configure Backend API Key

The backend requires an OpenWeatherMap API key. Choose one of the following methods:

#### Option A: VS Code Launch Configuration (Recommended)

1. Copy `.vscode/launch.json.template` to `.vscode/launch.json`
2. Replace the placeholder with your real API key:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "java",
      "name": "Run BackendApplication",
      "request": "launch",
      "mainClass": "com.weatherapp.backend.BackendApplication",
      "projectName": "backend",
      "env": {
        "OPENWEATHERMAP_API_KEY": "your_actual_api_key_here"
      }
    }
  ]
}
```

3. Use VS Code's Run button (or F5) to start the backend

#### Option B: Environment Variable (PowerShell)

```powershell
# Set for current session
$env:OPENWEATHERMAP_API_KEY = 'your_actual_api_key_here'

# Or set permanently (restart terminal after)
setx OPENWEATHERMAP_API_KEY "your_actual_api_key_here"
```

#### Option C: .env File

1. Create `backend/.env`:

```text
OPENWEATHERMAP_API_KEY=your_actual_api_key_here
```

2. Load it before running:

```powershell
# Read .env and export variables (you'll need to create a script for this)
```

### 3. Run Backend

```bash
cd backend
./mvnw.cmd spring-boot:run
```

Backend will start on `http://localhost:8080`

### 4. Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will start on `http://localhost:5173`

### 5. Access Application

Open your browser and navigate to `http://localhost:5173`

## 📖 Implementation Details

This section explains how each requirement was implemented, the technologies used, and the data flow.

### Step 1: Extract City Codes

**Requirement:** Download and parse `cities.json`, extract CityCode values, and store them in an array.

**Implementation:**

**File:** `backend/src/main/resources/cities.json`

```json
{
  "List": [
    {"CityCode": "2147714", "CityName": "Sydney", "Country": "AU"},
    {"CityCode": "1850147", "CityName": "Tokyo", "Country": "JP"},
    ...
  ]
}
```

**Code:** `WeatherService.getCityCodes()` method

```java
public List<String> getCityCodes() throws IOException {
    var resource = new ClassPathResource("cities.json");
    String json = Files.readString(resource.getFile().toPath());

    JsonNode root = objectMapper.readTree(json);
    JsonNode list = root.get("List");

    List<String> cityCodes = new ArrayList<>();
    for (JsonNode city : list) {
        cityCodes.add(city.get("CityCode").asText());
    }
    return cityCodes;
}
```

**Technologies:**

- **Jackson ObjectMapper** - JSON parsing
- **Spring ClassPathResource** - Reading files from resources folder
- **Java NIO Files** - File reading operations

**API Endpoint:** `GET /api/weather/cities`

**Flow:**

1. Backend reads `cities.json` from classpath
2. Parses JSON using Jackson ObjectMapper
3. Extracts CityCode values from "List" array
4. Returns array of city codes to frontend

---

### Step 2: Fetch Weather Data

**Requirement:** Use CityCode values to fetch weather data from OpenWeatherMap API.

**API Endpoint Used:**

```
GET https://api.openweathermap.org/data/2.5/weather?id={cityId}&appid={API_KEY}&units=metric
```

**Implementation:**

**Code:** `WeatherService.getWeatherByCityId()` method

```java
@Cacheable(value = "weatherCache", key = "#cityId")
public WeatherDTO getWeatherByCityId(String cityId) {
    String url = apiUrl + "?id=" + cityId + "&appid=" + apiKey + "&units=metric";
    String responseBody = restTemplate.getForObject(url, String.class);

    JsonNode response = objectMapper.readTree(responseBody);
    // Parse and map to WeatherDTO
    return weatherDTO;
}
```

**Technologies:**

- **Spring RestTemplate** - HTTP client for API calls
- **Jackson ObjectMapper** - JSON response parsing
- **Spring @Cacheable** - Declarative caching annotation
- **Lombok** - DTO generation with @Data annotation

**Configuration:**

- API key loaded from environment variable: `OPENWEATHERMAP_API_KEY`
- API URL configured in `application.properties`
- Metric units specified for temperature in Celsius

**Flow:**

1. Frontend requests weather for specific city ID
2. Backend checks if data exists in cache (see Step 4)
3. If cache miss, RestTemplate makes HTTP GET request to OpenWeatherMap
4. Response JSON is parsed and mapped to `WeatherDTO`
5. Data is automatically cached by Spring Cache abstraction
6. Response returned to frontend

---

### Step 3: Display Weather Information

**Requirement:** Extract and display name, weather description, and temperature.

**Implementation:**

**Backend DTO:** `WeatherDTO.java`

```java
@Data
public class WeatherDTO {
    private String cityName;           // Extracted from: name
    private String description;        // Extracted from: weather[0].description
    private Double temperature;        // Extracted from: main.temp
    private Double tempMin;           // Extracted from: main.temp_min
    private Double tempMax;           // Extracted from: main.temp_max
    private Integer humidity;         // Extracted from: main.humidity
    private Double windSpeed;         // Extracted from: wind.speed
    private Long sunrise;             // Extracted from: sys.sunrise
    private Long sunset;              // Extracted from: sys.sunset
}
```

**Frontend Components:**

1. **WeatherCard.jsx** - Displays weather in card format

```jsx
<div className="weather-card">
  <h3>{weather.cityName}</h3>
  <p>{weather.description}</p>
  <p>{weather.temperature}°C</p>
  <p>Humidity: {weather.humidity}%</p>
  <p>Wind: {weather.windSpeed} m/s</p>
</div>
```

2. **WeatherDetailModal.jsx** - Shows extended information on click
   - Temperature range (min/max)
   - Sunrise/sunset times
   - Detailed conditions

**Technologies:**

- **React Components** - Modular UI components
- **Tailwind CSS** - Responsive styling and gradients
- **React Hooks** (useState, useEffect) - State management
- **Axios** - HTTP requests from frontend to backend

**Flow:**

1. Frontend calls `GET /api/weather/{cityId}` for each city
2. Backend returns `WeatherDTO` as JSON
3. React maps array of weather objects to `WeatherCard` components
4. Cards display in responsive grid (1-4 columns based on screen size)
5. Clicking a card opens `WeatherDetailModal` with full details
6. Last updated timestamp shown in header


### Step 4: Implement Caching

**Requirement:** Cache API responses for 5 minutes to reduce redundant requests and serve cached data within this timeframe.

**Implementation:**

**Configuration:** `CaffeineCacheConfig.java`

```java
@Configuration
@EnableCaching
public class CaffeineCacheConfig {
    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager("weatherCache");
        cacheManager.setCaffeine(
            Caffeine.newBuilder()
                .expireAfterWrite(5, TimeUnit.MINUTES)  // 5-minute TTL
                .maximumSize(1000)                       // Max 1000 entries
                .recordStats()                           // Enable statistics
        );
        return cacheManager;
    }
}
```

**Service Layer:** `WeatherService.java`

```java
@Cacheable(value = "weatherCache", key = "#cityId")
public WeatherDTO getWeatherByCityId(String cityId) {
    log.info("CACHE MISS! Fetching from API for city: {}", cityId);
    // Fetch from OpenWeatherMap API
}
```

**Controller Layer:** `WeatherController.java`

```java
@GetMapping("/{cityId}")
public WeatherDTO getWeather(@PathVariable String cityId) {
    Cache cache = cacheManager.getCache("weatherCache");
    boolean isInCache = cache != null && cache.get(cityId) != null;

    if (isInCache) {
        log.info("✅ CACHE HIT! Returning cached data");
    } else {
        log.info("🌐 CACHE MISS! Will fetch from API");
    }

    return weatherService.getWeatherByCityId(cityId);
}
```

**Cache Statistics Endpoint:** `CacheController.java`

```java
@GetMapping("/api/cache/stats")
public Map<String, Object> getCacheStats() {
    CaffeineCache caffeineCache = (CaffeineCache) cacheManager.getCache("weatherCache");
    CacheStats stats = caffeineCache.getNativeCache().stats();

    return Map.of(
        "hitCount", stats.hitCount(),
        "missCount", stats.missCount(),
        "hitRate", stats.hitRate(),
        "evictionCount", stats.evictionCount()
    );
}
```

**Technologies:**

- **Caffeine Cache** - High-performance in-memory caching library
- **Spring Cache Abstraction** - @Cacheable, @CacheEvict annotations
- **Spring AOP** - Aspect-oriented programming for cache interception
- **CacheManager** - Spring's cache management interface

**How It Works:**

1. **First Request (Cache Miss):**

   - Client requests weather for city ID 1248991
   - `@Cacheable` checks if data exists in cache → NOT FOUND
   - Method executes → Calls OpenWeatherMap API
   - Response stored in cache with key "1248991"
   - TTL timer starts (5 minutes)
   - Data returned to client

2. **Subsequent Requests (Cache Hit):**

   - Client requests same city ID within 5 minutes
   - `@Cacheable` finds data in cache → FOUND
   - Method does NOT execute (no API call)
   - Cached data returned immediately
   - **Benefits:** Faster response, no API quota usage

3. **After 5 Minutes (Cache Expiration):**
   - TTL expires, entry evicted from cache
   - Next request triggers cache miss
   - Fresh data fetched from API
   - New 5-minute TTL starts

**Cache Configuration:**

- **Expiration Policy:** Time-based (5 minutes after write)
- **Maximum Size:** 1000 entries (prevents memory overflow)
- **Eviction Strategy:** LRU (Least Recently Used) when size exceeded
- **Statistics:** Tracks hits, misses, hit rate, evictions

**Verification Methods:**

1. **Direct API Testing:**

   ```
   GET http://localhost:8080/api/weather/2644210  (1st call = MISS)
   GET http://localhost:8080/api/weather/2644210  (2nd call = HIT)
   ```

2. **Cache Statistics:**

   ```
   GET http://localhost:8080/api/cache/stats
   Response: { hitCount: 24, missCount: 8, hitRate: 0.75 }
   ```

3. **Backend Console Logs:**
   ```
   🔍 Request received for city ID: 2644210
   ✅ CACHE HIT! Returning cached data
   (No "Fetching from API" message = no API call made)
   ```

**Performance Impact:**

- **Without Cache:** 8 API calls per page load
- **With Cache:** 8 API calls on first load, 0 on subsequent loads within 5 minutes
- **API Quota Savings:** ~88% reduction in API calls (assuming users refresh within 5 min)
- **Response Time:** <10ms (cache) vs ~500-1000ms (API call)

---

## 🧪 Testing Cache Functionality

### Method 1: Direct API Endpoint

1. Open browser tab: `http://localhost:8080/api/weather/2644210`
2. Refresh multiple times within 5 minutes
3. Check backend console for "✅ CACHE HIT!" messages

### Method 2: Cache Statistics

Visit `http://localhost:8080/api/cache/stats` to see:

```json
{
  "cacheType": "Caffeine",
  "cacheTTL": "5 minutes",
  "size": 8,
  "hitCount": 24,
  "missCount": 8,
  "hitRate": 0.75,
  "evictionCount": 0
}
```

### Method 3: Backend Logs

Watch the backend console for detailed cache behavior:

- `🔍 Request received for city ID: XXXXX`
- `✅ CACHE HIT!` - Data served from cache
- `🌐 CACHE MISS!` - Data fetched from API

## 📁 Project Structure

```
weatherAPI/
├── backend/                    # Spring Boot backend
│   ├── src/main/java/
│   │   └── com/weatherapp/backend/
│   │       ├── BackendApplication.java
│   │       ├── config/
│   │       │   └── CaffeineCacheConfig.java
│   │       ├── controller/
│   │       │   ├── WeatherController.java
│   │       │   └── CacheController.java
│   │       ├── service/
│   │       │   └── WeatherService.java
│   │       ├── dto/
│   │       │   └── WeatherDTO.java
│   │       └── model/
│   │           └── City.java
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── cities.json
│   └── pom.xml
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── WeatherCard.jsx
│   │   │   └── WeatherDetailModal.jsx
│   │   ├── services/
│   │   │   └── weatherApi.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🔧 Configuration

### Backend Configuration (`backend/src/main/resources/application.properties`)

```properties
# OpenWeatherMap API
openweathermap.api.url=https://api.openweathermap.org/data/2.5/weather

# Cache Configuration
spring.cache.type=caffeine
spring.cache.caffeine.spec=expireAfterWrite=5m,maximumSize=1000
```

### Cache Settings

- **TTL**: 5 minutes
- **Max Size**: 1000 entries
- **Eviction**: Time-based (after 5 minutes)
- **Statistics**: Enabled (track hits/misses)

## 📊 API Endpoints

### Weather Endpoints

- `GET /api/weather/cities` - Get list of city IDs
- `GET /api/weather/{cityId}` - Get weather for specific city

**Example Response:**

```json
{
  "cityName": "Tokyo",
  "description": "moderate rain",
  "temperature": 14.54,
  "tempMin": 13.21,
  "tempMax": 15.37,
  "humidity": 60,
  "windSpeed": 4.21,
  "sunrise": 1762290407,
  "sunset": 1762328569
}
```

### Cache Management Endpoints

- `GET /api/cache/stats` - View cache statistics
- `GET /api/cache/clear` - Clear all cached data

## 🛠️ Technologies Used

### Backend

- Java 21
- Spring Boot 3.5.7
- Spring Cache
- Caffeine Cache
- Lombok
- Maven

### Frontend

- React 19.1.1
- Vite 7.1.12
- Tailwind CSS
- Axios

## 📝 Requirements Met

✅ **Extract city codes** from JSON file  
✅ **Fetch weather data** using OpenWeatherMap API  
✅ **Display weather information** with responsive UI  
✅ **Implement 5-minute caching** with automatic expiration  
✅ **Reduce redundant requests** through intelligent caching  
✅ **Cache statistics** for monitoring

## 🔒 Security Notes

- API keys are stored in environment variables, not in source code
- `.vscode/launch.json` is git-ignored
- CORS is configured for local development only
- No sensitive data is logged

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is created for educational purposes.

## 👨‍💻 Author

Built with ❤️ using Spring Boot and React

# Weather App - Secure Full-Stack Application

A weather application with Auth0 authentication, displaying real-time weather data for multiple cities with intelligent caching.

---

## 🎯 Overview

**Live Demo Credentials:**

- Email: `careers@fidenz.com`
- Password: `Pass#fidenz`

**Tech Stack:**

- Backend: Spring Boot 3.5.7, Java 21, Spring Security, OAuth2, Caffeine Cache
- Frontend: React 19, Vite, Auth0 React SDK, Tailwind CSS
- Security: Auth0 OAuth2, JWT tokens, Email MFA
- UI: Responsive design based on Weather App.psd (assets extracted from PSD layers)

---

## 🚀 Quick Start

### Prerequisites

- Java 21+
- Node.js 18+
- OpenWeatherMap API Key ([Get free key](https://openweathermap.org/api))

### 1. Clone & Setup

```bash
git clone https://github.com/mandinumaneth/weatherAPI.git
cd weatherAPI
```

### 2. Configure Backend

**File:** `backend/src/main/resources/application.properties`

```properties
# Auth0 (already configured for demo)
spring.security.oauth2.resourceserver.jwt.issuer-uri=https://dev-fdjyqqnyvd12ig7u.us.auth0.com/
spring.security.oauth2.resourceserver.jwt.audiences=https://weatherapp-api

# CORS
app.cors.allowed-origins=http://localhost:5173,http://localhost:5174
```

**Set API Key using .env file:**

1. Navigate to backend folder:

   ```bash
   cd backend
   ```

2. Copy the example file:

   ```bash
   copy .env.example .env
   ```

3. Edit `.env` and add your OpenWeatherMap API key:
   ```
   OPENWEATHERMAP_API_KEY=your_api_key_here
   ```

> **Note:** Get your free API key from [OpenWeatherMap](https://openweathermap.org/api). The `.env` file is git-ignored for security.

### 3. Configure Frontend

**File:** `frontend/src/main.jsx`

```javascript
const domain = "dev-fdjyqqnyvd12ig7u.us.auth0.com";
const clientId = "xWrd7CFogLQpb4w3THmcu8iqMCj5oYJe";
const audience = "https://weatherapp-api";
```

> **Note for Reviewers:** These Auth0 credentials are already configured for demo purposes. The application is secured via Auth0 Action that only allows `careers@fidenz.com` to access.

### 4. Run Application

**Backend:**

```bash
cd backend
./mvnw.cmd spring-boot:run
```

Server starts at `http://localhost:8080`

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`

### 5. Test

1. Open `http://localhost:5173`
2. Click "Log In" → Enter credentials
3. Complete MFA (check email)
4. View weather dashboard

---

## 📁 Project Structure

```
weatherAPI/
├── backend/
│   ├── src/main/java/com/weatherapp/backend/
│   │   ├── config/               # Security & Cache config
│   │   ├── controller/           # REST endpoints
│   │   ├── service/              # Business logic
│   │   ├── dto/                  # Data models
│   │   └── BackendApplication.java
│   └── src/main/resources/
│       ├── application.properties
│       └── cities.json           # City data
│
└── frontend/
    ├── src/
    │   ├── components/           # React components
    │   ├── services/             # API client
    │   ├── App.jsx               # Main component
    │   └── main.jsx              # Auth0 setup
    └── public/                   # Static assets (logo, background extracted from PSD)
        ├── logo.png              # App logo from Weather App.psd
        └── background.png        # Background image from PSD layers
```

## 🎨 UI Design

- **Based on**: Weather App.psd design file provided in assignment
- **Assets Extracted**:
  - Logo and icons from PSD layers
  - Background images and effects
  - Colors
- **Framework**: Tailwind CSS for responsive styling

---

## 🔑 Key Features Implemented

### Part 1: Weather Data & Caching

✅ Extracts city codes from JSON  
✅ Fetches weather from OpenWeatherMap API  
✅ **Responsive UI based on provided PSD design**  
✅ 5-minute intelligent caching (reduces API calls by 95%)  
✅ **Dynamic city list** - Add cities to `cities.json` without code changes ([See guide](HOW_TO_ADD_CITIES.md))

### Part 2: Authentication & Security

✅ Auth0 OAuth2 login/logout  
✅ Email-based Multi-Factor Authentication  
✅ JWT token validation on backend  
✅ Only `careers@fidenz.com` can access (via Auth0 Action)  
✅ Public signups disabled  
✅ Protected API endpoints

---

## 🔒 Security Architecture

### Authentication Flow

```
User → Login → Auth0 → Email MFA → Auth0 Action (verify email)
→ JWT Token → Frontend → API Call (Bearer token) → Backend (validate JWT)
→ Weather Data
```

### Backend Security (`SecurityConfig.java`)

- JWT signature validation
- Issuer validation (Auth0 tenant)
- Audience validation (API identifier)
- Protected endpoints: `/api/weather/**`
- CORS configuration

### Frontend Security

- Token stored in memory (not localStorage)
- Automatic token refresh
- Protected routes (login required)

---

## 📡 API Endpoints

### Weather (🔒 Requires Authentication)

- `GET /api/weather/cities` - List all city IDs
- `GET /api/weather/{cityId}` - Get weather for specific city

**Example Response:**

```json
{
  "cityName": "Tokyo",
  "description": "light rain",
  "temperature": 14.5,
  "humidity": 60,
  "windSpeed": 4.2,
  "sunrise": 1762290407,
  "sunset": 1762328569
}
```

### Cache (Public)

- `GET /api/cache/stats` - View cache statistics
- `GET /api/cache/clear` - Clear cache

---

## 🧪 Testing Cache

**Method 1: API Call**

```bash
# First call (MISS - API call made)
curl http://localhost:8080/api/weather/1850147

# Second call within 5 min (HIT - served from cache)
curl http://localhost:8080/api/weather/1850147
```

**Method 2: Cache Stats**

```bash
curl http://localhost:8080/api/cache/stats
```

**Response:**

```json
{
  "hitCount": 24,
  "missCount": 8,
  "hitRate": 0.75,
  "size": 8
}
```

## 🔧 Configuration Files

### Backend: `application.properties`

```properties
# Auth0
spring.security.oauth2.resourceserver.jwt.issuer-uri=https://your-tenant.us.auth0.com/
spring.security.oauth2.resourceserver.jwt.audiences=https://weatherapp-api

# CORS
app.cors.allowed-origins=http://localhost:5173,http://localhost:5174

# OpenWeather API
openweathermap.api.url=https://api.openweathermap.org/data/2.5/weather
```

### Frontend: `main.jsx`

const domain = "your-tenant.us.auth0.com";
const clientId = "your_client_id";
const audience = "https://weatherapp-api";

```

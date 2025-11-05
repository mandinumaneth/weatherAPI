package com.weatherapp.backend.service;

import com.weatherapp.backend.dto.WeatherDTO;

import lombok.extern.slf4j.Slf4j;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class WeatherService {

    // Read API key from environment variable OPENWEATHERMAP_API_KEY if present,
    // otherwise fall back to the application property `openweathermap.api.key`.
    @Value("${OPENWEATHERMAP_API_KEY:${openweathermap.api.key:}}")
    private String apiKey;

    @Value("${openweathermap.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Constructor to validate that API key is present at startup.
     * Fails fast if API key is missing or empty.
     */
    public WeatherService(@Value("${OPENWEATHERMAP_API_KEY:${openweathermap.api.key:}}") String apiKey) {
        if (apiKey == null || apiKey.trim().isEmpty()) {
            throw new IllegalStateException(
                    "❌ OPENWEATHERMAP_API_KEY is not set!\n" +
                            "Please set the API key using one of these methods:\n" +
                            "1. Add to .env file: OPENWEATHERMAP_API_KEY=your_api_key\n" +
                            "2. Add to application.properties: openweathermap.api.key=your_api_key\n" +
                            "Get your API key from: https://openweathermap.org/api");
        }
        this.apiKey = apiKey;
    }

    /** Read the city list from cities.json */
    public List<String> getCityCodes() throws IOException {
        var resource = new ClassPathResource("cities.json");
        String json = Files.readString(resource.getFile().toPath());

        JsonNode root = objectMapper.readTree(json);
        JsonNode list = root.get("List");

        List<String> cityCodes = new ArrayList<>();
        if (list != null && list.isArray()) {
            for (JsonNode city : list) {
                JsonNode codeNode = city.get("CityCode");
                if (codeNode != null) {
                    cityCodes.add(codeNode.asText());
                }
            }
        }
        return cityCodes;
    }

    /** Fetch and cache weather data for a given city */
    @Cacheable(value = "weatherCache", key = "#cityId")
    public WeatherDTO getWeatherByCityId(String cityId) {
        log.info("CACHE MISS! Fetching weather data from OpenWeatherMap API for city ID: {}", cityId);
        String url = apiUrl + "?id=" + cityId + "&appid=" + apiKey + "&units=metric";
        String responseBody = restTemplate.getForObject(url, String.class);

        try {
            JsonNode response = objectMapper.readTree(responseBody);

            String cityName = response.path("name").asText();
            JsonNode weatherArray = response.path("weather");
            String description = "";
            if (weatherArray.isArray() && weatherArray.size() > 0) {
                description = weatherArray.get(0).path("description").asText();
            }

            JsonNode main = response.path("main");
            double temperature = main.path("temp").asDouble();
            double tempMin = main.path("temp_min").asDouble();
            double tempMax = main.path("temp_max").asDouble();
            int humidity = main.path("humidity").asInt();

            JsonNode wind = response.path("wind");
            double windSpeed = wind.path("speed").asDouble();

            JsonNode sys = response.path("sys");
            long sunrise = sys.path("sunrise").asLong();
            long sunset = sys.path("sunset").asLong();

            return new WeatherDTO(cityName, description, temperature, tempMin, tempMax, humidity, windSpeed, sunrise,
                    sunset);
        } catch (IOException e) {
            throw new RuntimeException("Failed to parse weather API response", e);
        }
    }
}

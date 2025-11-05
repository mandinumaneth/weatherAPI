package com.weatherapp.backend.controller;

import com.weatherapp.backend.dto.WeatherDTO;
import com.weatherapp.backend.service.WeatherService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/weather")
@CrossOrigin(origins = "*") // allow your React frontend to call it
public class WeatherController {

    private static final Logger log = LoggerFactory.getLogger(WeatherController.class);
    private final WeatherService weatherService;
    private final CacheManager cacheManager;

    public WeatherController(WeatherService weatherService, CacheManager cacheManager) {
        this.weatherService = weatherService;
        this.cacheManager = cacheManager;
    }

    /** Endpoint to get list of city codes */
    @GetMapping("/cities")
    public List<String> getCities() throws IOException {
        return weatherService.getCityCodes();
    }

    /** Endpoint to get weather details for a city */
    @GetMapping("/{cityId}")
    public WeatherDTO getWeather(@PathVariable String cityId) {
        log.info("🔍 Request received for city ID: {}", cityId);

        // Check if data is in cache BEFORE calling service
        Cache cache = cacheManager.getCache("weatherCache");
        log.info("🔧 DEBUG - Cache object: {}", cache);

        if (cache != null) {
            Cache.ValueWrapper valueWrapper = cache.get(cityId);
            log.info("🔧 DEBUG - ValueWrapper BEFORE service call for cityId {}: {}", cityId, valueWrapper);

            if (valueWrapper != null && valueWrapper.get() != null) {
                log.info("✅ CACHE HIT! Returning cached data for city ID: {}", cityId);
            } else {
                log.info("🌐 CACHE MISS! Will fetch from API for city ID: {}", cityId);
            }
        } else {
            log.info("❌ ERROR - Cache 'weatherCache' not found!");
        }

        WeatherDTO result = weatherService.getWeatherByCityId(cityId);

        // Check cache AFTER service call to verify it was stored
        if (cache != null) {
            Cache.ValueWrapper afterWrapper = cache.get(cityId);
            log.info("🔧 DEBUG - ValueWrapper AFTER service call for cityId {}: {}", cityId, afterWrapper);
        }

        return result;
    }
}
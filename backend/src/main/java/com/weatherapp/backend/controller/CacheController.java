package com.weatherapp.backend.controller;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.stats.CacheStats;
import org.springframework.cache.CacheManager;
import org.springframework.cache.caffeine.CaffeineCache;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/cache")
public class CacheController {

    private final CacheManager cacheManager;

    public CacheController(CacheManager cacheManager) {
        this.cacheManager = cacheManager;
    }

    @GetMapping("/stats")
    public Map<String, Object> getCacheStats() {
        Map<String, Object> stats = new HashMap<>();
        org.springframework.cache.Cache cache = cacheManager.getCache("weatherCache");

        if (cache instanceof CaffeineCache) {
            CaffeineCache caffeineCache = (CaffeineCache) cache;
            Cache<Object, Object> nativeCache = caffeineCache.getNativeCache();
            CacheStats cacheStats = nativeCache.stats();

            stats.put("cacheType", "Caffeine");
            stats.put("cacheExists", true);
            stats.put("cacheTTL", "5 minutes (300 seconds)");
            stats.put("size", nativeCache.estimatedSize());
            stats.put("hitCount", cacheStats.hitCount());
            stats.put("missCount", cacheStats.missCount());
            stats.put("hitRate", String.format("%.2f%%", cacheStats.hitRate() * 100));
            stats.put("evictionCount", cacheStats.evictionCount());
        } else {
            stats.put("cacheExists", false);
        }

        return stats;
    }

    @GetMapping("/clear")
    public String clearCache() {
        org.springframework.cache.Cache cache = cacheManager.getCache("weatherCache");
        if (cache != null) {
            cache.clear();
            return "✅ Cache cleared successfully!";
        }
        return "❌ Cache not found!";
    }
}

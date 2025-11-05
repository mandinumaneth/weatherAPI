package com.weatherapp.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@RestController
public class RootController {
    @GetMapping("/")
    public void root(HttpServletResponse response) throws IOException {
        // Redirect to the existing API endpoint that lists cities
        response.sendRedirect("/api/weather/cities");
    }
}

package com.weatherapp.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WeatherDTO {
    private String cityName;
    private String description;
    private double temperature;
    private double tempMin;
    private double tempMax;
    private int humidity;
    private double windSpeed;
    private long sunrise;
    private long sunset;
}
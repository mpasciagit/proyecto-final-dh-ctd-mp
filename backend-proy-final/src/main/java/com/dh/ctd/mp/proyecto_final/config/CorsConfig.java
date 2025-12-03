package com.dh.ctd.mp.proyecto_final.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Configuration
public class CorsConfig {

    @Value("${app.allowed.origins:${ALLOWED_ORIGINS:}}")
    private String allowedOriginsProp;

    @Bean
    public CorsFilter corsFilter() {
        System.out.println("allowedOriginsProp = [" + allowedOriginsProp + "]");

        Set<String> origins = new LinkedHashSet<>();

        if (allowedOriginsProp != null && !allowedOriginsProp.isBlank()) {
            origins.addAll(Arrays.stream(allowedOriginsProp.split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toSet()));
        }

        // Orígenes de desarrollo habituales
        origins.add("http://localhost:5173");
        origins.add("http://localhost:5174");

        CorsConfiguration config = new CorsConfiguration();
        // Usar allowed origin patterns para permitir orígenes con puerto/IP cuando allowCredentials = true
        List<String> originPatterns = new ArrayList<>(origins);
        config.setAllowedOriginPatterns(originPatterns);

        config.setAllowCredentials(true);
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept", "Origin", "X-Requested-With"));
        config.setExposedHeaders(Arrays.asList("Authorization"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
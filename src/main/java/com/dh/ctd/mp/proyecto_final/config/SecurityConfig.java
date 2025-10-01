package com.dh.ctd.mp.proyecto_final.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // 🔴 Desactiva CSRF (para facilitar pruebas con Postman)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/h2-console/**").permitAll() // Permitir acceso a la consola H2
                .requestMatchers("/api/**").permitAll() // 🔓 Permitir libre acceso a todos los endpoints de la API
                .anyRequest().permitAll() // Permitir cualquier otro request (sin autenticación)
            );
        http.headers(headers -> headers.frameOptions(frame -> frame.disable())); // Permitir frames (necesario para H2)
        return http.build();
    }
}
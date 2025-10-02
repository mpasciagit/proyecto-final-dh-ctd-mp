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
                // 🔴 Desactivar CSRF para facilitar pruebas con Postman y tests
                .csrf(csrf -> csrf.disable())

                // 🔓 Configurar acceso a endpoints
                .authorizeHttpRequests(auth -> auth
                        // Permitir acceso libre a la consola H2
                        .requestMatchers("/h2-console/**").permitAll()

                        // Permitir acceso libre a todos los endpoints (temporal para pruebas)
                        .anyRequest().permitAll()
                );

        // ⚙️ Permitir frames para la consola H2
        http.headers(headers -> headers.frameOptions(frame -> frame.disable()));

        return http.build();
    }
}

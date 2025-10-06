package com.dh.ctd.mp.proyecto_final.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity   // 👈 habilita @PreAuthorize, @Secured, etc.
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;   // 🔑 tu filtro JWT
    private final AuthenticationProvider authenticationProvider; // definido en ApplicationConfig

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 🔴 Desactivar CSRF (para APIs REST + JWT no es necesario)
                .csrf(csrf -> csrf.disable())

                // 🔐 Control de acceso a endpoints
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/h2-console/**",
                                "/api/auth/**"   // login y register quedan públicos
                        ).permitAll()
                        .anyRequest().authenticated() // el resto exige token válido
                )

                // ⚙️ Configurar la sesión: sin estado (JWT)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // 🔧 Configurar el AuthenticationProvider (DAO + BCrypt)
                .authenticationProvider(authenticationProvider)

                // 🛡️ Insertar el filtro JWT antes del filtro de autenticación por usuario/contraseña
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        // ⚙️ Permitir frames para la consola H2
        http.headers(headers -> headers.frameOptions(frame -> frame.disable()));

        return http.build();
    }

    // ✅ Forma correcta en Spring Boot 3+ para exponer AuthenticationManager
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

}
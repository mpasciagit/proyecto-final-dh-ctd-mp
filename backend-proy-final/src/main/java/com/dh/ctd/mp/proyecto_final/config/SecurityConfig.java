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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;

@Configuration
@EnableMethodSecurity   // ✅ habilita anotaciones como @PreAuthorize
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;   // 🔑 tu filtro JWT
    private final AuthenticationProvider authenticationProvider; // definido en ApplicationConfig

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 🔴 Desactivar CSRF (innecesario en APIs JWT)
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))


                // 🔐 Control de acceso a endpoints
                .authorizeHttpRequests(auth -> auth
                        // 🧩 Endpoints públicos: Swagger, H2, Auth y Productos (solo lectura)
                        .requestMatchers(
                                "/h2-console/**",
                                "/api/auth/**",
                                "/api/productos",
                                "/api/productos/{id}",
                                "/api/productos/categoria/**",
                                "/api/categorias",
                                "/api/imagenes/producto/**",
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/v3/api-docs.yaml",
                                "/swagger-ui.html",
                                "/api/caracteristicas",
                                "/api/caracteristicas/{id}",
                                "/api/producto-caracteristicas",
                                "/api/producto-caracteristicas/{id}",
                                "/api/reviews/{id}",
                                "/api/reviews",
                                "/api/reviews/producto/{productoId}",
                                "/api/reviews/usuario/{usuarioId}"
                        ).permitAll()
                        // 🔒 El resto requiere autenticación con JWT
                        .anyRequest().authenticated()
                )

                // ⚙️ Política de sesión: sin estado (JWT)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // 🔧 Proveedor de autenticación (DAO + BCrypt)
                .authenticationProvider(authenticationProvider)

                // 🛡️ Insertar el filtro JWT antes del filtro por usuario/contraseña
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        // ⚙️ Permitir frames (para consola H2)
        http.headers(headers -> headers.frameOptions(frame -> frame.disable()));

        return http.build();
    }

    // ✅ Forma correcta en Spring Boot 3+ para exponer AuthenticationManager
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:5174"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

}

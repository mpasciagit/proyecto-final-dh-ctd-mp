package com.dh.ctd.mp.proyecto_final.config;

import com.dh.ctd.mp.proyecto_final.authentication.UserDetailsServiceImpl;
import com.dh.ctd.mp.proyecto_final.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class ApplicationConfig {

    private final UsuarioRepository usuarioRepository;
    private final UserDetailsServiceImpl userDetailsServiceImpl;

    /**
     * Bean para que Spring use UserDetailsServiceImpl
     */
    @Bean
    public UserDetailsService userDetailsService() {
        return userDetailsServiceImpl;
    }

    /**
     * PasswordEncoder usando BCrypt
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * AuthenticationProvider usando UserDetailsServiceImpl y BCrypt
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }
}

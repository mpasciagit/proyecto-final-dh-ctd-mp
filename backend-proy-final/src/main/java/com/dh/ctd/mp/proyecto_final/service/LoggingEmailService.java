package com.dh.ctd.mp.proyecto_final.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class LoggingEmailService implements EmailService {
    private static final Logger logger = LoggerFactory.getLogger(LoggingEmailService.class);

    @Override
    public void sendResetPasswordEmail(String to, String token) {
        // En producción reemplazar por JavaMailSender y plantilla HTML
        String resetLink = "http://localhost:3000/reset-password?token=" + token; // frontend hipotético
        logger.info("Enviar email de reset a {} con link: {}", to, resetLink);
        // También podés guardar en logs o enviar a consola para pruebas.
    }
}

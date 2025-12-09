package com.dh.ctd.mp.proyecto_final.service;

import com.dh.ctd.mp.proyecto_final.authentication.OriginType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

@Service
@Profile("dev")  // Esta implementación se usa sólo en el perfil 'dev'
public class LoggingEmailService implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(LoggingEmailService.class);

    @Override
    public void sendResetPasswordEmail(String to, String token, OriginType origin) {
        logger.info("[DEV EMAIL] Reset password → to={} token={} origin={}", to, token, origin);
    }

    @Override
    public void sendRegistrationConfirmationEmail(String to, String nombre, OriginType origin) {

        if (origin == null) {
            origin = OriginType.CLIENT;
        }

        String loginUrl;

        switch (origin) {
            case ADMIN:
                loginUrl = "http://localhost:5174/login";
                break;
            case TEST:
                // Usar la misma ruta /login para consistencia con MailtrapEmailService
                loginUrl = "http://localhost:5173/login";
                break;
            default: // CLIENT
                loginUrl = "http://localhost:5173/login";
                break;
        }

        logger.info(
                "[DEV EMAIL] Registro → to={} nombre={} origin={} loginUrl={}",
                to, nombre, origin, loginUrl
        );
    }


    @Override
    public void sendReservationConfirmationEmail(
            String to,
            String nombreUsuario,
            String nombreProducto,
            String fechaInicio,
            String fechaFin
    ) {
        logger.info("[DEV EMAIL] Reserva → to={} usuario={} producto={} inicio={} fin={}",
                to, nombreUsuario, nombreProducto, fechaInicio, fechaFin);
    }
}
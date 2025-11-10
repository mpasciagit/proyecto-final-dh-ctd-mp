/**
 * LoggingEmailService
 * Implementación temporal del servicio de envío de correos.
 * En lugar de enviar correos reales, registra en los logs
 * la acción y el contenido simulado del mensaje (por ejemplo,
 * el enlace de recuperación de contraseña).
 * Uso actual:
 *   - Entorno de desarrollo o pruebas sin servidor SMTP.
 * Próxima etapa:
 *   - Será reemplazada o complementada por una implementación
 *     real (MailtrapEmailService) que utilizará JavaMailSender
 *     y la configuración SMTP de Mailtrap para enviar correos
 *     HTML reales de registro, reserva y recuperación de contraseña.
 */
package com.dh.ctd.mp.proyecto_final.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

@Service
@Profile("dev")  // Esta implementación se usa sólo en el perfil 'dev'
public class LoggingEmailService implements EmailService {
    private static final Logger logger = LoggerFactory.getLogger(LoggingEmailService.class);

    @Override
    public void sendResetPasswordEmail(String to, String token) {
        String resetLink = "http://localhost:3000/reset-password?token=" + token; // frontend hipotético
        logger.info("Enviar email de reset a {} con link: {}", to, resetLink);
    }

    @Override
    public void sendRegistrationConfirmationEmail(String to, String nombre) {
        String loginUrl = "http://localhost:5173/login";
        logger.info("[DEV EMAIL] Registro → to={} nombre={} loginUrl={}", to, nombre, loginUrl);
    }

    @Override
    public void sendReservationConfirmationEmail(String to, String nombreUsuario, String nombreProducto,
                                                 String fechaInicio, String fechaFin) {
        logger.info("[DEV EMAIL] Reserva → to={} usuario={} producto={} inicio={} fin={}",
                to, nombreUsuario, nombreProducto, fechaInicio, fechaFin);
    }
}

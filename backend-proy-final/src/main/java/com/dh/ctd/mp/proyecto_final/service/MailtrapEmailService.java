package com.dh.ctd.mp.proyecto_final.service;

import com.dh.ctd.mp.proyecto_final.authentication.OriginType;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import java.util.function.Supplier;

@Service
@Profile("prod")
@RequiredArgsConstructor
public class MailtrapEmailService implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(MailtrapEmailService.class);
    private final JavaMailSender mailSender;

    @Value("${app.frontend.client-reset-url:http://localhost:5173/reset-password}")
    private String clientResetUrl;

    @Value("${app.frontend.admin-reset-url:http://localhost:5174/reset-password}")
    private String adminResetUrl;

    @Value("${app.allowed.origins:}")
    private String allowedOrigins;

    @Value("${app.frontend.test-reset-fallback:http://localhost:5173/reset-password}")
    private String testResetFallback;

    @Value("${app.frontend.client-login-url:http://localhost:5173/login}")
    private String clientLoginUrl;

    @Value("${app.frontend.admin-login-url:http://localhost:5174}")
    private String adminLoginUrl;

    @Value("${app.frontend.test-login-fallback:http://localhost:5173/login}")
    private String testLoginFallback;

    // ------------------ RESET PASSWORD ------------------
    @Override
    public void sendResetPasswordEmail(String to, String token, OriginType origin) {

        String base = resolveByOrigin(origin, clientResetUrl, adminResetUrl, this::resolveTestResetUrl, testResetFallback);

        String resetLink = base + (base.contains("?") ? "&" : "?") + "token=" + token;
        String subject = "Recuperación de contraseña - Alquileres de Autos";
        String htmlBody = """
                <html>
                    <body style="font-family: Arial, sans-serif; color: #333;">
                        <h2>Recuperación de contraseña</h2>
                        <p>Recibimos una solicitud para restablecer tu contraseña.</p>
                        <p>Podés hacerlo haciendo clic en el siguiente enlace:</p>
                        <p>
                            <a href="%s" style="display:inline-block;padding:10px 20px;
                               background-color:#1a73e8;color:#fff;text-decoration:none;
                               border-radius:5px;">Restablecer contraseña</a>
                        </p>
                        <p>Este enlace es válido por 1 hora.</p>
                        <br>
                        <p>Si no hiciste esta solicitud, simplemente ignorá este correo.</p>
                    </body>
                </html>
                """.formatted(resetLink);

        enviarCorreoHtml(to, subject, htmlBody);
    }

    // ------------------ CONFIRMACIÓN DE REGISTRO ------------------
    @Override
    public void sendRegistrationConfirmationEmail(String to, String nombre, OriginType origin) {
        String loginUrl = resolveByOrigin(origin, clientLoginUrl, adminLoginUrl, this::resolveTestLoginUrl, testLoginFallback);

        String subject = "¡Bienvenido a Alquileres de Autos!";
        String htmlBody = """
            <html>
                <body style="font-family: Arial, sans-serif; color: #333;">
                    <h2>¡Hola %s!</h2>
                    <p>Tu cuenta fue creada con éxito en el sistema de <b>Alquileres de Autos</b>.</p>
                    <p>Podés iniciar sesión haciendo clic en el siguiente enlace:</p>
                    <p>
                        <a href="%s" style="display:inline-block;padding:10px 20px;
                           background-color:#1a73e8;color:#fff;text-decoration:none;
                           border-radius:5px;">Iniciar sesión</a>
                    </p>
                    <br>
                    <p>¡Gracias por registrarte y bienvenido a la comunidad!</p>
                </body>
            </html>
            """.formatted(nombre, loginUrl);

        enviarCorreoHtml(to, subject, htmlBody);
    }


    // ------------------ CONFIRMACIÓN DE RESERVA ------------------
    @Override
    public void sendReservationConfirmationEmail(String to, String nombreUsuario,
                                                 String nombreProducto, String fechaInicio, String fechaFin) {
        String subject = "Confirmación de Reserva - Alquileres de Autos";
        String htmlBody = """
            <html>
                <body style="font-family: Arial, sans-serif; color: #333;">
                    <h2>¡Reserva confirmada!</h2>
                    <p>Hola %s, tu reserva fue creada con éxito.</p>
                    <p><b>Detalles de la reserva:</b></p>
                    <ul>
                        <li>Auto: %s</li>
                        <li>Fecha de inicio: %s</li>
                        <li>Fecha de fin: %s</li>
                    </ul>
                    <p>Podés consultar tus reservas activas en tu perfil dentro de la aplicación.</p>
                    <br>
                    <p>¡Gracias por elegirnos!</p>
                </body>
            </html>
            """.formatted(nombreUsuario, nombreProducto, fechaInicio, fechaFin);

        enviarCorreoHtml(to, subject, htmlBody);
    }

    // ------------------ HELPERS ------------------
    private String resolveByOrigin(OriginType origin,
                                   String clientUrl,
                                   String adminUrl,
                                   Supplier<String> testResolver,
                                   String testFallback) {
        if (origin == null) {
            return clientUrl;
        }
        switch (origin) {
            case ADMIN:
                return adminUrl;
            case TEST:
                String resolved = testResolver != null ? testResolver.get() : null;
                return (resolved != null && !resolved.isBlank()) ? resolved : testFallback;
            default:
                return clientUrl;
        }
    }

    private String resolveTestResetUrl() {
        if (allowedOrigins != null && !allowedOrigins.isBlank()) {
            String[] parts = allowedOrigins.split(",");
            String firstCandidate = null;
            for (String p : parts) {
                String candidate = p.trim();
                if (candidate.isEmpty()) continue;
                if (candidate.contains("/reset-password")) {
                    return candidate;
                }
                if (firstCandidate == null) firstCandidate = candidate;
            }
            if (firstCandidate != null) {
                String normalized = firstCandidate.endsWith("/") ? firstCandidate.substring(0, firstCandidate.length() - 1) : firstCandidate;
                return normalized + "/reset-password";
            }
        }
        return testResetFallback;
    }

    private String resolveTestLoginUrl() {
        if (allowedOrigins != null && !allowedOrigins.isBlank()) {
            String[] parts = allowedOrigins.split(",");
            String firstCandidate = null;
            for (String p : parts) {
                String candidate = p.trim();
                if (candidate.isEmpty()) continue;
                if (candidate.contains("/login")) {
                    return candidate;
                }
                if (firstCandidate == null) firstCandidate = candidate;
            }
            if (firstCandidate != null) {
                String normalized = firstCandidate.endsWith("/") ? firstCandidate.substring(0, firstCandidate.length() - 1) : firstCandidate;
                return normalized + "/login";
            }
        }
        return testLoginFallback;
    }

    private void enviarCorreoHtml(String destinatario, String asunto, String cuerpoHtml) {
        try {
            MimeMessage mensaje = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, true, "UTF-8");
            helper.setTo(destinatario);
            helper.setSubject(asunto);
            helper.setText(cuerpoHtml, true);
            mailSender.send(mensaje);

            logger.info("Correo enviado a {} con asunto '{}'", destinatario, asunto);

        } catch (MessagingException e) {
            logger.error("Error al enviar correo a {}: {}", destinatario, e.getMessage(), e);
            throw new RuntimeException("Error al enviar el correo", e);
        }
    }
}
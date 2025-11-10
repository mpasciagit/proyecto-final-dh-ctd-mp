package com.dh.ctd.mp.proyecto_final.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
/**
 * MailtrapEmailService
 * Implementación real del servicio de envío de correos mediante
 * JavaMailSender y la configuración SMTP de Mailtrap.
 * Este servicio permite enviar correos HTML (con formato y enlaces
 * clicables) durante:
 *   - El registro (confirmación de cuenta)
 *   - La confirmación de reserva
 *   - La recuperación de contraseña
 * Configuración:
 *   - Definida en application.properties o application.yml
 *     (host, puerto, usuario y contraseña provistos por Mailtrap).
 * Entorno:
 *   - Ideal para pruebas educativas o QA, ya que los correos no se
 *     envían realmente al destinatario, sino que quedan visibles
 *     en el panel web de Mailtrap.
 */
@Service
@Profile("prod")
@RequiredArgsConstructor
public class MailtrapEmailService implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(MailtrapEmailService.class);
    private final JavaMailSender mailSender;

    // ------------------ RESET PASSWORD ------------------
    @Override
    public void sendResetPasswordEmail(String to, String token) {
        String resetLink = "http://localhost:5173/reset-password?token=" + token;
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
    public void sendRegistrationConfirmationEmail(String to, String nombre) {
        String loginUrl = "http://localhost:5173/login";
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

    // ------------------ MÉTODO GENÉRICO DE ENVÍO ------------------
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
            logger.error("Error al enviar correo a {}: {}", destinatario, e.getMessage());
            throw new RuntimeException("Error al enviar el correo", e);
        }
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
}

package com.dh.ctd.mp.proyecto_final.service;

public interface EmailService {
    void sendResetPasswordEmail(String to, String token);
    void sendRegistrationConfirmationEmail(String to, String nombre);
    void sendReservationConfirmationEmail(String to, String nombreUsuario, String nombreProducto,
                                          String fechaInicio, String fechaFin);
}

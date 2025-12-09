package com.dh.ctd.mp.proyecto_final.service;

import com.dh.ctd.mp.proyecto_final.authentication.OriginType;

public interface EmailService {
    void sendResetPasswordEmail(String to, String token, OriginType origin);
    void sendRegistrationConfirmationEmail(String to, String nombre, OriginType origin);
    void sendReservationConfirmationEmail(
            String to, String nombreUsuario, String nombreProducto,
            String fechaInicio, String fechaFin
    );
}

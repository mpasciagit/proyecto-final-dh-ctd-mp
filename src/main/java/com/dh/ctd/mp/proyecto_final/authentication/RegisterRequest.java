package com.dh.ctd.mp.proyecto_final.authentication;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO usado para registrar un nuevo usuario.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequest {

    private String nombre;
    private String apellido;
    private String email;
    private String password;
    private String rol; // Nombre del rol: "USER", "ADMIN", etc.
}

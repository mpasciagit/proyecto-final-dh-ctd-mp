package com.dh.ctd.mp.proyecto_final.authentication;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO de respuesta tras login o registro exitoso
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthenticationResponse {

    private String token;          // JWT generado
    private Long usuarioId;        // Id del usuario
    private String nombre;         // Nombre del usuario
    private String apellido;       // Apellido del usuario
    private String email;          // Email del usuario
    private List<Rol> roles;       // Roles asignados al usuario con sus IDs

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Rol {
        private Long id;           // ID del rol
        private String nombre;     // Nombre del rol
    }
}
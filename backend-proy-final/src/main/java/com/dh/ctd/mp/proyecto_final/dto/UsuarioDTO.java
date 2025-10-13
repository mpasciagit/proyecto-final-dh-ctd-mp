package com.dh.ctd.mp.proyecto_final.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para transferir datos de Usuario sin exponer toda la entidad.
 * Incluye Rol simplificado (solo id y nombre).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioDTO {

    private Long id;
    private String email;
    private String nombre;
    private String apellido;
    private String password;

    private RolDTO rol;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RolDTO {
        private Long id;
        private String nombre;
    }
}


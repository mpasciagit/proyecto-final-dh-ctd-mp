package com.dh.ctd.mp.proyecto_final.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para transferir datos de Rol sin exponer todos los usuarios asociados.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RolDTO {

    private Long id;
    private String nombre;
    private String descripcion;

    // Opcional: si querés exponer solo cantidad de usuarios o IDs
    // private List<Long> usuarioIds;
}


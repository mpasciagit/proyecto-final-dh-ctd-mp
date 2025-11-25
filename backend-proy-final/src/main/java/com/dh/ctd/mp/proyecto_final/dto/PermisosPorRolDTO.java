package com.dh.ctd.mp.proyecto_final.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PermisosPorRolDTO {
    private RolDTO rol;
    private List<PermisoDTO> permisos; // Declaración del atributo

}
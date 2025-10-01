package com.dh.ctd.mp.proyecto_final.mapper;

import com.dh.ctd.mp.proyecto_final.dto.RolDTO;
import com.dh.ctd.mp.proyecto_final.entity.Rol;

public class RolMapper {

    // Rol -> RolDTO
    public static RolDTO toDTO(Rol rol) {
        if (rol == null) return null;

        return RolDTO.builder()
                .id(rol.getId())
                .nombre(rol.getNombre())
                .descripcion(rol.getDescripcion())
                .build();
    }

    // RolDTO -> Rol
    public static Rol toEntity(RolDTO rolDTO) {
        if (rolDTO == null) return null;

        Rol rol = new Rol();
        rol.setId(rolDTO.getId());
        rol.setNombre(rolDTO.getNombre());
        rol.setDescripcion(rolDTO.getDescripcion());
        return rol;
    }
}


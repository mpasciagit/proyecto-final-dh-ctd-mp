package com.dh.ctd.mp.proyecto_final.mapper;

import com.dh.ctd.mp.proyecto_final.dto.PermisoDTO;
import com.dh.ctd.mp.proyecto_final.entity.Permiso;

public class PermisoMapper {

    public static PermisoDTO toDTO(Permiso permiso) {
        if (permiso == null) return null;
        return new PermisoDTO(permiso.getId(), permiso.getNombre());
    }

    public static Permiso toEntity(PermisoDTO dto) {
        if (dto == null) return null;
        Permiso permiso = new Permiso();
        permiso.setId(dto.getId());
        permiso.setNombre(dto.getNombre());
        return permiso;
    }
}

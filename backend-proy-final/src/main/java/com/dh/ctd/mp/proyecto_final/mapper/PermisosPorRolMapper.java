package com.dh.ctd.mp.proyecto_final.mapper;

import com.dh.ctd.mp.proyecto_final.dto.PermisoDTO;
import com.dh.ctd.mp.proyecto_final.dto.RolDTO;
import com.dh.ctd.mp.proyecto_final.dto.PermisosPorRolDTO;
import com.dh.ctd.mp.proyecto_final.entity.Permiso;
import com.dh.ctd.mp.proyecto_final.entity.Rol;
import com.dh.ctd.mp.proyecto_final.entity.RolPermiso;
import org.springframework.stereotype.Component;

@Component
public class PermisosPorRolMapper {

    public PermisosPorRolDTO toDto(RolPermiso entity) {
        if (entity == null) {
            return null;
        }

        PermisosPorRolDTO dto = new PermisosPorRolDTO();
        dto.setRol(toRolDto(entity.getRol()));
        return dto;
    }

    public RolPermiso toEntity(PermisosPorRolDTO dto) {
        if (dto == null) {
            return null;
        }

        RolPermiso entity = new RolPermiso();
        entity.setRol(toRolEntity(dto.getRol()));
        return entity;
    }

    public RolDTO toRolDto(Rol rol) {
        if (rol == null) {
            return null;
        }

        RolDTO dto = new RolDTO();
        dto.setId(rol.getId());
        dto.setNombre(rol.getNombre());
        return dto;
    }

    public PermisoDTO toPermisoDto(Permiso permiso) {
        if (permiso == null) {
            return null;
        }

        PermisoDTO dto = new PermisoDTO();
        dto.setId(permiso.getId());
        dto.setNombre(permiso.getNombre());
        return dto;
    }

    public Rol toRolEntity(RolDTO dto) {
        if (dto == null) {
            return null;
        }

        Rol rol = new Rol();
        rol.setId(dto.getId());
        rol.setNombre(dto.getNombre());
        return rol;
    }

    public Permiso toPermisoEntity(PermisoDTO dto) {
        if (dto == null) {
            return null;
        }

        Permiso permiso = new Permiso();
        permiso.setId(dto.getId());
        permiso.setNombre(dto.getNombre());
        return permiso;
    }
}
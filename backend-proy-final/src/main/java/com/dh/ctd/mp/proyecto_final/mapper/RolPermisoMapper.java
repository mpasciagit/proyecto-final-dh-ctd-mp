package com.dh.ctd.mp.proyecto_final.mapper;

import com.dh.ctd.mp.proyecto_final.dto.RolPermisoDTO;
import com.dh.ctd.mp.proyecto_final.entity.RolPermiso;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class RolPermisoMapper {

    public RolPermisoDTO toDto(RolPermiso entity) {
        RolPermisoDTO dto = new RolPermisoDTO();
        dto.setId(entity.getId());
        dto.setRol(entity.getRol().getNombre()); // Usa el atributo relevante de Rol
        dto.setPermiso(entity.getPermiso().getNombre()); // Usa el atributo relevante de Permiso
        dto.setRolId(entity.getRol().getId());
        dto.setPermisoId(entity.getPermiso().getId());

        return dto;
    }

    public List<RolPermisoDTO> toDtoList(List<RolPermiso> entities) {
        return entities.stream()
                       .map(this::toDto)
                       .collect(Collectors.toList());
    }
}
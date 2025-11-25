package com.dh.ctd.mp.proyecto_final.service;

import com.dh.ctd.mp.proyecto_final.dto.RolPermisoDTO;
import com.dh.ctd.mp.proyecto_final.dto.PermisosPorRolDTO;
import java.util.List;

public interface IRolPermisoService {
    List<RolPermisoDTO> listarTodos();
    PermisosPorRolDTO obtenerRolConPermisos(Long rolId);
    boolean tienePermisoAdmin(Long rolId);
}
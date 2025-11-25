package com.dh.ctd.mp.proyecto_final.controller;

import com.dh.ctd.mp.proyecto_final.dto.PermisosPorRolDTO;
import com.dh.ctd.mp.proyecto_final.dto.RolPermisoDTO;
import com.dh.ctd.mp.proyecto_final.service.IRolPermisoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rol-permiso")
public class RolPermisoController {

    @Autowired
    private IRolPermisoService rolPermisoService;

    @PreAuthorize("hasAuthority('ROLPERMISO:LISTAR')")
    @GetMapping
    public ResponseEntity<List<RolPermisoDTO>> listarTodos() {
        List<RolPermisoDTO> lista = rolPermisoService.listarTodos();
        return ResponseEntity.ok(lista);
    }

    @PreAuthorize("hasAuthority('ROLPERMISO:LISTAR')")
    @GetMapping("/rol/{rolId}")
    public ResponseEntity<PermisosPorRolDTO> obtenerRolConPermisos(@PathVariable Long rolId) {
        PermisosPorRolDTO rolPermiso = rolPermisoService.obtenerRolConPermisos(rolId);
        return ResponseEntity.ok(rolPermiso);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/rol/{rolId}/permiso/admin")
    public ResponseEntity<Boolean> tienePermisoAdmin(@PathVariable Long rolId) {
        boolean tienePermiso = rolPermisoService.tienePermisoAdmin(rolId);
        return ResponseEntity.ok(tienePermiso);
    }
    
    @GetMapping("/public/rol/{rolId}/permiso/admin")
    public ResponseEntity<Boolean> tienePermisoAdminPublic(@PathVariable Long rolId) {
        boolean tienePermiso = rolPermisoService.tienePermisoAdmin(rolId);
        return ResponseEntity.ok(tienePermiso);
    }
    
}
package com.dh.ctd.mp.proyecto_final.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * Endpoint que define qué roles pueden acceder al panel administrativo.
 * Se consulta desde el frontend-admin antes del login.
 * YA NO SE USA, SOLO SE MANTIENE POR SER PARTE DEL PROCESO DE APRENDIZAJE
 */
@Deprecated
@RestController
@RequestMapping("/api/admin")
public class AdminAccessController {

    @GetMapping("/allowed-roles")
    public Map<String, List<String>> getAdminAccess() {
        return Map.of(
                "allowedRoles", List.of("ADMIN", "SUPER_ADMIN")
        );
    }
}

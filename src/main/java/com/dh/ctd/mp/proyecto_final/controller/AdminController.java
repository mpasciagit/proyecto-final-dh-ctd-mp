package com.dh.ctd.mp.proyecto_final.controller;

import com.dh.ctd.mp.proyecto_final.authentication.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "admin", description = "Operaciones Administrativas")
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AuthenticationService authenticationService;

    // --- Resetear contraseña de un usuario (ADMIN) ---
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @PostMapping("/reset-password/{userId}")
    public ResponseEntity<?> resetUserPassword(@PathVariable Long userId) {
        authenticationService.resetPasswordByAdmin(userId);
        return ResponseEntity.ok().body(
                java.util.Map.of("message", "Contraseña temporal generada y enviada al usuario.")
        );
    }
}

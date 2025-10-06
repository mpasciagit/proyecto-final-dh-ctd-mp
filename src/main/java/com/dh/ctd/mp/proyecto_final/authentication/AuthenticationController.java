package com.dh.ctd.mp.proyecto_final.authentication;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    // --- Registro de usuario ---
    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authenticationService.register(request));
    }

    // --- Autenticación (login) ---
    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(authenticationService.authenticate(request));
    }

    // --- Cambio de contraseña del usuario autenticado ---
    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(
            @RequestBody ChangePasswordRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        authenticationService.changePassword(userDetails.getUsername(), request);
        return ResponseEntity.ok("Contraseña cambiada exitosamente");
    }

    // --- Forgot Password / Olvidé mi contraseña ---
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        authenticationService.forgotPassword(request.getEmail());
        return ResponseEntity.ok("Se ha enviado un correo con instrucciones para resetear la contraseña");
    }

    // --- Reset Password ---
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
        authenticationService.resetPassword(request);
        return ResponseEntity.ok("Contraseña restablecida exitosamente");
    }

    // --- Reset de contraseña por ADMIN ---
    @PostMapping("/admin/reset-password/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> resetPasswordByAdmin(@PathVariable Long userId) {
        authenticationService.resetPasswordByAdmin(userId);
        return ResponseEntity.ok("Contraseña temporal generada y enviada al usuario");
    }
}

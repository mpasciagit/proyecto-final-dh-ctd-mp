package com.dh.ctd.mp.proyecto_final.authentication;

import com.dh.ctd.mp.proyecto_final.entity.PasswordResetToken;
import com.dh.ctd.mp.proyecto_final.entity.Usuario;
import com.dh.ctd.mp.proyecto_final.repository.PasswordResetTokenRepository;
import com.dh.ctd.mp.proyecto_final.repository.UsuarioRepository;
import com.dh.ctd.mp.proyecto_final.exception.ResourceNotFoundException;
import com.dh.ctd.mp.proyecto_final.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    private final long EXPIRATION_MINUTES = 60; // 1 hora por defecto

    /**
     * Crea token y envía email (si el usuario existe).
     * No revela si el email existe (responder siempre OK en el endpoint).
     */
    public void createPasswordResetToken(String email) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);
        if (usuarioOpt.isEmpty()) {
            // Para evitar enumeración de usuarios, no informar error al cliente.
            return;
        }

        Usuario usuario = usuarioOpt.get();

        // Borrar tokens previos para el usuario
        tokenRepository.deleteByUsuarioId(usuario.getId());

        String token = UUID.randomUUID().toString();
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(EXPIRATION_MINUTES);

        PasswordResetToken prt = PasswordResetToken.builder()
                .token(token)
                .expiryDate(expiry)
                .usuario(usuario)
                .build();

        tokenRepository.save(prt);

        // enviar email (o log) con el token o link
        emailService.sendResetPasswordEmail(usuario.getEmail(), token);
    }

    /**
     * Resetea la contraseña usando token.
     */
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken prt = tokenRepository.findByToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Token inválido"));

        if (prt.getExpiryDate().isBefore(LocalDateTime.now())) {
            tokenRepository.delete(prt);
            throw new IllegalArgumentException("Token expirado");
        }

        Usuario usuario = prt.getUsuario();
        usuario.setPassword(passwordEncoder.encode(newPassword));
        usuarioRepository.save(usuario);

        // Invalidar token una vez usado
        tokenRepository.delete(prt);
    }
}

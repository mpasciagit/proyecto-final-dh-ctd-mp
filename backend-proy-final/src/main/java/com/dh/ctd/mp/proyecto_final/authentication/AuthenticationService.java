package com.dh.ctd.mp.proyecto_final.authentication;

import com.dh.ctd.mp.proyecto_final.config.JwtService;
import com.dh.ctd.mp.proyecto_final.entity.PasswordResetToken;
import com.dh.ctd.mp.proyecto_final.entity.Rol;
import com.dh.ctd.mp.proyecto_final.entity.Usuario;
import com.dh.ctd.mp.proyecto_final.exception.DuplicateResourceException;
import com.dh.ctd.mp.proyecto_final.exception.ResourceNotFoundException;
import com.dh.ctd.mp.proyecto_final.repository.PasswordResetTokenRepository;
import com.dh.ctd.mp.proyecto_final.repository.RolRepository;
import com.dh.ctd.mp.proyecto_final.repository.UsuarioRepository;
import com.dh.ctd.mp.proyecto_final.service.EmailService;
import com.dh.ctd.mp.proyecto_final.service.IUsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final IUsuarioService usuarioService;
    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final EmailService emailService;

    // ------------------- REGISTRO -------------------
    public AuthenticationResponse register(RegisterRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email ya registrado: " + request.getEmail());
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(request.getNombre());
        usuario.setApellido(request.getApellido());
        usuario.setEmail(request.getEmail());
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));

        Rol rol = rolRepository.findByNombre(request.getRol())
                .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado: " + request.getRol()));
        usuario.setRol(rol);

        Usuario saved = usuarioRepository.save(usuario);

        // Enviar correo de confirmación de registro
        emailService.sendRegistrationConfirmationEmail(
            saved.getEmail(),
            saved.getNombre()
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(saved.getEmail());
        String jwtToken = jwtService.generateToken(userDetails);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .usuarioId(saved.getId())
                .nombre(saved.getNombre())
                .email(saved.getEmail())
                .roles(List.of(saved.getRol().getNombre()))
                .build();
    }

    // ------------------- LOGIN -------------------
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + request.getEmail()));

        UserDetails userDetails = userDetailsService.loadUserByUsername(usuario.getEmail());
        String jwtToken = jwtService.generateToken(userDetails);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .usuarioId(usuario.getId())
                .nombre(usuario.getNombre())
                .apellido(usuario.getApellido())
                .email(usuario.getEmail())
                .roles(List.of(usuario.getRol().getNombre()))
                .build();
    }

    // ------------------- CAMBIO DE PASSWORD (usuario autenticado) -------------------
    public void changePassword(String email, ChangePasswordRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + email));

        if (!passwordEncoder.matches(request.getOldPassword(), usuario.getPassword())) {
            throw new IllegalArgumentException("Contraseña actual incorrecta");
        }

        usuario.setPassword(passwordEncoder.encode(request.getNewPassword()));
        usuarioRepository.save(usuario);
    }

    // ------------------- OLVIDÉ MI CONTRASEÑA (envía token al mail/log) -------------------
    @Transactional
    public void forgotPassword(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + email));

        // Generar token único y guardarlo (expira en 1 hora)
        String token = UUID.randomUUID().toString().substring(0, 8);
        PasswordResetToken tokenEntity = new PasswordResetToken();
        tokenEntity.setUsuario(usuario);
        tokenEntity.setToken(token);
        tokenEntity.setExpiryDate(LocalDateTime.now().plusHours(1));
        tokenEntity.setUsed(false);
        tokenRepository.save(tokenEntity);

        // Enviar email/log con el token
        emailService.sendResetPasswordEmail(usuario.getEmail(), token);
    }

    // ------------------- RESETEAR CONTRASEÑA (vía token del usuario) -------------------
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetToken tokenEntity = tokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new ResourceNotFoundException("Token inválido o no encontrado"));

        if (tokenEntity.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("El token ha expirado");
        }

        if (tokenEntity.isUsed()) {
            throw new IllegalArgumentException("El token ya fue utilizado");
        }

        Usuario usuario = tokenEntity.getUsuario();
        usuario.setPassword(passwordEncoder.encode(request.getNewPassword()));
        usuarioRepository.save(usuario);

        tokenEntity.setUsed(true);
        tokenRepository.save(tokenEntity);
    }
}

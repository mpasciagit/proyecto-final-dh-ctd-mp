package com.dh.ctd.mp.proyecto_final.config;

import com.dh.ctd.mp.proyecto_final.entity.Rol;
import com.dh.ctd.mp.proyecto_final.entity.Usuario;
import com.dh.ctd.mp.proyecto_final.repository.RolRepository;
import com.dh.ctd.mp.proyecto_final.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Order(2)
@RequiredArgsConstructor
public class UserInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (usuarioRepository.count() == 0) {
            Rol userRol = rolRepository.findByNombre("USER").orElseThrow(() ->
                    new IllegalStateException("Rol USER no encontrado"));
            Rol adminRol = rolRepository.findByNombre("ADMIN").orElseThrow(() ->
                    new IllegalStateException("Rol ADMIN no encontrado"));
            Rol superAdminRol = rolRepository.findByNombre("SUPER_ADMIN").orElseThrow(() ->
                    new IllegalStateException("Rol SUPER_ADMIN no encontrado"));

            Usuario user = new Usuario();
            user.setNombre("Valeria");
            user.setApellido("Galli");
            user.setEmail("user@test.com");
            user.setPassword(passwordEncoder.encode("user123"));
            user.setRol(userRol);

            Usuario admin = new Usuario();
            admin.setNombre("Leo");
            admin.setApellido("Ricci");
            admin.setEmail("admin@test.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRol(adminRol);

            Usuario superAdmin = new Usuario();
            superAdmin.setNombre("Alicia");
            superAdmin.setApellido("Perez");
            superAdmin.setEmail("super_admin@test.com");
            superAdmin.setPassword(passwordEncoder.encode("superadmin123"));
            superAdmin.setRol(superAdminRol);

            usuarioRepository.save(user);
            usuarioRepository.save(admin);
            usuarioRepository.save(superAdmin);
        }
    }
}
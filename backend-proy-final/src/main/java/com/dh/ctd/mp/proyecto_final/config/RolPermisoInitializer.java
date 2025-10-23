package com.dh.ctd.mp.proyecto_final.config;

import com.dh.ctd.mp.proyecto_final.entity.Permiso;
import com.dh.ctd.mp.proyecto_final.entity.Rol;
import com.dh.ctd.mp.proyecto_final.repository.PermisoRepository;
import com.dh.ctd.mp.proyecto_final.repository.RolRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
@RequiredArgsConstructor
public class RolPermisoInitializer implements CommandLineRunner {

    private final RolRepository rolRepository;
    private final PermisoRepository permisoRepository;

    @Override
    public void run(String... args) {
        // Asegúrate de que los roles existen
        Rol superAdmin = rolRepository.findByNombre("SUPER_ADMIN")
                .orElseGet(() -> rolRepository.save(new Rol("SUPER_ADMIN")));
        Rol admin = rolRepository.findByNombre("ADMIN")
                .orElseGet(() -> rolRepository.save(new Rol("ADMIN")));
        Rol user = rolRepository.findByNombre("USER")
                .orElseGet(() -> rolRepository.save(new Rol("USER")));

        // Mapea los permisos a cada rol según la tabla (resumido y sin duplicados)
        Map<String, Set<String>> permisosPorRol = new HashMap<>();
        permisosPorRol.put("SUPER_ADMIN", new HashSet<>(Arrays.asList(
                "USUARIO:CREAR", "USUARIO:BUSCAR", "USUARIO:LISTAR", "USUARIO:MODIFICAR", "USUARIO:ELIMINAR",
                "ROL:CREAR", "ROL:BUSCAR", "ROL:LISTAR", "ROL:MODIFICAR", "ROL:ELIMINAR",
                "REVIEW:CREAR", "REVIEW:BUSCAR", "REVIEW:LISTAR", "REVIEW:ELIMINAR",
                "RESERVA:CREAR", "RESERVA:BUSCAR", "RESERVA:LISTAR", "RESERVA:MODIFICAR", "RESERVA:ELIMINAR",
                "PRODUCTO:CREAR", "PRODUCTO:BUSCAR", "PRODUCTO:LISTAR", "PRODUCTO:MODIFICAR", "PRODUCTO:ELIMINAR",
                "IMAGEN:CREAR", "IMAGEN:BUSCAR", "IMAGEN:LISTAR", "IMAGEN:MODIFICAR", "IMAGEN:ELIMINAR",
                "FAVORITO:CREAR", "FAVORITO:BUSCAR", "FAVORITO:LISTAR", "FAVORITO:MODIFICAR", "FAVORITO:ELIMINAR",
                "CATEGORIA:CREAR", "CATEGORIA:BUSCAR", "CATEGORIA:LISTAR", "CATEGORIA:MODIFICAR", "CATEGORIA:ELIMINAR",
                "CARACTERISTICA:CREAR", "CARACTERISTICA:BUSCAR", "CARACTERISTICA:LISTAR", "CARACTERISTICA:MODIFICAR", "CARACTERISTICA:ELIMINAR"
        )));
        permisosPorRol.put("ADMIN", new HashSet<>(Arrays.asList(
                "USUARIO:BUSCAR",
                "REVIEW:CREAR", "REVIEW:BUSCAR", "REVIEW:LISTAR",
                "RESERVA:CREAR", "RESERVA:BUSCAR", "RESERVA:LISTAR", "RESERVA:MODIFICAR", "RESERVA:ELIMINAR",
                "PRODUCTO:CREAR", "PRODUCTO:BUSCAR", "PRODUCTO:LISTAR", "PRODUCTO:MODIFICAR",
                "IMAGEN:CREAR", "IMAGEN:BUSCAR", "IMAGEN:LISTAR", "IMAGEN:MODIFICAR",
                "FAVORITO:CREAR", "FAVORITO:BUSCAR", "FAVORITO:LISTAR", "FAVORITO:MODIFICAR", "FAVORITO:ELIMINAR",
                "CATEGORIA:CREAR", "CATEGORIA:BUSCAR", "CATEGORIA:LISTAR", "CATEGORIA:MODIFICAR", "CATEGORIA:ELIMINAR",
                "CARACTERISTICA:CREAR", "CARACTERISTICA:BUSCAR", "CARACTERISTICA:LISTAR", "CARACTERISTICA:MODIFICAR"
        )));
        permisosPorRol.put("USER", new HashSet<>(Arrays.asList(
                "REVIEW:CREAR", "REVIEW:BUSCAR", "REVIEW:LISTAR",
                "RESERVA:CREAR", "RESERVA:BUSCAR", "RESERVA:LISTAR", "RESERVA:MODIFICAR", "RESERVA:ELIMINAR",
                "PRODUCTO:BUSCAR", "PRODUCTO:LISTAR",
                "FAVORITO:CREAR", "FAVORITO:BUSCAR", "FAVORITO:LISTAR", "FAVORITO:ELIMINAR",
                "CATEGORIA:BUSCAR", "CATEGORIA:LISTAR",
                "CARACTERISTICA:BUSCAR", "CARACTERISTICA:LISTAR"
        )));

        // Crear todos los permisos si no existen
        Set<String> todosLosPermisos = new HashSet<>();
        permisosPorRol.values().forEach(todosLosPermisos::addAll);
        for (String nombrePermiso : todosLosPermisos) {
            permisoRepository.findByNombre(nombrePermiso)
                .orElseGet(() -> permisoRepository.save(new Permiso(nombrePermiso)));
        }

        // Asigna los permisos a cada rol
        for (Map.Entry<String, Set<String>> entry : permisosPorRol.entrySet()) {
            Rol rol = rolRepository.findByNombre(entry.getKey()).orElseThrow();
            Set<Permiso> permisos = new HashSet<>(permisoRepository.findAllByNombreIn(entry.getValue()));
            rol.setPermisos(permisos);
            rolRepository.save(rol);
        }
    }
}
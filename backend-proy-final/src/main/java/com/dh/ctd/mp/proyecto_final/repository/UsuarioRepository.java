package com.dh.ctd.mp.proyecto_final.repository;

import com.dh.ctd.mp.proyecto_final.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Buscar usuario por email (login)
    Optional<Usuario> findByEmail(String email);

    // Verifica si existe un usuario con el email dado
    boolean existsByEmail(String email);

    // Listar todos los usuarios con un rol específico (ej: "ADMIN")
    List<Usuario> findByRolNombre(String nombreRol);

    // Búsqueda por nombre, insensible a mayúsculas/minúsculas
    List<Usuario> findByNombreContainingIgnoreCase(String nombre);

    // SOLO PARA ENCONTRAR ERROR
    @Query("SELECT u FROM Usuario u " +
            "JOIN FETCH u.rol r " +
            "JOIN FETCH r.permisos " +
            "WHERE u.email = :email")
    Optional<Usuario> findByEmailWithPermissions(@Param("email") String email);
}


package com.dh.ctd.mp.proyecto_final.repository;

import com.dh.ctd.mp.proyecto_final.entity.Permiso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface PermisoRepository extends JpaRepository<Permiso, Long> {

    // Buscar permiso por nombre
    Optional<Permiso> findByNombre(String nombre);

    // Buscar varios permisos por nombre
    List<Permiso> findAllByNombreIn(Collection<String> nombres);
}
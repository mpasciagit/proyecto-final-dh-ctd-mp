package com.dh.ctd.mp.proyecto_final.repository;

import com.dh.ctd.mp.proyecto_final.entity.RolPermiso;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RolPermisoRepository extends JpaRepository<RolPermiso, Long> {

    boolean existsByRolIdAndPermisoId(Long rolId, Long permisoId);

    boolean existsByRol_IdAndPermiso_Nombre(Long rolId, String permisoNombre);

    // verifica si ya existe la relación rol-permiso
    Optional<RolPermiso> findByRolIdAndPermisoId(Long rolId, Long permisoId);

    // elimina relación rol-permiso
    void deleteByRolIdAndPermisoId(Long rolId, Long permisoId);
}
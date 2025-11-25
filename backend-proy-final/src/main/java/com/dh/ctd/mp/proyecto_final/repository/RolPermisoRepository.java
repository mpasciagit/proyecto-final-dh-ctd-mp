package com.dh.ctd.mp.proyecto_final.repository;

import com.dh.ctd.mp.proyecto_final.entity.RolPermiso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RolPermisoRepository extends JpaRepository<RolPermiso, Long> {

    @Query("SELECT COUNT(rp) > 0 FROM RolPermiso rp WHERE rp.rol.id = :rolId AND rp.permiso.nombre = :permisoNombre")
    boolean existsByRolIdAndPermisoNombre(@Param("rolId") Long rolId, @Param("permisoNombre") String permisoNombre);
}
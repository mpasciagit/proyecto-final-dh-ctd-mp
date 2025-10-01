package com.dh.ctd.mp.proyecto_final.repository;

import com.dh.ctd.mp.proyecto_final.entity.Favorito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FavoritoRepository extends JpaRepository<Favorito, Long> {

    // Todos los favoritos de un usuario
    List<Favorito> findByUsuarioId(Long usuarioId);

    // Todos los favoritos de un producto (quiénes marcaron X producto como favorito)
    List<Favorito> findByProductoId(Long productoId);

    // Para verificar si un usuario ya marcó un producto como favorito
    boolean existsByUsuarioIdAndProductoId(Long usuarioId, Long productoId);

    // Para eliminar un favorito específico (ej: "quitar de favoritos")
    void deleteByUsuarioIdAndProductoId(Long usuarioId, Long productoId);
}


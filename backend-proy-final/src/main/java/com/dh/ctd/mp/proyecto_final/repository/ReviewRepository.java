package com.dh.ctd.mp.proyecto_final.repository;

import com.dh.ctd.mp.proyecto_final.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    // Todas las reviews de un producto
    List<Review> findByProductoId(Long productoId);

    // Todas las reviews de un usuario
    List<Review> findByUsuarioId(Long usuarioId);

    // Reviews de un producto con cierta puntuación
    List<Review> findByProductoIdAndPuntuacion(Long productoId, Integer puntuacion);

    // Verifica si el usuario ya hizo review de un producto
    boolean existsByUsuarioIdAndProductoId(Long usuarioId, Long productoId);
}
package com.dh.ctd.mp.proyecto_final.repository;

import com.dh.ctd.mp.proyecto_final.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    // Buscar productos por nombre (o parte del nombre)
    List<Producto> findByNombreContainingIgnoreCase(String nombre);

    // Buscar productos por categoría
    List<Producto> findByCategoriaId(Long categoriaId);

    // Buscar productos reservables
    List<Producto> findByReservableTrue();

    // Buscar productos con cantidad disponible mayor a 0
    List<Producto> findByCantidadTotalGreaterThan(Integer cantidad);

    @Query("SELECT c.nombre FROM Producto p JOIN p.categoria c WHERE p.id = :id")
    Optional<String> findCategoriaNombreByProductoId(@Param("id") Long id);
}

package com.dh.ctd.mp.proyecto_final.repository;

import com.dh.ctd.mp.proyecto_final.entity.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    boolean existsByNombre(String nombre);

    // acá podés agregar métodos personalizados si los necesitás
    // por ejemplo: Optional<Categoria> findByNombre(String nombre);
}


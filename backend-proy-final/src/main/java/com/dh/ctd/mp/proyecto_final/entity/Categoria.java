package com.dh.ctd.mp.proyecto_final.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "categorias")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Nombre visible de la categoría (ej: "Autos", "Hoteles", "Electrónica")
    @Column(nullable = false, unique = true)
    private String nombre;

    // Descripción opcional
    @Column(length = 500)
    private String descripcion;

    // Imagen de referencia (ej: para mostrar en home)
    private String urlImagen;

    // --- Relaciones ---
    @OneToMany(mappedBy = "categoria", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Producto> productos = new HashSet<>();
}


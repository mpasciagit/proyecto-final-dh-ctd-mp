package com.dh.ctd.mp.proyecto_final.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "productos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(length = 1000)
    private String descripcion;

    private Double precio;

    // Si es un producto reservable (ej: auto, alojamiento)
    private Boolean reservable = false;

    // Cuántas unidades idénticas hay disponibles para reservar
    private Integer cantidadTotal = 1;

    // --- Relaciones ---

    // Categoría del producto
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;

    // Imágenes del producto
    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Imagen> imagenes = new HashSet<>();

    // Reservas del producto
    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Reserva> reservas = new HashSet<>();

    // Favoritos del producto
    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Favorito> favoritos = new HashSet<>();

    // Reviews del producto
    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Review> reviews = new HashSet<>();

   // Características del producto
    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ProductoCaracteristica> productoCaracteristicas = new HashSet<>();

    public Producto(Long id, String nombre, String descripcion, Double precio, Boolean reservable, Integer cantidadTotal, Categoria categoria) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.reservable = reservable;
        this.cantidadTotal = cantidadTotal;
        this.categoria = categoria;
    }
}


package com.dh.ctd.mp.proyecto_final.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "imagenes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Imagen {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // URL o path de la imagen
    @Column(nullable = false)
    private String url;

    // Texto alternativo (para accesibilidad o SEO)
    private String textoAlternativo;

    // Orden de aparición en la galería del producto
    @Column(nullable = false)
    private Integer orden;

    // --- Relación con Producto ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;
}

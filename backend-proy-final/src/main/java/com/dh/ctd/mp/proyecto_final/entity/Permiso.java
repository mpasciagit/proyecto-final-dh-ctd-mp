package com.dh.ctd.mp.proyecto_final.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "permisos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Permiso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String nombre; // Ej: "PRODUCTO:CREAR", "PRODUCTO:LIST"

    @ManyToMany(mappedBy = "permisos")
    private Set<Rol> roles = new HashSet<>();

    public Permiso(String nombre) {
        this.nombre = nombre;
    }
}

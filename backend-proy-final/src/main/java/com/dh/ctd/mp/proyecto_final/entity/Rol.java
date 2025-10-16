package com.dh.ctd.mp.proyecto_final.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "roles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Rol {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String nombre;   // Ej: "ADMIN", "USER"

    private String descripcion;

    // Relación inversa: un rol puede estar en muchos usuarios
    @OneToMany(mappedBy = "rol", fetch = FetchType.LAZY)
    private Set<Usuario> usuarios = new HashSet<>();

    // Relación muchos a muchos con Permiso
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "rol_permiso",
        joinColumns = @JoinColumn(name = "rol_id"),
        inverseJoinColumns = @JoinColumn(name = "permiso_id")
    )
    private Set<Permiso> permisos = new HashSet<>();

    // Constructor adicional requerido por el inicializador
    public Rol(String nombre) {
        this.nombre = nombre;
    }
}
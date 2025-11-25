package com.dh.ctd.mp.proyecto_final.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservaDTO {
    private Long id;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private String estado;
    private Long usuarioId;
    private Long productoId;
    private String fechaCreacion;
}
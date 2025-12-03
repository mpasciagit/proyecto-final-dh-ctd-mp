package com.dh.ctd.mp.proyecto_final.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DisponibilidadDTO {
    private Long productoId;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
}

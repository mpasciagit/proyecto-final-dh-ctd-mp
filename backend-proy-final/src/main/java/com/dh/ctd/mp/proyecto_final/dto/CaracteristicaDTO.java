package com.dh.ctd.mp.proyecto_final.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CaracteristicaDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private String iconoUrl;
}

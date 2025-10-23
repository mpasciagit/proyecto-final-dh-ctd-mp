package com.dh.ctd.mp.proyecto_final.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductoCaracteristicaDTO {
    private Long id;
    private Long productoId;
    private Long caracteristicaId;
    private String valor;
}
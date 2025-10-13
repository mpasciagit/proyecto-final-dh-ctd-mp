package com.dh.ctd.mp.proyecto_final.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductoDTO {

    private Long id;
    private String nombre;
    private String descripcion;
    private Double precio;
    private Boolean reservable;
    private Integer cantidadTotal;

    private Long categoriaId;
    private String categoriaNombre;

    private List<CaracteristicaDTO> caracteristicas; // Lista de características asociadas
}
package com.dh.ctd.mp.proyecto_final.mapper;

import com.dh.ctd.mp.proyecto_final.dto.ProductoCaracteristicaDTO;
import com.dh.ctd.mp.proyecto_final.entity.ProductoCaracteristica;
import org.springframework.stereotype.Component;

@Component
public class ProductoCaracteristicaMapper {

    public ProductoCaracteristicaDTO toDto(ProductoCaracteristica entity) {
        if (entity == null) {
            return null;
        }
        return ProductoCaracteristicaDTO.builder()
                .id(entity.getId())
                .productoId(entity.getProducto().getId())
                .caracteristicaId(entity.getCaracteristica().getId())
                .valor(entity.getValor())
                .build();
    }

    public ProductoCaracteristica toEntity(ProductoCaracteristicaDTO dto) {
        if (dto == null) {
            return null;
        }
        return ProductoCaracteristica.builder()
                .id(dto.getId())
                .valor(dto.getValor())
                .build();
    }
}
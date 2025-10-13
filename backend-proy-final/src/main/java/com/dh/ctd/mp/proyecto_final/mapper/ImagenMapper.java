package com.dh.ctd.mp.proyecto_final.mapper;

import com.dh.ctd.mp.proyecto_final.dto.ImagenDTO;
import com.dh.ctd.mp.proyecto_final.entity.Imagen;
import com.dh.ctd.mp.proyecto_final.entity.Producto;

public class ImagenMapper {

    public static ImagenDTO toDTO(Imagen imagen) {
        if (imagen == null) return null;
        return new ImagenDTO(
                imagen.getId(),
                imagen.getUrl(),
                imagen.getTextoAlternativo(),
                imagen.getOrden(),
                imagen.getProducto() != null ? imagen.getProducto().getId() : null
        );
    }

    public static Imagen toEntity(ImagenDTO dto, Producto producto) {
        if (dto == null) return null;
        Imagen imagen = new Imagen();
        imagen.setId(dto.getId());
        imagen.setUrl(dto.getUrl());
        imagen.setTextoAlternativo(dto.getTextoAlternativo());
        imagen.setOrden(dto.getOrden());
        imagen.setProducto(producto);
        return imagen;
    }
}

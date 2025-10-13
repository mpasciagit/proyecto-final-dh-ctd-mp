package com.dh.ctd.mp.proyecto_final.mapper;

import com.dh.ctd.mp.proyecto_final.dto.CategoriaDTO;
import com.dh.ctd.mp.proyecto_final.entity.Categoria;

public class CategoriaMapper {

    public static CategoriaDTO toDTO(Categoria categoria) {
        if (categoria == null) return null;
        return CategoriaDTO.builder()
                .id(categoria.getId())
                .nombre(categoria.getNombre())
                .descripcion(categoria.getDescripcion())
                .urlImagen(categoria.getUrlImagen())
                .build();
    }

    public static Categoria toEntity(CategoriaDTO dto) {
        if (dto == null) return null;
        return Categoria.builder()
                .id(dto.getId())
                .nombre(dto.getNombre())
                .descripcion(dto.getDescripcion())
                .urlImagen(dto.getUrlImagen())
                .build();
    }
}

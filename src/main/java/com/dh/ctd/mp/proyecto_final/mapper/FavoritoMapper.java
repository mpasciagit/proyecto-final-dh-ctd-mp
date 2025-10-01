package com.dh.ctd.mp.proyecto_final.mapper;

import com.dh.ctd.mp.proyecto_final.dto.FavoritoDTO;
import com.dh.ctd.mp.proyecto_final.entity.Favorito;

public class FavoritoMapper {

    public static FavoritoDTO toDTO(Favorito favorito) {
        if (favorito == null) return null;
        return FavoritoDTO.builder()
                .id(favorito.getId())
                .fechaCreacion(favorito.getFechaCreacion())
                .usuarioId(favorito.getUsuario() != null ? favorito.getUsuario().getId() : null)
                .productoId(favorito.getProducto() != null ? favorito.getProducto().getId() : null)
                .build();
    }

    public static Favorito toEntity(FavoritoDTO dto) {
        if (dto == null) return null;
        Favorito favorito = new Favorito();
        favorito.setId(dto.getId());
        favorito.setFechaCreacion(dto.getFechaCreacion());
        // usuario y producto deben setearse en el service usando los repositorios correspondientes
        return favorito;
    }
}
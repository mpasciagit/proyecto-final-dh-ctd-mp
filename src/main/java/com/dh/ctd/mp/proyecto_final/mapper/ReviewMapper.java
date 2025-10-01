package com.dh.ctd.mp.proyecto_final.mapper;

import com.dh.ctd.mp.proyecto_final.dto.ReviewDTO;
import com.dh.ctd.mp.proyecto_final.entity.Producto;
import com.dh.ctd.mp.proyecto_final.entity.Review;
import com.dh.ctd.mp.proyecto_final.entity.Usuario;

public class ReviewMapper {

    public static ReviewDTO toDTO(Review review) {
        if (review == null) return null;
        return ReviewDTO.builder()
                .id(review.getId())
                .puntuacion(review.getPuntuacion())
                .comentario(review.getComentario())
                .fechaCreacion(review.getFechaCreacion())
                .usuarioId(review.getUsuario() != null ? review.getUsuario().getId() : null)
                .productoId(review.getProducto() != null ? review.getProducto().getId() : null)
                .build();
    }

    public static Review toEntity(ReviewDTO dto, Usuario usuario, Producto producto) {
        if (dto == null) return null;
        return Review.builder()
                .id(dto.getId())
                .puntuacion(dto.getPuntuacion())
                .comentario(dto.getComentario())
                .fechaCreacion(dto.getFechaCreacion())
                .usuario(usuario)
                .producto(producto)
                .build();
    }
}
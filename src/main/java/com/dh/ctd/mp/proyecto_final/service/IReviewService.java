package com.dh.ctd.mp.proyecto_final.service;

import com.dh.ctd.mp.proyecto_final.dto.ReviewDTO;

import java.util.List;

public interface IReviewService {
    ReviewDTO save(ReviewDTO reviewDTO);

    ReviewDTO findById(Long id);

    List<ReviewDTO> findAll();

    void delete(Long id);

    List<ReviewDTO> findByProductoId(Long productoId);

    List<ReviewDTO> findByUsuarioId(Long usuarioId);
}

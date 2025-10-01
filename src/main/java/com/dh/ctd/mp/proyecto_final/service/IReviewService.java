package com.dh.ctd.mp.proyecto_final.service;

import com.dh.ctd.mp.proyecto_final.dto.ReviewDTO;

import java.util.List;
import java.util.Optional;

public interface IReviewService {
    ReviewDTO save(ReviewDTO reviewDTO);
    Optional<ReviewDTO> findById(Long id);
    List<ReviewDTO> findAll();
    void delete(Long id);
    List<ReviewDTO> findByProductoId(Long productoId);
    List<ReviewDTO> findByUsuarioId(Long usuarioId);
}
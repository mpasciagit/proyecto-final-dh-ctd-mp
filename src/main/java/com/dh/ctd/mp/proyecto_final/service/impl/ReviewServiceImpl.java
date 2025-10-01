package com.dh.ctd.mp.proyecto_final.service.impl;

import com.dh.ctd.mp.proyecto_final.dto.ReviewDTO;
import com.dh.ctd.mp.proyecto_final.entity.Producto;
import com.dh.ctd.mp.proyecto_final.entity.Review;
import com.dh.ctd.mp.proyecto_final.entity.Usuario;
import com.dh.ctd.mp.proyecto_final.mapper.ReviewMapper;
import com.dh.ctd.mp.proyecto_final.repository.ProductoRepository;
import com.dh.ctd.mp.proyecto_final.repository.ReviewRepository;
import com.dh.ctd.mp.proyecto_final.repository.UsuarioRepository;
import com.dh.ctd.mp.proyecto_final.service.IReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReviewServiceImpl implements IReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Override
    public ReviewDTO save(ReviewDTO reviewDTO) {
        Usuario usuario = usuarioRepository.findById(reviewDTO.getUsuarioId()).orElse(null);
        Producto producto = productoRepository.findById(reviewDTO.getProductoId()).orElse(null);
        Review review = ReviewMapper.toEntity(reviewDTO, usuario, producto);
        Review saved = reviewRepository.save(review);
        return ReviewMapper.toDTO(saved);
    }

    @Override
    public Optional<ReviewDTO> findById(Long id) {
        return reviewRepository.findById(id).map(ReviewMapper::toDTO);
    }

    @Override
    public List<ReviewDTO> findAll() {
        return reviewRepository.findAll().stream()
                .map(ReviewMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void delete(Long id) {
        reviewRepository.deleteById(id);
    }

    @Override
    public List<ReviewDTO> findByProductoId(Long productoId) {
        return reviewRepository.findByProductoId(productoId).stream()
                .map(ReviewMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReviewDTO> findByUsuarioId(Long usuarioId) {
        return reviewRepository.findByUsuarioId(usuarioId).stream()
                .map(ReviewMapper::toDTO)
                .collect(Collectors.toList());
    }
}

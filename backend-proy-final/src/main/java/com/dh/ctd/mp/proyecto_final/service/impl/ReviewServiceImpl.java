package com.dh.ctd.mp.proyecto_final.service.impl;

import com.dh.ctd.mp.proyecto_final.dto.ReviewDTO;
import com.dh.ctd.mp.proyecto_final.entity.Producto;
import com.dh.ctd.mp.proyecto_final.entity.Review;
import com.dh.ctd.mp.proyecto_final.entity.Usuario;
import com.dh.ctd.mp.proyecto_final.exception.InvalidDataException;
import com.dh.ctd.mp.proyecto_final.exception.ResourceNotFoundException;
import com.dh.ctd.mp.proyecto_final.mapper.ReviewMapper;
import com.dh.ctd.mp.proyecto_final.repository.ProductoRepository;
import com.dh.ctd.mp.proyecto_final.repository.ReviewRepository;
import com.dh.ctd.mp.proyecto_final.repository.UsuarioRepository;
import com.dh.ctd.mp.proyecto_final.service.IReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
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
        if (reviewDTO.getPuntuacion() < 1 || reviewDTO.getPuntuacion() > 5) {
            throw new InvalidDataException("La puntuación debe estar entre 1 y 5");
        }
        if (reviewDTO.getComentario() == null || reviewDTO.getComentario().isBlank()) {
            throw new InvalidDataException("El comentario no puede estar vacío");
        }

        Usuario usuario = usuarioRepository.findById(reviewDTO.getUsuarioId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + reviewDTO.getUsuarioId()));
        Producto producto = productoRepository.findById(reviewDTO.getProductoId())
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con id: " + reviewDTO.getProductoId()));

        Review review = ReviewMapper.toEntity(reviewDTO, usuario, producto);
        Review saved = reviewRepository.save(review);
        return ReviewMapper.toDTO(saved);
    }

    @Override
    public ReviewDTO findById(Long id) {
        return reviewRepository.findById(id)
                .map(ReviewMapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Review no encontrada con id: " + id));
    }

    @Override
    public List<ReviewDTO> findAll() {
        return reviewRepository.findAll()
                .stream()
                .map(ReviewMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void delete(Long id) {
        if (!reviewRepository.existsById(id)) {
            throw new ResourceNotFoundException("Review no encontrada con id: " + id);
        }
        reviewRepository.deleteById(id);
    }

    @Override
    public List<ReviewDTO> findByProductoId(Long productoId) {
        return reviewRepository.findByProductoId(productoId)
                .stream()
                .map(ReviewMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReviewDTO> findByUsuarioId(Long usuarioId) {
        return reviewRepository.findByUsuarioId(usuarioId)
                .stream()
                .map(ReviewMapper::toDTO)
                .collect(Collectors.toList());
    }
}

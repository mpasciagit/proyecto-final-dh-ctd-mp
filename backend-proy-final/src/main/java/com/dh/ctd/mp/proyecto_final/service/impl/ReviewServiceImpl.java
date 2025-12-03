package com.dh.ctd.mp.proyecto_final.service.impl;

import com.dh.ctd.mp.proyecto_final.dto.ReviewDTO;
import com.dh.ctd.mp.proyecto_final.entity.Producto;
import com.dh.ctd.mp.proyecto_final.entity.Reserva;
import com.dh.ctd.mp.proyecto_final.entity.Review;
import com.dh.ctd.mp.proyecto_final.entity.Usuario;
import com.dh.ctd.mp.proyecto_final.entity.EstadoReserva;
import com.dh.ctd.mp.proyecto_final.exception.InvalidDataException;
import com.dh.ctd.mp.proyecto_final.exception.ResourceNotFoundException;
import com.dh.ctd.mp.proyecto_final.mapper.ReviewMapper;
import com.dh.ctd.mp.proyecto_final.repository.ProductoRepository;
import com.dh.ctd.mp.proyecto_final.repository.ReservaRepository;
import com.dh.ctd.mp.proyecto_final.repository.ReviewRepository;
import com.dh.ctd.mp.proyecto_final.repository.UsuarioRepository;
import com.dh.ctd.mp.proyecto_final.service.IReviewService;
import jakarta.persistence.EntityManager;
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

    @Autowired
    private ReservaRepository reservaRepository;

    @Override
    public ReviewDTO save(ReviewDTO reviewDTO) {
        // Validaciones básicas
        if (reviewDTO.getPuntuacion() < 1 || reviewDTO.getPuntuacion() > 5) {
            throw new InvalidDataException("La puntuación debe estar entre 1 y 5");
        }
        if (reviewDTO.getComentario() == null || reviewDTO.getComentario().isBlank()) {
            throw new InvalidDataException("El comentario no puede estar vacío");
        }

        // 1) Validar existencia de la reserva y consistencia con user/producto
        Reserva reserva = reservaRepository.findById(reviewDTO.getReservaId())
                .orElseThrow(() -> new ResourceNotFoundException("Reserva no encontrada con id: " + reviewDTO.getReservaId()));

        if (!reserva.getProducto().getId().equals(reviewDTO.getProductoId())) {
            throw new InvalidDataException("La reserva no corresponde al producto");
        }

        if (!reserva.getUsuario().getId().equals(reviewDTO.getUsuarioId())) {
            throw new InvalidDataException("La reserva no pertenece al usuario");
        }

        // 2) Solo se permite review si la reserva está FINALIZADA
        if (reserva.getEstado() != EstadoReserva.FINALIZADA) {
            throw new InvalidDataException("Solo puedes hacer review de productos que hayas rentado y devuelto");
        }

        // 3) Evitar que la misma reserva tenga más de un review
        if (reserva.getReview() != null) {
            throw new InvalidDataException("Ya has hecho review para esta reserva");
        }

        // Usamos las entidades ya relacionadas en la reserva para garantizar consistencia
        Usuario usuario = reserva.getUsuario();
        Producto producto = reserva.getProducto();

        // Mapear DTO -> entidad usando ReviewMapper (métodos estáticos)
        Review review = ReviewMapper.toEntity(reviewDTO, usuario, producto, reserva);

        // Guardar review
        Review saved = reviewRepository.save(review);

        // Asociar review a la reserva y guardar (para mantener la relación bidireccional)
        reserva.setReview(saved);
        reservaRepository.save(reserva);

        // Retornar DTO usando ReviewMapper
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
        Review review = reviewRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Review no encontrada con id: " + id));
        Reserva reserva = review.getReserva();
        if (reserva != null) {
            reserva.setReview(null);
            reservaRepository.save(reserva);
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

    @Override
    public ReviewDTO update(Long id, ReviewDTO reviewDTO) {
        if (reviewDTO.getPuntuacion() < 1 || reviewDTO.getPuntuacion() > 5) {
            throw new InvalidDataException("La puntuación debe estar entre 1 y 5");
        }
        if (reviewDTO.getComentario() == null || reviewDTO.getComentario().isBlank()) {
            throw new InvalidDataException("El comentario no puede estar vacío");
        }

        Review existingReview = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review no encontrada con id: " + id));

        Usuario usuario = usuarioRepository.findById(reviewDTO.getUsuarioId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + reviewDTO.getUsuarioId()));
        Producto producto = productoRepository.findById(reviewDTO.getProductoId())
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con id: " + reviewDTO.getProductoId()));

        existingReview.setPuntuacion(reviewDTO.getPuntuacion());
        existingReview.setComentario(reviewDTO.getComentario());
        existingReview.setUsuario(usuario);
        existingReview.setProducto(producto);

        Review updatedReview = reviewRepository.save(existingReview);
        return ReviewMapper.toDTO(updatedReview);
    }
}
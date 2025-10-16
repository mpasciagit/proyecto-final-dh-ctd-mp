package com.dh.ctd.mp.proyecto_final.controller;

import com.dh.ctd.mp.proyecto_final.dto.ReviewDTO;
import com.dh.ctd.mp.proyecto_final.service.IReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final IReviewService reviewService;

    @Autowired
    public ReviewController(IReviewService reviewService) {
        this.reviewService = reviewService;
    }

    // ----------------- CREAR -----------------
    @PreAuthorize("hasAuthority('REVIEW:CREAR')")
    @PostMapping
    public ResponseEntity<ReviewDTO> create(@RequestBody ReviewDTO reviewDTO) {
        ReviewDTO saved = reviewService.save(reviewDTO);
        return ResponseEntity.ok(saved);
    }

    // ----------------- OBTENER POR ID -----------------
    @PreAuthorize("hasAuthority('REVIEW:BUSCAR')")
    @GetMapping("/{id}")
    public ResponseEntity<ReviewDTO> getById(@PathVariable Long id) {
        ReviewDTO review = reviewService.findById(id);
        return ResponseEntity.ok(review);
    }

    // ----------------- LISTAR TODAS -----------------
    @PreAuthorize("hasAuthority('REVIEW:LISTAR')")
    @GetMapping
    public ResponseEntity<List<ReviewDTO>> getAll() {
        return ResponseEntity.ok(reviewService.findAll());
    }

    // ----------------- ELIMINAR -----------------
    @PreAuthorize("hasAuthority('REVIEW:ELIMINAR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        reviewService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ----------------- REVIEWS POR PRODUCTO -----------------
    @PreAuthorize("hasAuthority('REVIEW:BUSCAR')")
    @GetMapping("/producto/{productoId}")
    public ResponseEntity<List<ReviewDTO>> getByProductoId(@PathVariable Long productoId) {
        return ResponseEntity.ok(reviewService.findByProductoId(productoId));
    }

    // ----------------- REVIEWS POR USUARIO -----------------
    @PreAuthorize("hasAuthority('REVIEW:LISTAR')")
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<ReviewDTO>> getByUsuarioId(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(reviewService.findByUsuarioId(usuarioId));
    }
}
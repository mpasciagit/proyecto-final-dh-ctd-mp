package com.dh.ctd.mp.proyecto_final.controller;

import com.dh.ctd.mp.proyecto_final.dto.ReviewDTO;
import com.dh.ctd.mp.proyecto_final.exception.InvalidDataException;
import com.dh.ctd.mp.proyecto_final.exception.ResourceNotFoundException;
import com.dh.ctd.mp.proyecto_final.service.IReviewService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ReviewController.class)
public class ReviewControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private IReviewService reviewService;

    @Autowired
    private ObjectMapper objectMapper;

    private ReviewDTO review1;
    private ReviewDTO review2;

    @BeforeEach
    void setUp() {
        review1 = ReviewDTO.builder()
                .id(1L)
                .puntuacion(5)
                .comentario("Excelente producto")
                .fechaCreacion(LocalDateTime.now())
                .usuarioId(1L)
                .productoId(10L)
                .build();

        review2 = ReviewDTO.builder()
                .id(2L)
                .puntuacion(3)
                .comentario("Aceptable")
                .fechaCreacion(LocalDateTime.now())
                .usuarioId(2L)
                .productoId(20L)
                .build();
    }

    // ----------------- TEST CREAR -----------------
    @Test
    @WithMockUser
    void testCreateReview() throws Exception {
        Mockito.when(reviewService.save(any(ReviewDTO.class))).thenReturn(review1);

        mockMvc.perform(post("/api/reviews")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(review1)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(review1.getId().intValue())))
                .andExpect(jsonPath("$.puntuacion", is(review1.getPuntuacion())))
                .andExpect(jsonPath("$.comentario", is(review1.getComentario())));
    }

    @Test
    @WithMockUser
    void testCreateReview_InvalidData() throws Exception {
        ReviewDTO invalid = ReviewDTO.builder().puntuacion(0).comentario("").build();
        Mockito.when(reviewService.save(any(ReviewDTO.class)))
                .thenThrow(new InvalidDataException("Datos inválidos"));

        mockMvc.perform(post("/api/reviews")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("inválidos")));
    }

    @Test
    @WithMockUser
    void testCreateReview_UsuarioNotFound() throws Exception {
        Mockito.when(reviewService.save(any(ReviewDTO.class)))
                .thenThrow(new ResourceNotFoundException("Usuario no encontrado"));

        mockMvc.perform(post("/api/reviews")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(review1)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message", containsString("no encontrado")));
    }

    // ----------------- TEST LISTAR -----------------
    @Test
    @WithMockUser
    void testFindAllReviews() throws Exception {
        List<ReviewDTO> list = Arrays.asList(review1, review2);
        Mockito.when(reviewService.findAll()).thenReturn(list);

        mockMvc.perform(get("/api/reviews"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()", is(2)))
                .andExpect(jsonPath("$[0].comentario", is("Excelente producto")))
                .andExpect(jsonPath("$[1].comentario", is("Aceptable")));
    }

    // ----------------- TEST BUSCAR POR ID -----------------
    @Test
    @WithMockUser
    void testFindReviewById() throws Exception {
        Mockito.when(reviewService.findById(1L)).thenReturn(review1);

        mockMvc.perform(get("/api/reviews/{id}", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.puntuacion", is(5)));
    }

    @Test
    @WithMockUser
    void testFindReviewById_NotFound() throws Exception {
        Mockito.when(reviewService.findById(99L))
                .thenThrow(new ResourceNotFoundException("Review no encontrada con id: 99"));

        mockMvc.perform(get("/api/reviews/{id}", 99L))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message", containsString("no encontrada")));
    }

    // ----------------- TEST ELIMINAR -----------------
    @Test
    @WithMockUser
    void testDeleteReview() throws Exception {
        mockMvc.perform(delete("/api/reviews/{id}", 1L).with(csrf()))
                .andExpect(status().isNoContent());

        Mockito.verify(reviewService).delete(1L);
    }

    @Test
    @WithMockUser
    void testDeleteReview_NotFound() throws Exception {
        Mockito.doThrow(new ResourceNotFoundException("Review no encontrada con id: 99"))
                .when(reviewService).delete(99L);

        mockMvc.perform(delete("/api/reviews/{id}", 99L).with(csrf()))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message", containsString("no encontrada")));
    }

    // ----------------- TEST BUSQUEDAS ESPECÍFICAS -----------------
    @Test
    @WithMockUser
    void testFindByProductoId() throws Exception {
        List<ReviewDTO> list = Arrays.asList(review1);
        Mockito.when(reviewService.findByProductoId(10L)).thenReturn(list);

        mockMvc.perform(get("/api/reviews/producto/{productoId}", 10L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()", is(1)))
                .andExpect(jsonPath("$[0].productoId", is(10)));
    }

    @Test
    @WithMockUser
    void testFindByUsuarioId() throws Exception {
        List<ReviewDTO> list = Arrays.asList(review1);
        Mockito.when(reviewService.findByUsuarioId(1L)).thenReturn(list);

        mockMvc.perform(get("/api/reviews/usuario/{usuarioId}", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()", is(1)))
                .andExpect(jsonPath("$[0].usuarioId", is(1)));
    }
}

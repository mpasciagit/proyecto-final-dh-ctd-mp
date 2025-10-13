package com.dh.ctd.mp.proyecto_final.controller;

import com.dh.ctd.mp.proyecto_final.dto.FavoritoDTO;
import com.dh.ctd.mp.proyecto_final.exception.DuplicateResourceException;
import com.dh.ctd.mp.proyecto_final.exception.ResourceNotFoundException;
import com.dh.ctd.mp.proyecto_final.service.IFavoritoService;
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

@WebMvcTest(FavoritoController.class)
public class FavoritoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private IFavoritoService favoritoService;

    @Autowired
    private ObjectMapper objectMapper;

    private FavoritoDTO favorito1;
    private FavoritoDTO favorito2;

    @BeforeEach
    void setUp() {
        favorito1 = FavoritoDTO.builder()
                .id(1L)
                .fechaCreacion(LocalDateTime.now())
                .usuarioId(10L)
                .productoId(100L)
                .build();

        favorito2 = FavoritoDTO.builder()
                .id(2L)
                .fechaCreacion(LocalDateTime.now())
                .usuarioId(10L)
                .productoId(101L)
                .build();
    }

    // ----------------- TEST CREAR -----------------
    @Test
    @WithMockUser
    void testCreateFavorito() throws Exception {
        Mockito.when(favoritoService.save(any(FavoritoDTO.class))).thenReturn(favorito1);

        mockMvc.perform(post("/api/favoritos")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(favorito1)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(favorito1.getId().intValue())))
                .andExpect(jsonPath("$.usuarioId", is(favorito1.getUsuarioId().intValue())))
                .andExpect(jsonPath("$.productoId", is(favorito1.getProductoId().intValue())));
    }

    @Test
    @WithMockUser
    void testCreateFavorito_Duplicate() throws Exception {
        Mockito.when(favoritoService.save(any(FavoritoDTO.class)))
                .thenThrow(new DuplicateResourceException("El usuario ya marcó este producto como favorito."));

        mockMvc.perform(post("/api/favoritos")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(favorito1)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message", containsString("ya marcó este producto")));
    }

    // ----------------- TEST LISTAR -----------------
    @Test
    @WithMockUser
    void testFindAllFavoritos() throws Exception {
        List<FavoritoDTO> list = Arrays.asList(favorito1, favorito2);
        Mockito.when(favoritoService.findAll()).thenReturn(list);

        mockMvc.perform(get("/api/favoritos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()", is(2)))
                .andExpect(jsonPath("$[0].productoId", is(100)))
                .andExpect(jsonPath("$[1].productoId", is(101)));
    }

    @Test
    @WithMockUser
    void testFindFavoritoById() throws Exception {
        Mockito.when(favoritoService.findById(1L)).thenReturn(favorito1);

        mockMvc.perform(get("/api/favoritos/{id}", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.usuarioId", is(10)))
                .andExpect(jsonPath("$.productoId", is(100)));
    }

    @Test
    @WithMockUser
    void testFindFavoritoById_NotFound() throws Exception {
        Mockito.when(favoritoService.findById(99L))
                .thenThrow(new ResourceNotFoundException("Favorito no encontrado con id: 99"));

        mockMvc.perform(get("/api/favoritos/{id}", 99L))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message", containsString("no encontrado")));
    }

    // ----------------- TEST LISTAR POR USUARIO -----------------
    @Test
    @WithMockUser
    void testFindByUsuarioId() throws Exception {
        List<FavoritoDTO> list = Arrays.asList(favorito1, favorito2);
        Mockito.when(favoritoService.findByUsuarioId(10L)).thenReturn(list);

        mockMvc.perform(get("/api/favoritos/usuario/{usuarioId}", 10L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()", is(2)))
                .andExpect(jsonPath("$[0].productoId", is(100)))
                .andExpect(jsonPath("$[1].productoId", is(101)));
    }

    // ----------------- TEST ELIMINAR -----------------
    @Test
    @WithMockUser
    void testDeleteFavorito() throws Exception {
        mockMvc.perform(delete("/api/favoritos/{id}", 1L).with(csrf()))
                .andExpect(status().isNoContent());
        Mockito.verify(favoritoService).delete(1L);
    }

    @Test
    @WithMockUser
    void testDeleteFavorito_NotFound() throws Exception {
        Mockito.doThrow(new ResourceNotFoundException("Favorito no encontrado con id: 99"))
                .when(favoritoService).delete(99L);

        mockMvc.perform(delete("/api/favoritos/{id}", 99L).with(csrf()))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message", containsString("no encontrado")));
    }
}

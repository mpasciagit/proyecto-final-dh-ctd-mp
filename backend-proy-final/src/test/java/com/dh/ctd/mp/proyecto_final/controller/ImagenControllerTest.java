package com.dh.ctd.mp.proyecto_final.controller;

import com.dh.ctd.mp.proyecto_final.dto.ImagenDTO;
import com.dh.ctd.mp.proyecto_final.exception.InvalidDataException;
import com.dh.ctd.mp.proyecto_final.exception.ResourceNotFoundException;
import com.dh.ctd.mp.proyecto_final.service.IImagenService;
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

import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ImagenController.class)
public class ImagenControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private IImagenService imagenService;

    @Autowired
    private ObjectMapper objectMapper;

    private ImagenDTO imagen1;
    private ImagenDTO imagen2;

    @BeforeEach
    void setUp() {
        imagen1 = new ImagenDTO(1L, "http://ejemplo.com/imagen1.jpg", "Imagen 1", 1, 100L);
        imagen2 = new ImagenDTO(2L, "http://ejemplo.com/imagen2.jpg", "Imagen 2", 2, 100L);
    }

    // ----------------- TEST CREATE -----------------
    @Test
    @WithMockUser
    void testCreateImagen() throws Exception {
        Mockito.when(imagenService.save(any(ImagenDTO.class))).thenReturn(imagen1);

        mockMvc.perform(post("/api/imagenes")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(imagen1)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(imagen1.getId().intValue())))
                .andExpect(jsonPath("$.url", is(imagen1.getUrl())))
                .andExpect(jsonPath("$.productoId", is(imagen1.getProductoId().intValue())));
    }

    @Test
    @WithMockUser
    void testCreateImagen_InvalidData() throws Exception {
        Mockito.when(imagenService.save(any(ImagenDTO.class)))
                .thenThrow(new InvalidDataException("La URL de la imagen no puede estar vacía"));

        ImagenDTO invalid = new ImagenDTO();
        mockMvc.perform(post("/api/imagenes")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("no puede estar vacía")));
    }

    // ----------------- TEST FIND BY ID -----------------
    @Test
    @WithMockUser
    void testFindImagenById() throws Exception {
        Mockito.when(imagenService.findById(1L)).thenReturn(imagen1);

        mockMvc.perform(get("/api/imagenes/{id}", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.url", is(imagen1.getUrl())))
                .andExpect(jsonPath("$.productoId", is(100)));
    }

    @Test
    @WithMockUser
    void testFindImagenById_NotFound() throws Exception {
        Mockito.when(imagenService.findById(99L))
                .thenThrow(new ResourceNotFoundException("Imagen no encontrada con id: 99"));

        mockMvc.perform(get("/api/imagenes/{id}", 99L))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message", containsString("no encontrada")));
    }

    // ----------------- TEST FIND ALL -----------------
    @Test
    @WithMockUser
    void testFindAllImagenes() throws Exception {
        List<ImagenDTO> list = Arrays.asList(imagen1, imagen2);
        Mockito.when(imagenService.findAll()).thenReturn(list);

        mockMvc.perform(get("/api/imagenes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()", is(2)))
                .andExpect(jsonPath("$[0].url", is(imagen1.getUrl())))
                .andExpect(jsonPath("$[1].url", is(imagen2.getUrl())));
    }

    // ----------------- TEST FIND BY PRODUCTO -----------------
    @Test
    @WithMockUser
    void testFindByProductoId() throws Exception {
        List<ImagenDTO> list = Arrays.asList(imagen1, imagen2);
        Mockito.when(imagenService.findByProductoId(100L)).thenReturn(list);

        mockMvc.perform(get("/api/imagenes/producto/{productoId}", 100L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()", is(2)))
                .andExpect(jsonPath("$[0].productoId", is(100)))
                .andExpect(jsonPath("$[1].productoId", is(100)));
    }

    // ----------------- TEST DELETE -----------------
    @Test
    @WithMockUser
    void testDeleteImagen() throws Exception {
        mockMvc.perform(delete("/api/imagenes/{id}", 1L).with(csrf()))
                .andExpect(status().isNoContent());

        Mockito.verify(imagenService).delete(1L);
    }

    @Test
    @WithMockUser
    void testDeleteImagen_NotFound() throws Exception {
        Mockito.doThrow(new ResourceNotFoundException("Imagen no encontrada con id: 99"))
                .when(imagenService).delete(99L);

        mockMvc.perform(delete("/api/imagenes/{id}", 99L).with(csrf()))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message", containsString("no encontrada")));
    }
}

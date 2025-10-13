package com.dh.ctd.mp.proyecto_final.controller;

import com.dh.ctd.mp.proyecto_final.dto.CategoriaDTO;
import com.dh.ctd.mp.proyecto_final.exception.DuplicateResourceException;
import com.dh.ctd.mp.proyecto_final.exception.InvalidDataException;
import com.dh.ctd.mp.proyecto_final.exception.ResourceNotFoundException;
import com.dh.ctd.mp.proyecto_final.service.ICategoriaService;
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
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CategoriaController.class)
public class CategoriaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ICategoriaService categoriaService;

    @Autowired
    private ObjectMapper objectMapper;

    private CategoriaDTO categoria1;
    private CategoriaDTO categoria2;

    @BeforeEach
    void setUp() {
        categoria1 = CategoriaDTO.builder()
                .id(1L)
                .nombre("Autos")
                .descripcion("Vehículos de transporte")
                .urlImagen("imagenes/autos.png")
                .build();

        categoria2 = CategoriaDTO.builder()
                .id(2L)
                .nombre("Hoteles")
                .descripcion("Alojamiento y hospedaje")
                .urlImagen("imagenes/hoteles.png")
                .build();
    }

    // ----------------- TEST CREAR -----------------
    @Test
    @WithMockUser
    void testCreateCategoria() throws Exception {
        Mockito.when(categoriaService.save(any(CategoriaDTO.class))).thenReturn(categoria1);

        mockMvc.perform(post("/api/categorias")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(categoria1)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(categoria1.getId().intValue())))
                .andExpect(jsonPath("$.nombre", is(categoria1.getNombre())));
    }

    // ----------------- TEST LISTAR -----------------
    @Test
    @WithMockUser
    void testFindAllCategorias() throws Exception {
        List<CategoriaDTO> list = Arrays.asList(categoria1, categoria2);
        Mockito.when(categoriaService.findAll()).thenReturn(list);

        mockMvc.perform(get("/api/categorias"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()", is(2)))
                .andExpect(jsonPath("$[0].nombre", is("Autos")))
                .andExpect(jsonPath("$[1].nombre", is("Hoteles")));
    }

    // ----------------- TEST BUSCAR POR ID -----------------
    @Test
    @WithMockUser
    void testFindCategoriaById() throws Exception {
        Mockito.when(categoriaService.findById(1L)).thenReturn(categoria1);

        mockMvc.perform(get("/api/categorias/{id}", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.nombre", is("Autos")));
    }

    @Test
    @WithMockUser
    void testFindCategoriaById_NotFound() throws Exception {
        Mockito.when(categoriaService.findById(99L))
                .thenThrow(new ResourceNotFoundException("Categoría con id 99 no encontrada"));

        mockMvc.perform(get("/api/categorias/{id}", 99L))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message", containsString("no encontrada")));
    }

    // ----------------- TEST ACTUALIZAR -----------------
    @Test
    @WithMockUser
    void testUpdateCategoria() throws Exception {
        CategoriaDTO updated = CategoriaDTO.builder()
                .id(1L)
                .nombre("Autos y Vehículos")
                .descripcion("Vehículos terrestres")
                .urlImagen("imagenes/autos_actualizado.png")
                .build();

        Mockito.when(categoriaService.update(any(CategoriaDTO.class))).thenReturn(updated);

        mockMvc.perform(put("/api/categorias/{id}", 1L)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre", is("Autos y Vehículos")))
                .andExpect(jsonPath("$.descripcion", is("Vehículos terrestres")));
    }

    @Test
    @WithMockUser
    void testUpdateCategoria_InvalidData() throws Exception {
        CategoriaDTO invalid = CategoriaDTO.builder().id(1L).nombre("").build();
        Mockito.when(categoriaService.update(any(CategoriaDTO.class)))
                .thenThrow(new InvalidDataException("El nombre de la categoría es obligatorio."));

        mockMvc.perform(put("/api/categorias/{id}", 1L)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("obligatorio")));
    }

    @Test
    @WithMockUser
    void testUpdateCategoria_Duplicate() throws Exception {
        CategoriaDTO duplicate = CategoriaDTO.builder().id(1L).nombre("Hoteles").build();
        Mockito.when(categoriaService.update(any(CategoriaDTO.class)))
                .thenThrow(new DuplicateResourceException("Ya existe otra categoría con el nombre: Hoteles"));

        mockMvc.perform(put("/api/categorias/{id}", 1L)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(duplicate)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message", containsString("Ya existe otra categoría")));
    }

    // ----------------- TEST ELIMINAR -----------------
    @Test
    @WithMockUser
    void testDeleteCategoria() throws Exception {
        mockMvc.perform(delete("/api/categorias/{id}", 1L).with(csrf()))
                .andExpect(status().isNoContent());
        Mockito.verify(categoriaService).delete(1L);
    }

    @Test
    @WithMockUser
    void testDeleteCategoria_NotFound() throws Exception {
        Mockito.doThrow(new ResourceNotFoundException("Categoría con id 99 no encontrada"))
                .when(categoriaService).delete(99L);

        mockMvc.perform(delete("/api/categorias/{id}", 99L).with(csrf()))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message", containsString("no encontrada")));
    }
}

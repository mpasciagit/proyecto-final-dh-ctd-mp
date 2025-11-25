package com.dh.ctd.mp.proyecto_final.controller;

import com.dh.ctd.mp.proyecto_final.dto.ProductoDTO;
import com.dh.ctd.mp.proyecto_final.exception.GlobalExceptionHandler;
import com.dh.ctd.mp.proyecto_final.exception.InvalidDataException;
import com.dh.ctd.mp.proyecto_final.exception.ResourceNotFoundException;
import com.dh.ctd.mp.proyecto_final.service.IProductoService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class ProductoControllerTest {

    private MockMvc mockMvc;

    @Mock
    private IProductoService productoService;

    private ObjectMapper objectMapper;

    private ProductoDTO producto1;
    private ProductoDTO producto2;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        ProductoController productoController = new ProductoController(productoService);
        mockMvc = MockMvcBuilders.standaloneSetup(productoController)
                .setControllerAdvice(new GlobalExceptionHandler()) // Manejador de errores
                .build();
        objectMapper = new ObjectMapper();

        producto1 = ProductoDTO.builder()
                .id(1L)
                .nombre("Producto A")
                .descripcion("Descripción A")
                .precio(100.0)
                .reservable(true)
                .cantidadTotal(5)
                .build();

        producto2 = ProductoDTO.builder()
                .id(2L)
                .nombre("Producto B")
                .descripcion("Descripción B")
                .precio(200.0)
                .reservable(false)
                .cantidadTotal(0)
                .build();
    }

    // ----------------- TEST CREAR -----------------
    @Test
    @WithMockUser
    void testCreateProducto() throws Exception {
        Mockito.when(productoService.save(any(ProductoDTO.class))).thenReturn(producto1);

        mockMvc.perform(post("/api/productos")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(producto1)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(producto1.getId().intValue())))
                .andExpect(jsonPath("$.nombre", is(producto1.getNombre())))
                .andExpect(jsonPath("$.precio", is(producto1.getPrecio())));
    }

    @Test
    @WithMockUser
    void testCreateProducto_InvalidData() throws Exception {
        Mockito.when(productoService.save(any(ProductoDTO.class)))
                .thenThrow(new InvalidDataException("El nombre y el precio son obligatorios."));

        mockMvc.perform(post("/api/productos")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new ProductoDTO())))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("obligatorios")));
    }

    // ----------------- TEST LISTAR -----------------
    @Test
    @WithMockUser
    void testFindAllProductos() throws Exception {
        List<ProductoDTO> list = Arrays.asList(producto1, producto2);
        Mockito.when(productoService.findAll()).thenReturn(list);

        mockMvc.perform(get("/api/productos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()", is(2)))
                .andExpect(jsonPath("$[0].nombre", is("Producto A")))
                .andExpect(jsonPath("$[1].nombre", is("Producto B")));
    }

    // ----------------- TEST BUSCAR POR ID -----------------
    @Test
    @WithMockUser
    void testFindProductoById() throws Exception {
        Mockito.when(productoService.findById(1L)).thenReturn(producto1);

        mockMvc.perform(get("/api/productos/{id}", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.nombre", is("Producto A")));
    }

    @Test
    @WithMockUser
    void testFindProductoById_NotFound() throws Exception {
        Mockito.when(productoService.findById(99L))
                .thenThrow(new ResourceNotFoundException("Producto no encontrado con id: 99"));

        mockMvc.perform(get("/api/productos/{id}", 99L))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message", containsString("no encontrado")));
    }

    // ----------------- TEST ELIMINAR -----------------
    @Test
    @WithMockUser
    void testDeleteProducto() throws Exception {
        mockMvc.perform(delete("/api/productos/{id}", 1L).with(csrf()))
                .andExpect(status().isNoContent());

        Mockito.verify(productoService).delete(1L);
    }

    @Test
    @WithMockUser
    void testDeleteProducto_NotFound() throws Exception {
        Mockito.doThrow(new ResourceNotFoundException("Producto no encontrado con id: 99"))
                .when(productoService).delete(99L);

        mockMvc.perform(delete("/api/productos/{id}", 99L).with(csrf()))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message", containsString("no encontrado")));
    }
}
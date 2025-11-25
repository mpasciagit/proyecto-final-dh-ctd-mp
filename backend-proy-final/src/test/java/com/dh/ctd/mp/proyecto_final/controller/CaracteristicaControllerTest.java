package com.dh.ctd.mp.proyecto_final.controller;

import com.dh.ctd.mp.proyecto_final.dto.CaracteristicaDTO;
import com.dh.ctd.mp.proyecto_final.exception.GlobalExceptionHandler;
import com.dh.ctd.mp.proyecto_final.exception.ResourceNotFoundException;
import com.dh.ctd.mp.proyecto_final.service.ICaracteristicaService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.is;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WithMockUser(username = "testuser", roles = {"SUPER_ADMIN"})
public class CaracteristicaControllerTest {

    @Autowired
    private ObjectMapper objectMapper;

    @Mock
    private ICaracteristicaService caracteristicaService;

    @InjectMocks
    private CaracteristicaController caracteristicaController;

    private MockMvc mockMvc;

    private CaracteristicaDTO caracteristica1;
    private CaracteristicaDTO caracteristica2;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(caracteristicaController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();

        objectMapper = new ObjectMapper();
        caracteristica1 = CaracteristicaDTO.builder()
                .id(1L)
                .nombre("4 personas")
                .descripcion("Capacidad para 4 pasajeros")
                .iconoUrl("iconos/4_personas.svg")
                .build();

        caracteristica2 = CaracteristicaDTO.builder()
                .id(2L)
                .nombre("2 valijas")
                .descripcion("Capacidad para 2 valijas")
                .iconoUrl("iconos/2_valijas.svg")
                .build();
    }

    @Test
    void testCreateCaracteristica() throws Exception {
        when(caracteristicaService.save(any(CaracteristicaDTO.class))).thenReturn(caracteristica1);

        mockMvc.perform(post("/api/caracteristicas").with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(caracteristica1)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(caracteristica1.getId().intValue())))
                .andExpect(jsonPath("$.nombre", is(caracteristica1.getNombre())));
    }

    @Test
    void testFindAllCaracteristicas() throws Exception {
        List<CaracteristicaDTO> list = Arrays.asList(caracteristica1, caracteristica2);
        when(caracteristicaService.findAll()).thenReturn(list);

        mockMvc.perform(get("/api/caracteristicas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()", is(2)))
                .andExpect(jsonPath("$[0].nombre", is("4 personas")))
                .andExpect(jsonPath("$[1].nombre", is("2 valijas")));
    }

    @Test
    void testFindCaracteristicaById() throws Exception {
        when(caracteristicaService.findById(1L)).thenReturn(caracteristica1);

        mockMvc.perform(get("/api/caracteristicas/{id}", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.nombre", is("4 personas")));
    }

    @Test
    void testFindCaracteristicaById_NotFound() throws Exception {
        when(caracteristicaService.findById(99L))
                .thenThrow(new ResourceNotFoundException("Característica con id 99 no encontrada"));

        mockMvc.perform(get("/api/caracteristicas/{id}", 99L))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message", containsString("no encontrada")));
    }

    @Test
    void testUpdateCaracteristica() throws Exception {
        CaracteristicaDTO updated = CaracteristicaDTO.builder()
                .id(1L)
                .nombre("5 personas")
                .descripcion("Capacidad para 5 pasajeros")
                .iconoUrl("iconos/5_personas.svg")
                .build();

        when(caracteristicaService.update(any(CaracteristicaDTO.class))).thenReturn(updated);

        mockMvc.perform(put("/api/caracteristicas/{id}", 1L).with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre", is("5 personas")))
                .andExpect(jsonPath("$.descripcion", is("Capacidad para 5 pasajeros")));
    }

    @Test
    void testDeleteCaracteristica() throws Exception {
        mockMvc.perform(delete("/api/caracteristicas/{id}", 1L).with(csrf()))
                .andExpect(status().isNoContent());
        verify(caracteristicaService).delete(1L);
    }
}
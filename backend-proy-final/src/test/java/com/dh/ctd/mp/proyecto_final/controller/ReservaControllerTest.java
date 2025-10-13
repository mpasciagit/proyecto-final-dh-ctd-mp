package com.dh.ctd.mp.proyecto_final.controller;

import com.dh.ctd.mp.proyecto_final.dto.ReservaDTO;
import com.dh.ctd.mp.proyecto_final.entity.EstadoReserva;
import com.dh.ctd.mp.proyecto_final.exception.BusinessRuleException;
import com.dh.ctd.mp.proyecto_final.exception.InvalidDataException;
import com.dh.ctd.mp.proyecto_final.exception.ResourceNotFoundException;
import com.dh.ctd.mp.proyecto_final.service.IReservaService;
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

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ReservaController.class)
public class ReservaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private IReservaService reservaService;

    @Autowired
    private ObjectMapper objectMapper;

    private ReservaDTO reserva1;
    private ReservaDTO reserva2;

    @BeforeEach
    void setUp() {
        reserva1 = new ReservaDTO(1L,
                LocalDate.of(2025, 10, 5),
                LocalDate.of(2025, 10, 10),
                EstadoReserva.PENDIENTE.name(),
                1L,
                1L);

        reserva2 = new ReservaDTO(2L,
                LocalDate.of(2025, 11, 1),
                LocalDate.of(2025, 11, 5),
                EstadoReserva.CONFIRMADA.name(),
                2L,
                2L);
    }

    // ----------------- TEST CREAR -----------------
    @Test
    @WithMockUser
    void testCreateReserva() throws Exception {
        Mockito.when(reservaService.save(any(ReservaDTO.class))).thenReturn(reserva1);

        mockMvc.perform(post("/api/reservas")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reserva1)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(reserva1.getId().intValue())))
                .andExpect(jsonPath("$.estado", is(reserva1.getEstado())))
                .andExpect(jsonPath("$.usuarioId", is(reserva1.getUsuarioId().intValue())));
    }

    @Test
    @WithMockUser
    void testCreateReserva_InvalidData() throws Exception {
        Mockito.when(reservaService.save(any(ReservaDTO.class)))
                .thenThrow(new InvalidDataException("Datos inválidos"));

        mockMvc.perform(post("/api/reservas")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new ReservaDTO())))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("inválidos")));
    }

    @Test
    @WithMockUser
    void testCreateReserva_BusinessRuleException() throws Exception {
        Mockito.when(reservaService.save(any(ReservaDTO.class)))
                .thenThrow(new BusinessRuleException("Producto ya reservado"));

        mockMvc.perform(post("/api/reservas")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reserva1)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("ya reservado")));
    }

    // ----------------- TEST LISTAR -----------------
    @Test
    @WithMockUser
    void testFindAllReservas() throws Exception {
        List<ReservaDTO> list = Arrays.asList(reserva1, reserva2);
        Mockito.when(reservaService.findAll()).thenReturn(list);

        mockMvc.perform(get("/api/reservas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()", is(2)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[1].id", is(2)));
    }

    // ----------------- TEST BUSCAR POR ID -----------------
    @Test
    @WithMockUser
    void testFindReservaById() throws Exception {
        Mockito.when(reservaService.findById(1L)).thenReturn(reserva1);

        mockMvc.perform(get("/api/reservas/{id}", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.estado", is(reserva1.getEstado())));
    }

    @Test
    @WithMockUser
    void testFindReservaById_NotFound() throws Exception {
        Mockito.when(reservaService.findById(99L))
                .thenThrow(new ResourceNotFoundException("Reserva no encontrada con id: 99"));

        mockMvc.perform(get("/api/reservas/{id}", 99L))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message", containsString("no encontrada")));
    }

    // ----------------- TEST ACTUALIZAR -----------------
    @Test
    @WithMockUser
    void testUpdateReserva() throws Exception {
        ReservaDTO updated = reserva1;
        updated.setEstado(EstadoReserva.CONFIRMADA.name());

        Mockito.when(reservaService.update(any(ReservaDTO.class))).thenReturn(updated);

        mockMvc.perform(put("/api/reservas/{id}", 1L)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.estado", is("CONFIRMADA")));
    }

    @Test
    @WithMockUser
    void testUpdateReserva_NotFound() throws Exception {
        Mockito.when(reservaService.update(any(ReservaDTO.class)))
                .thenThrow(new ResourceNotFoundException("Reserva no encontrada con id: 99"));

        mockMvc.perform(put("/api/reservas/{id}", 99L)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reserva1)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message", containsString("no encontrada")));
    }

    // ----------------- TEST ELIMINAR -----------------
    @Test
    @WithMockUser
    void testDeleteReserva() throws Exception {
        mockMvc.perform(delete("/api/reservas/{id}", 1L).with(csrf()))
                .andExpect(status().isNoContent());

        Mockito.verify(reservaService).delete(1L);
    }

    @Test
    @WithMockUser
    void testDeleteReserva_NotFound() throws Exception {
        Mockito.doThrow(new ResourceNotFoundException("Reserva no encontrada con id: 99"))
                .when(reservaService).delete(99L);

        mockMvc.perform(delete("/api/reservas/{id}", 99L).with(csrf()))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message", containsString("no encontrada")));
    }

    // ----------------- TEST BUSQUEDAS ESPECÍFICAS -----------------
    @Test
    @WithMockUser
    void testFindByUsuario() throws Exception {
        List<ReservaDTO> list = Arrays.asList(reserva1);
        Mockito.when(reservaService.findByUsuario(1L)).thenReturn(list);

        mockMvc.perform(get("/api/reservas/usuario/{usuarioId}", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()", is(1)))
                .andExpect(jsonPath("$[0].usuarioId", is(1)));
    }

    @Test
    @WithMockUser
    void testFindByProducto() throws Exception {
        List<ReservaDTO> list = Arrays.asList(reserva1);
        Mockito.when(reservaService.findByProducto(1L)).thenReturn(list);

        mockMvc.perform(get("/api/reservas/producto/{productoId}", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()", is(1)))
                .andExpect(jsonPath("$[0].productoId", is(1)));
    }

    @Test
    @WithMockUser
    void testFindByRangoFechas() throws Exception {
        List<ReservaDTO> list = Arrays.asList(reserva1);
        Mockito.when(reservaService.findByFechaInicioBetween(
                        LocalDate.of(2025,10,1),
                        LocalDate.of(2025,10,20)))
                .thenReturn(list);

        mockMvc.perform(get("/api/reservas/rango-fechas")
                        .param("desde", "2025-10-01")
                        .param("hasta", "2025-10-20"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()", is(1)));
    }

    @Test
    @WithMockUser
    void testFindByEstado() throws Exception {
        List<ReservaDTO> list = Arrays.asList(reserva1);
        Mockito.when(reservaService.findByEstado(EstadoReserva.PENDIENTE)).thenReturn(list);

        mockMvc.perform(get("/api/reservas/estado/{estado}", EstadoReserva.PENDIENTE))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()", is(1)));
    }

    @Test
    @WithMockUser
    void testFindByUsuarioYEstado() throws Exception {
        List<ReservaDTO> list = Arrays.asList(reserva1);
        Mockito.when(reservaService.findByUsuarioAndEstado(1L, EstadoReserva.PENDIENTE)).thenReturn(list);

        mockMvc.perform(get("/api/reservas/usuario/{usuarioId}/estado/{estado}", 1L, EstadoReserva.PENDIENTE))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()", is(1)));
    }

    @Test
    @WithMockUser
    void testFindByProductoYEstado() throws Exception {
        List<ReservaDTO> list = Arrays.asList(reserva1);
        Mockito.when(reservaService.findByProductoAndEstado(1L, EstadoReserva.PENDIENTE)).thenReturn(list);

        mockMvc.perform(get("/api/reservas/producto/{productoId}/estado/{estado}", 1L, EstadoReserva.PENDIENTE))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()", is(1)));
    }
}

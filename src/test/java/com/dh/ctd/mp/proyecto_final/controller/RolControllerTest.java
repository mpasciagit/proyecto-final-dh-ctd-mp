package com.dh.ctd.mp.proyecto_final.controller;

import com.dh.ctd.mp.proyecto_final.dto.RolDTO;
import com.dh.ctd.mp.proyecto_final.exception.DuplicateResourceException;
import com.dh.ctd.mp.proyecto_final.exception.ResourceNotFoundException;
import com.dh.ctd.mp.proyecto_final.service.IRolService;
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

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(RolController.class)
class RolControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private IRolService rolService;

    @Autowired
    private ObjectMapper objectMapper;

    private RolDTO rol1;
    private RolDTO rol2;

    @BeforeEach
    void setup() {
        rol1 = new RolDTO(1L, "ADMIN", "Administrador general");
        rol2 = new RolDTO(2L, "USER", "Usuario estándar");
    }

    // ---------------------------
    // CREATE
    // ---------------------------

    @Test
    @WithMockUser
    void testCreateRol_Success() throws Exception {
        Mockito.when(rolService.save(any(RolDTO.class))).thenReturn(rol1);

        mockMvc.perform(post("/api/roles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(rol1))
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("ADMIN"));
    }

    @Test
    @WithMockUser
    void testCreateRol_Duplicate() throws Exception {
        Mockito.when(rolService.save(any(RolDTO.class)))
                .thenThrow(new DuplicateResourceException("Rol con nombre 'ADMIN' ya existe"));

        mockMvc.perform(post("/api/roles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(rol1))
                        .with(csrf()))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("Rol con nombre 'ADMIN' ya existe"));
    }

    // ---------------------------
    // UPDATE
    // ---------------------------

    @Test
    @WithMockUser
    void testUpdateRol_Success() throws Exception {
        Mockito.when(rolService.update(anyLong(), any(RolDTO.class))).thenReturn(rol1);

        mockMvc.perform(put("/api/roles/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(rol1))
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("ADMIN"));
    }

    @Test
    @WithMockUser
    void testUpdateRol_Duplicate() throws Exception {
        Mockito.when(rolService.update(anyLong(), any(RolDTO.class)))
                .thenThrow(new DuplicateResourceException("Rol con nombre 'ADMIN' ya existe"));

        mockMvc.perform(put("/api/roles/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(rol1))
                        .with(csrf()))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("Rol con nombre 'ADMIN' ya existe"));
    }

    // ---------------------------
    // FIND BY ID
    // ---------------------------

    @Test
    @WithMockUser
    void testGetRolById_Success() throws Exception {
        Mockito.when(rolService.findById(1L)).thenReturn(rol1);

        mockMvc.perform(get("/api/roles/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("ADMIN"));
    }

    @Test
    @WithMockUser
    void testGetRolById_NotFound() throws Exception {
        Mockito.when(rolService.findById(1L))
                .thenThrow(new ResourceNotFoundException("Rol no encontrado con id: 1"));

        mockMvc.perform(get("/api/roles/1"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Rol no encontrado con id: 1"));
    }

    // ---------------------------
    // FIND BY NAME
    // ---------------------------

    @Test
    @WithMockUser
    void testGetRolByNombre_Success() throws Exception {
        Mockito.when(rolService.findByNombre("ADMIN")).thenReturn(rol1);

        mockMvc.perform(get("/api/roles/nombre/ADMIN"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.descripcion").value("Administrador general"));
    }

    @Test
    @WithMockUser
    void testGetRolByNombre_NotFound() throws Exception {
        Mockito.when(rolService.findByNombre("ADMIN"))
                .thenThrow(new ResourceNotFoundException("Rol no encontrado con nombre: ADMIN"));

        mockMvc.perform(get("/api/roles/nombre/ADMIN"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Rol no encontrado con nombre: ADMIN"));
    }

    // ---------------------------
    // LIST ALL
    // ---------------------------

    @Test
    @WithMockUser
    void testGetAllRoles() throws Exception {
        List<RolDTO> roles = Arrays.asList(rol1, rol2);
        Mockito.when(rolService.findAll()).thenReturn(roles);

        mockMvc.perform(get("/api/roles"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    // ---------------------------
    // DELETE
    // ---------------------------

    @Test
    @WithMockUser
    void testDeleteRol_Success() throws Exception {
        doNothing().when(rolService).delete(1L);

        mockMvc.perform(delete("/api/roles/1").with(csrf()))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser
    void testDeleteRol_NotFound() throws Exception {
        doThrow(new ResourceNotFoundException("Rol no encontrado con id: 1"))
                .when(rolService).delete(1L);

        mockMvc.perform(delete("/api/roles/1").with(csrf()))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Rol no encontrado con id: 1"));
    }
}

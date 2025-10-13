package com.dh.ctd.mp.proyecto_final.controller;

import com.dh.ctd.mp.proyecto_final.dto.UsuarioDTO;
import com.dh.ctd.mp.proyecto_final.service.IUsuarioService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class UsuarioControllerTest {

    private MockMvc mockMvc;

    @Mock
    private IUsuarioService usuarioService;

    @InjectMocks
    private UsuarioController usuarioController;

    private ObjectMapper objectMapper;
    private UsuarioDTO usuarioDTO;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(usuarioController).build();
        objectMapper = new ObjectMapper();

        usuarioDTO = UsuarioDTO.builder()
                .id(1L)
                .email("test@example.com")
                .nombre("Juan")
                .apellido("Perez")
                .password("1234")
                .rol(new UsuarioDTO.RolDTO(1L, "USER"))
                .build();
    }

    // 1️⃣ Crear usuario - requiere ADMIN
    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void testCreateUsuario_Success() throws Exception {
        when(usuarioService.save(any())).thenReturn(usuarioDTO);

        mockMvc.perform(post("/api/usuarios")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(usuarioDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("test@example.com"));
    }

    // 2️⃣ Obtener usuario por ID - cualquiera puede
    @Test
    @WithMockUser(username = "user", roles = {"USER"})
    void testGetUsuarioById_Success() throws Exception {
        when(usuarioService.findById(1L)).thenReturn(usuarioDTO);

        mockMvc.perform(get("/api/usuarios/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Juan"));
    }

    // 3️⃣ Listar todos - cualquiera puede
    @Test
    @WithMockUser(username = "user", roles = {"USER"})
    void testListarUsuarios_Success() throws Exception {
        List<UsuarioDTO> usuarios = Arrays.asList(usuarioDTO);
        when(usuarioService.findAll()).thenReturn(usuarios);

        mockMvc.perform(get("/api/usuarios"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].email").value("test@example.com"));
    }

    // 4️⃣ Actualizar usuario - requiere ADMIN
    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void testUpdateUsuario_Success() throws Exception {
        when(usuarioService.update(any())).thenReturn(usuarioDTO);

        mockMvc.perform(put("/api/usuarios/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(usuarioDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Juan"));
    }

    // 5️⃣ Eliminar usuario - requiere ADMIN
    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void testDeleteUsuario_Success() throws Exception {
        mockMvc.perform(delete("/api/usuarios/1"))
                .andExpect(status().isNoContent());
    }

    // 6️⃣ Buscar usuarios por rol - cualquiera puede
    @Test
    @WithMockUser(username = "user", roles = {"USER"})
    void testFindByRol_Success() throws Exception {
        List<UsuarioDTO> usuarios = Arrays.asList(usuarioDTO);
        when(usuarioService.findByRol("USER")).thenReturn(usuarios);

        mockMvc.perform(get("/api/usuarios/rol/USER"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].rol.nombre").value("USER"));
    }

    // 7️⃣ Buscar usuarios por nombre - cualquiera puede
    @Test
    @WithMockUser(username = "user", roles = {"USER"})
    void testFindByNombre_Success() throws Exception {
        List<UsuarioDTO> usuarios = Arrays.asList(usuarioDTO);
        when(usuarioService.findByNombre("Juan")).thenReturn(usuarios);

        mockMvc.perform(get("/api/usuarios/nombre/Juan"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nombre").value("Juan"));
    }

    // 8️⃣ Buscar usuario por email - cualquiera puede
    @Test
    @WithMockUser(username = "user", roles = {"USER"})
    void testFindByEmail_Success() throws Exception {
        when(usuarioService.findByEmail("test@example.com")).thenReturn(usuarioDTO);

        mockMvc.perform(get("/api/usuarios/email/test@example.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("test@example.com"));
    }
}

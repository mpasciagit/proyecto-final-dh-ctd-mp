package com.dh.ctd.mp.proyecto_final.controller;

import com.dh.ctd.mp.proyecto_final.authentication.ChangePasswordRequest;
import com.dh.ctd.mp.proyecto_final.dto.UsuarioDTO;
import com.dh.ctd.mp.proyecto_final.service.IUsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final IUsuarioService usuarioService;

    @Autowired
    public UsuarioController(IUsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    // 🔹 Crear usuario (ADMIN o SUPER_ADMIN)
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @PostMapping
    public ResponseEntity<UsuarioDTO> crearUsuario(@RequestBody UsuarioDTO usuarioDTO) {
        UsuarioDTO nuevoUsuario = usuarioService.save(usuarioDTO);
        return ResponseEntity.ok(nuevoUsuario);
    }

    // 🔹 Obtener usuario por ID
    // - ADMIN/SUPER_ADMIN pueden ver cualquier usuario
    // - USER solo puede ver su propio ID
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or #id == principal.usuarioId")
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO> obtenerUsuarioPorId(@PathVariable Long id) {
        UsuarioDTO usuario = usuarioService.findById(id);
        return ResponseEntity.ok(usuario);
    }

    // 🔹 Listar todos los usuarios (solo ADMIN o SUPER_ADMIN)
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @GetMapping
    public ResponseEntity<List<UsuarioDTO>> listarTodos() {
        return ResponseEntity.ok(usuarioService.findAll());
    }

    // 🔹 Actualizar usuario
    // - ADMIN/SUPER_ADMIN pueden actualizar cualquier usuario
    // - USER solo puede actualizar sus propios datos
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or #id == principal.usuarioId")
    @PutMapping("/{id}")
    public ResponseEntity<UsuarioDTO> actualizarUsuario(@PathVariable Long id,
                                                        @RequestBody UsuarioDTO usuarioDTO) {
        usuarioDTO.setId(id);
        UsuarioDTO actualizado = usuarioService.update(usuarioDTO);
        return ResponseEntity.ok(actualizado);
    }

    // 🔹 Eliminar usuario (solo ADMIN o SUPER_ADMIN)
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id) {
        usuarioService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // 🔹 Buscar usuarios por rol (solo ADMIN o SUPER_ADMIN)
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @GetMapping("/rol/{nombreRol}")
    public ResponseEntity<List<UsuarioDTO>> obtenerPorRol(@PathVariable String nombreRol) {
        return ResponseEntity.ok(usuarioService.findByRol(nombreRol));
    }

    // 🔹 Buscar usuarios por nombre (solo ADMIN o SUPER_ADMIN)
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @GetMapping("/nombre/{nombre}")
    public ResponseEntity<List<UsuarioDTO>> obtenerPorNombre(@PathVariable String nombre) {
        return ResponseEntity.ok(usuarioService.findByNombre(nombre));
    }

    // 🔹 Buscar usuario por email (solo ADMIN o SUPER_ADMIN)
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @GetMapping("/email/{email}")
    public ResponseEntity<UsuarioDTO> obtenerPorEmail(@PathVariable String email) {
        UsuarioDTO usuario = usuarioService.findByEmail(email);
        return ResponseEntity.ok(usuario);
    }

    // 🔹 Resetear password de un usuario (solo ADMIN o SUPER_ADMIN)
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @PutMapping("/reset-password/{userId}")
    public ResponseEntity<Void> resetearPassword(
            @PathVariable Long userId,
            @RequestBody ChangePasswordRequest request) {
        usuarioService.resetPassword(userId, request.getNewPassword());
        return ResponseEntity.noContent().build();
    }

}

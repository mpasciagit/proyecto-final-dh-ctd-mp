package com.dh.ctd.mp.proyecto_final.controller;

import com.dh.ctd.mp.proyecto_final.authentication.ChangePasswordRequest;
import com.dh.ctd.mp.proyecto_final.dto.UsuarioDTO;
import com.dh.ctd.mp.proyecto_final.service.IUsuarioService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "usuarios", description = "Gestión de Usuarios")
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final IUsuarioService usuarioService;

    @Autowired
    public UsuarioController(IUsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    // ----------------- CREAR -----------------
    @PreAuthorize("hasAuthority('USUARIO:CREAR')")
    @PostMapping
    public ResponseEntity<UsuarioDTO> crearUsuario(@RequestBody UsuarioDTO usuarioDTO) {
        UsuarioDTO nuevoUsuario = usuarioService.save(usuarioDTO);
        return ResponseEntity.ok(nuevoUsuario);
    }

    // ----------------- OBTENER POR ID -----------------
    @PreAuthorize("hasAuthority('USUARIO:BUSCAR')")
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO> obtenerUsuarioPorId(@PathVariable Long id) {
        UsuarioDTO usuario = usuarioService.findById(id);
        return ResponseEntity.ok(usuario);
    }

    // ----------------- LISTAR TODOS -----------------
    @PreAuthorize("hasAuthority('USUARIO:LISTAR')")
    @GetMapping
    public ResponseEntity<List<UsuarioDTO>> listarTodos() {
        return ResponseEntity.ok(usuarioService.findAll());
    }

    // ----------------- ACTUALIZAR -----------------
    @PreAuthorize("hasAuthority('USUARIO:MODIFICAR')")
    @PutMapping("/{id}")
    public ResponseEntity<UsuarioDTO> actualizarUsuario(@PathVariable Long id,
                                                        @RequestBody UsuarioDTO usuarioDTO) {
        usuarioDTO.setId(id);
        UsuarioDTO actualizado = usuarioService.update(usuarioDTO);
        return ResponseEntity.ok(actualizado);
    }

    // ----------------- ELIMINAR -----------------
    @PreAuthorize("hasAuthority('USUARIO:ELIMINAR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id) {
        usuarioService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ----------------- BUSCAR POR ROL -----------------
    @PreAuthorize("hasAuthority('USUARIO:BUSCAR')")
    @GetMapping("/rol/{nombreRol}")
    public ResponseEntity<List<UsuarioDTO>> obtenerPorRol(@PathVariable String nombreRol) {
        return ResponseEntity.ok(usuarioService.findByRol(nombreRol));
    }

    // ----------------- BUSCAR POR NOMBRE -----------------
    @PreAuthorize("hasAuthority('USUARIO:BUSCAR')")
    @GetMapping("/nombre/{nombre}")
    public ResponseEntity<List<UsuarioDTO>> obtenerPorNombre(@PathVariable String nombre) {
        return ResponseEntity.ok(usuarioService.findByNombre(nombre));
    }

    // ----------------- BUSCAR POR EMAIL -----------------
    @PreAuthorize("hasAuthority('USUARIO:BUSCAR')")
    @GetMapping("/email/{email}")
    public ResponseEntity<UsuarioDTO> obtenerPorEmail(@PathVariable String email) {
        UsuarioDTO usuario = usuarioService.findByEmail(email);
        return ResponseEntity.ok(usuario);
    }

    // ----------------- RESETEAR PASSWORD -----------------
    /**
     * Permite al usuario cambiar su contraseña o a un administrador generar una nueva temporal.
     * Si el request trae una nueva contraseña → cambio normal del usuario.
     * Si se invoca sin cuerpo → reset administrativo (por ejemplo, desde panel).
     */
    @PreAuthorize("hasAuthority('USUARIO:MODIFICAR')")
    @PutMapping("/reset-password/{userId}")
    public ResponseEntity<?> resetearPassword(
            @PathVariable Long userId,
            @RequestBody(required = false) ChangePasswordRequest request) {

        if (request != null && request.getNewPassword() != null) {
            usuarioService.resetPassword(userId, request.getNewPassword());
            return ResponseEntity.ok().body(
                    java.util.Map.of("message", "Contraseña actualizada correctamente.")
            );
        } else {
            usuarioService.resetPasswordByAdmin(userId);
            return ResponseEntity.ok().body(
                    java.util.Map.of("message", "Contraseña temporal generada y enviada al usuario.")
            );
        }
    }
}

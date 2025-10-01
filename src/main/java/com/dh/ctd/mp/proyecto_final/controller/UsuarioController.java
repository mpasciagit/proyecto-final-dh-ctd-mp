package com.dh.ctd.mp.proyecto_final.controller;

import com.dh.ctd.mp.proyecto_final.dto.UsuarioDTO;
import com.dh.ctd.mp.proyecto_final.exception.DuplicateResourceException;
import com.dh.ctd.mp.proyecto_final.exception.ResourceNotFoundException;
import com.dh.ctd.mp.proyecto_final.service.IUsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

    // 1️⃣ Crear usuario
    @PostMapping
    public ResponseEntity<UsuarioDTO> crearUsuario(@RequestBody UsuarioDTO usuarioDTO) {
        try {
            UsuarioDTO nuevoUsuario = usuarioService.save(usuarioDTO);
            return ResponseEntity.ok(nuevoUsuario);
        } catch (DuplicateResourceException e) {
            return ResponseEntity.status(409).body(null);
        }
    }

    // 2️⃣ Buscar usuario por ID
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO> obtenerUsuarioPorId(@PathVariable Long id) {
        try {
            UsuarioDTO usuario = usuarioService.findById(id);
            return ResponseEntity.ok(usuario);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // 3️⃣ Listar todos los usuarios
    @GetMapping
    public ResponseEntity<List<UsuarioDTO>> listarTodos() {
        return ResponseEntity.ok(usuarioService.findAll());
    }

    // 4️⃣ Actualizar usuario
    @PutMapping("/{id}")
    public ResponseEntity<UsuarioDTO> actualizarUsuario(@PathVariable Long id,
                                                        @RequestBody UsuarioDTO usuarioDTO) {
        try {
            usuarioDTO.setId(id);
            UsuarioDTO actualizado = usuarioService.update(usuarioDTO);
            return ResponseEntity.ok(actualizado);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (DuplicateResourceException e) {
            return ResponseEntity.status(409).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(null);
        }
    }

    // 5️⃣ Eliminar usuario
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id) {
        try {
            usuarioService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // 6️⃣ Buscar usuarios por rol
    @GetMapping("/rol/{nombreRol}")
    public ResponseEntity<List<UsuarioDTO>> obtenerPorRol(@PathVariable String nombreRol) {
        return ResponseEntity.ok(usuarioService.findByRol(nombreRol));
    }

    // 7️⃣ Buscar usuarios por nombre
    @GetMapping("/nombre/{nombre}")
    public ResponseEntity<List<UsuarioDTO>> obtenerPorNombre(@PathVariable String nombre) {
        return ResponseEntity.ok(usuarioService.findByNombre(nombre));
    }

    // 8️⃣ Buscar usuario por email
    @GetMapping("/email/{email}")
    public ResponseEntity<UsuarioDTO> obtenerPorEmail(@PathVariable String email) {
        try {
            UsuarioDTO usuario = usuarioService.findByEmail(email);
            return ResponseEntity.ok(usuario);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}

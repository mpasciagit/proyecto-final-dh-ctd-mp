package com.dh.ctd.mp.proyecto_final.controller;

import com.dh.ctd.mp.proyecto_final.dto.RolDTO;
import com.dh.ctd.mp.proyecto_final.service.IRolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "roles", description = "Gestión de Roles")
@RestController
@RequestMapping("/api/roles")
public class RolController {

    private final IRolService rolService;

    @Autowired
    public RolController(IRolService rolService) {
        this.rolService = rolService;
    }

    // ----------------- CREAR -----------------
    @PreAuthorize("hasAuthority('ROL:CREAR')")
    @PostMapping
    public ResponseEntity<RolDTO> crearRol(@RequestBody RolDTO rolDTO) {
        RolDTO nuevoRol = rolService.save(rolDTO);
        return ResponseEntity.ok(nuevoRol);
    }

    // ----------------- OBTENER POR ID -----------------
    @PreAuthorize("hasAuthority('ROL:BUSCAR')")
    @GetMapping("/{id}")
    public ResponseEntity<RolDTO> obtenerRolPorId(@PathVariable Long id) {
        RolDTO rol = rolService.findById(id);
        return ResponseEntity.ok(rol);
    }

    // ----------------- LISTAR TODOS -----------------
    // @PreAuthorize("hasAuthority('ROL:LISTAR')")
    @GetMapping
    public ResponseEntity<List<RolDTO>> listarTodos() {
        List<RolDTO> roles = rolService.findAll();
        return ResponseEntity.ok(roles);
    }

    // ----------------- ACTUALIZAR -----------------
    @PreAuthorize("hasAuthority('ROL:MODIFICAR')")
    @PutMapping("/{id}")
    public ResponseEntity<RolDTO> actualizarRol(@PathVariable Long id, @RequestBody RolDTO rolDTO) {
        RolDTO actualizado = rolService.update(id, rolDTO);
        return ResponseEntity.ok(actualizado);
    }

    // ----------------- ELIMINAR -----------------
    @PreAuthorize("hasAuthority('ROL:ELIMINAR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarRol(@PathVariable Long id) {
        rolService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ----------------- BUSCAR POR NOMBRE -----------------
    @PreAuthorize("hasAuthority('ROL:BUSCAR')")
    @GetMapping("/nombre/{nombre}")
    public ResponseEntity<RolDTO> obtenerPorNombre(@PathVariable String nombre) {
        RolDTO rol = rolService.findByNombre(nombre);
        return ResponseEntity.ok(rol);
    }
}
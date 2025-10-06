package com.dh.ctd.mp.proyecto_final.controller;

import com.dh.ctd.mp.proyecto_final.dto.RolDTO;
import com.dh.ctd.mp.proyecto_final.service.IRolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
public class RolController {

    private final IRolService rolService;

    @Autowired
    public RolController(IRolService rolService) {
        this.rolService = rolService;
    }

    // 🔹 Crear rol (solo SUPER_ADMIN)
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @PostMapping
    public ResponseEntity<RolDTO> crearRol(@RequestBody RolDTO rolDTO) {
        RolDTO nuevoRol = rolService.save(rolDTO);
        return ResponseEntity.ok(nuevoRol);
    }

    // 🔹 Buscar rol por ID (ADMIN o SUPER_ADMIN)
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<RolDTO> obtenerRolPorId(@PathVariable Long id) {
        RolDTO rol = rolService.findById(id);
        return ResponseEntity.ok(rol);
    }

    // 🔹 Listar todos los roles (ADMIN o SUPER_ADMIN)
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @GetMapping
    public ResponseEntity<List<RolDTO>> listarTodos() {
        List<RolDTO> roles = rolService.findAll();
        return ResponseEntity.ok(roles);
    }

    // 🔹 Actualizar rol (solo SUPER_ADMIN)
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<RolDTO> actualizarRol(@PathVariable Long id, @RequestBody RolDTO rolDTO) {
        RolDTO actualizado = rolService.update(id, rolDTO);
        return ResponseEntity.ok(actualizado);
    }

    // 🔹 Eliminar rol (solo SUPER_ADMIN)
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarRol(@PathVariable Long id) {
        rolService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // 🔹 Buscar rol por nombre (ADMIN o SUPER_ADMIN)
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @GetMapping("/nombre/{nombre}")
    public ResponseEntity<RolDTO> obtenerPorNombre(@PathVariable String nombre) {
        RolDTO rol = rolService.findByNombre(nombre);
        return ResponseEntity.ok(rol);
    }
}

package com.dh.ctd.mp.proyecto_final.controller;

import com.dh.ctd.mp.proyecto_final.dto.RolDTO;
import com.dh.ctd.mp.proyecto_final.service.IRolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

    // 1️⃣ Crear rol
    @PostMapping
    public ResponseEntity<RolDTO> crearRol(@RequestBody RolDTO rolDTO) {
        RolDTO nuevoRol = rolService.save(rolDTO);
        return ResponseEntity.ok(nuevoRol);
    }

    // 2️⃣ Buscar rol por ID
    @GetMapping("/{id}")
    public ResponseEntity<RolDTO> obtenerRolPorId(@PathVariable Long id) {
        RolDTO rol = rolService.findById(id);
        return ResponseEntity.ok(rol);
    }

    // 3️⃣ Listar todos los roles
    @GetMapping
    public ResponseEntity<List<RolDTO>> listarTodos() {
        List<RolDTO> roles = rolService.findAll();
        return ResponseEntity.ok(roles);
    }

    // 4️⃣ Actualizar rol
    @PutMapping("/{id}")
    public ResponseEntity<RolDTO> actualizarRol(@PathVariable Long id, @RequestBody RolDTO rolDTO) {
        RolDTO actualizado = rolService.update(id, rolDTO);
        return ResponseEntity.ok(actualizado);
    }

    // 5️⃣ Eliminar rol
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarRol(@PathVariable Long id) {
        rolService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // 6️⃣ Buscar rol por nombre
    @GetMapping("/nombre/{nombre}")
    public ResponseEntity<RolDTO> obtenerPorNombre(@PathVariable String nombre) {
        RolDTO rol = rolService.findByNombre(nombre);
        return ResponseEntity.ok(rol);
    }
}

package com.dh.ctd.mp.proyecto_final.controller;

import com.dh.ctd.mp.proyecto_final.dto.CaracteristicaDTO;
import com.dh.ctd.mp.proyecto_final.service.ICaracteristicaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/caracteristicas")
public class CaracteristicaController {

    @Autowired
    private ICaracteristicaService caracteristicaService;

    // 🔹 Crear (solo ADMIN)
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<CaracteristicaDTO> crear(@RequestBody CaracteristicaDTO dto) {
        return ResponseEntity.ok(caracteristicaService.save(dto));
    }

    // 🔹 Buscar por ID (USER o ADMIN)
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<CaracteristicaDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(caracteristicaService.findById(id));
    }

    // 🔹 Listar todas (USER o ADMIN)
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping
    public ResponseEntity<List<CaracteristicaDTO>> listarTodas() {
        return ResponseEntity.ok(caracteristicaService.findAll());
    }

    // 🔹 Actualizar (solo ADMIN)
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<CaracteristicaDTO> actualizar(@PathVariable Long id, @RequestBody CaracteristicaDTO dto) {
        dto.setId(id);
        return ResponseEntity.ok(caracteristicaService.update(dto));
    }

    // 🔹 Eliminar (solo ADMIN)
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        caracteristicaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

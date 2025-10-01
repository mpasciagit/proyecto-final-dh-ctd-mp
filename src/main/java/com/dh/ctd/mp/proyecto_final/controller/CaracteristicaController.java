package com.dh.ctd.mp.proyecto_final.controller;

import com.dh.ctd.mp.proyecto_final.dto.CaracteristicaDTO;
import com.dh.ctd.mp.proyecto_final.service.ICaracteristicaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/caracteristicas")
public class CaracteristicaController {

    @Autowired
    private ICaracteristicaService caracteristicaService;

    @PostMapping
    public ResponseEntity<CaracteristicaDTO> crear(@RequestBody CaracteristicaDTO dto) {
        return ResponseEntity.ok(caracteristicaService.save(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CaracteristicaDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(caracteristicaService.findById(id));
    }

    @GetMapping
    public ResponseEntity<List<CaracteristicaDTO>> listarTodas() {
        return ResponseEntity.ok(caracteristicaService.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<CaracteristicaDTO> actualizar(@PathVariable Long id, @RequestBody CaracteristicaDTO dto) {
        dto.setId(id);
        return ResponseEntity.ok(caracteristicaService.update(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        caracteristicaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

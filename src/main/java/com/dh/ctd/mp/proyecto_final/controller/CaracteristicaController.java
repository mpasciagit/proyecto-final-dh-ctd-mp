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
        CaracteristicaDTO guardada = caracteristicaService.save(dto);
        return ResponseEntity.ok(guardada);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CaracteristicaDTO> buscarPorId(@PathVariable Long id) {
        Optional<CaracteristicaDTO> dto = caracteristicaService.findById(id);
        return dto.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<CaracteristicaDTO>> listarTodas() {
        List<CaracteristicaDTO> lista = caracteristicaService.findAll();
        return ResponseEntity.ok(lista);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CaracteristicaDTO> actualizar(@PathVariable Long id, @RequestBody CaracteristicaDTO dto) {
        dto.setId(id);
        Optional<CaracteristicaDTO> actualizada = caracteristicaService.update(dto);
        return actualizada.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        caracteristicaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
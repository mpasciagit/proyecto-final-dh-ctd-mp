package com.dh.ctd.mp.proyecto_final.controller;

import com.dh.ctd.mp.proyecto_final.dto.ProductoCaracteristicaDTO;
import com.dh.ctd.mp.proyecto_final.service.IProductoCaracteristicaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/producto-caracteristicas")
public class ProductoCaracteristicaController {

    @Autowired
    private IProductoCaracteristicaService productoCaracteristicaService;

    @GetMapping
    public ResponseEntity<List<ProductoCaracteristicaDTO>> getAll() {
        return ResponseEntity.ok(productoCaracteristicaService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductoCaracteristicaDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(productoCaracteristicaService.findById(id));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('PRODUCTOCARACTERISTICA:CREAR')")
    public ResponseEntity<ProductoCaracteristicaDTO> create(@RequestBody ProductoCaracteristicaDTO dto) {
        return ResponseEntity.ok(productoCaracteristicaService.save(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('PRODUCTOCARACTERISTICA:MODIFICAR')")
    public ResponseEntity<ProductoCaracteristicaDTO> update(@PathVariable Long id, @RequestBody ProductoCaracteristicaDTO dto) {
        dto.setId(id);
        return ResponseEntity.ok(productoCaracteristicaService.update(dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('PRODUCTOCARACTERISTICA:ELIMINAR')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productoCaracteristicaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
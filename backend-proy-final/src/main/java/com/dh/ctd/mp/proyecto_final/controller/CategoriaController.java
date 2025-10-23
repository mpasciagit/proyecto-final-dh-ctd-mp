package com.dh.ctd.mp.proyecto_final.controller;

import com.dh.ctd.mp.proyecto_final.dto.CategoriaDTO;
import com.dh.ctd.mp.proyecto_final.service.ICategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {

    private final ICategoriaService categoriaService;

    @Autowired
    public CategoriaController(ICategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }

    // 🔹 Crear categoría
    @PreAuthorize("hasAuthority('CATEGORIA:CREAR')")
    @PostMapping
    public ResponseEntity<CategoriaDTO> crear(@RequestBody CategoriaDTO dto) {
        return ResponseEntity.ok(categoriaService.save(dto));
    }

    // 🔹 Buscar por ID
    // 🌍 Endpoint público - no requiere autenticación
    @GetMapping("/{id}")
    public ResponseEntity<CategoriaDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(categoriaService.findById(id));
    }

    // 🔹 Listar todas
    // 🌍 Endpoint público - no requiere autenticación
    @GetMapping
    public ResponseEntity<List<CategoriaDTO>> listarTodas() {
        return ResponseEntity.ok(categoriaService.findAll());
    }

    // 🔹 Actualizar categoría
    @PreAuthorize("hasAuthority('CATEGORIA:MODIFICAR')")
    @PutMapping("/{id}")
    public ResponseEntity<CategoriaDTO> actualizar(@PathVariable Long id, @RequestBody CategoriaDTO dto) {
        dto.setId(id);
        return ResponseEntity.ok(categoriaService.update(dto));
    }

    // 🔹 Eliminar categoría
    @PreAuthorize("hasAuthority('CATEGORIA:ELIMINAR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        categoriaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
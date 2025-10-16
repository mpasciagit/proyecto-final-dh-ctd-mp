package com.dh.ctd.mp.proyecto_final.controller;

import com.dh.ctd.mp.proyecto_final.dto.ImagenDTO;
import com.dh.ctd.mp.proyecto_final.service.IImagenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/imagenes")
public class ImagenController {

    private final IImagenService imagenService;

    @Autowired
    public ImagenController(IImagenService imagenService) {
        this.imagenService = imagenService;
    }

    // 🔹 Crear imagen
    @PreAuthorize("hasAuthority('IMAGEN:CREAR')")
    @PostMapping
    public ResponseEntity<ImagenDTO> crear(@RequestBody ImagenDTO imagenDTO) {
        return ResponseEntity.ok(imagenService.save(imagenDTO));
    }

    // 🔹 Buscar imagen por ID
    @PreAuthorize("hasAuthority('IMAGEN:BUSCAR')")
    @GetMapping("/{id}")
    public ResponseEntity<ImagenDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(imagenService.findById(id));
    }

    // 🔹 Listar todas las imágenes
    @PreAuthorize("hasAuthority('IMAGEN:LISTAR')")
    @GetMapping
    public ResponseEntity<List<ImagenDTO>> listarTodas() {
        return ResponseEntity.ok(imagenService.findAll());
    }

    // 🔹 Eliminar imagen
    @PreAuthorize("hasAuthority('IMAGEN:ELIMINAR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        imagenService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // 🔹 Listar imágenes por producto
    @PreAuthorize("hasAuthority('IMAGEN:LISTAR')")
    @GetMapping("/producto/{productoId}")
    public ResponseEntity<List<ImagenDTO>> listarPorProducto(@PathVariable Long productoId) {
        return ResponseEntity.ok(imagenService.findByProductoId(productoId));
    }

    // 🔹 Modificar imagen
    @PreAuthorize("hasAuthority('IMAGEN:MODIFICAR')")
    @PutMapping("/{id}")
    public ResponseEntity<ImagenDTO> modificar(@PathVariable Long id, @RequestBody ImagenDTO imagenDTO) {
        imagenDTO.setId(id);
        return ResponseEntity.ok(imagenService.update(imagenDTO));
    }
}
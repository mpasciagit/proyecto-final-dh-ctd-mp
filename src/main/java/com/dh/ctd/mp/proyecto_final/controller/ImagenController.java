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

    // 🔹 Crear imagen (solo ADMIN)
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ImagenDTO> crearImagen(@RequestBody ImagenDTO imagenDTO) {
        return ResponseEntity.ok(imagenService.save(imagenDTO));
    }

    // 🔹 Obtener imagen por ID (USER o ADMIN)
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<ImagenDTO> obtenerImagen(@PathVariable Long id) {
        return ResponseEntity.ok(imagenService.findById(id));
    }

    // 🔹 Listar todas las imágenes (USER o ADMIN)
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping
    public ResponseEntity<List<ImagenDTO>> listarImagenes() {
        return ResponseEntity.ok(imagenService.findAll());
    }

    // 🔹 Eliminar imagen (solo ADMIN)
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarImagen(@PathVariable Long id) {
        imagenService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // 🔹 Listar imágenes por producto (USER o ADMIN)
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping("/producto/{productoId}")
    public ResponseEntity<List<ImagenDTO>> listarPorProducto(@PathVariable Long productoId) {
        return ResponseEntity.ok(imagenService.findByProductoId(productoId));
    }
}

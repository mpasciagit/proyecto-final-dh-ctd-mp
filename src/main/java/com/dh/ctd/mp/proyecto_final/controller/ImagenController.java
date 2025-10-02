package com.dh.ctd.mp.proyecto_final.controller;

import com.dh.ctd.mp.proyecto_final.dto.ImagenDTO;
import com.dh.ctd.mp.proyecto_final.service.IImagenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

    @PostMapping
    public ResponseEntity<ImagenDTO> crearImagen(@RequestBody ImagenDTO imagenDTO) {
        return ResponseEntity.ok(imagenService.save(imagenDTO));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ImagenDTO> obtenerImagen(@PathVariable Long id) {
        return ResponseEntity.ok(imagenService.findById(id));
    }

    @GetMapping
    public ResponseEntity<List<ImagenDTO>> listarImagenes() {
        return ResponseEntity.ok(imagenService.findAll());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarImagen(@PathVariable Long id) {
        imagenService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/producto/{productoId}")
    public ResponseEntity<List<ImagenDTO>> listarPorProducto(@PathVariable Long productoId) {
        return ResponseEntity.ok(imagenService.findByProductoId(productoId));
    }
}

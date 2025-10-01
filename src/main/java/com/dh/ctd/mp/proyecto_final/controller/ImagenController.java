package com.dh.ctd.mp.proyecto_final.controller;

import com.dh.ctd.mp.proyecto_final.dto.ImagenDTO;
import com.dh.ctd.mp.proyecto_final.exception.ResourceNotFoundException;
import com.dh.ctd.mp.proyecto_final.service.IImagenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/imagenes")
public class ImagenController {

    @Autowired
    private IImagenService imagenService;

    @PostMapping
    public ResponseEntity<ImagenDTO> crearImagen(@RequestBody ImagenDTO imagenDTO) {
        ImagenDTO guardada = imagenService.save(imagenDTO);
        return ResponseEntity.ok(guardada);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ImagenDTO> obtenerImagen(@PathVariable Long id) {
        try {
            ImagenDTO imagen = imagenService.findById(id);
            return ResponseEntity.ok(imagen);
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<ImagenDTO>> listarImagenes() {
        return ResponseEntity.ok(imagenService.findAll());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarImagen(@PathVariable Long id) {
        try {
            imagenService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/producto/{productoId}")
    public ResponseEntity<List<ImagenDTO>> listarPorProducto(@PathVariable Long productoId) {
        return ResponseEntity.ok(imagenService.findByProductoId(productoId));
    }
}

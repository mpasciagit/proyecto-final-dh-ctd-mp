package com.dh.ctd.mp.proyecto_final.controller;

import com.dh.ctd.mp.proyecto_final.dto.FavoritoDTO;
import com.dh.ctd.mp.proyecto_final.service.IFavoritoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favoritos")
public class FavoritoController {

    private final IFavoritoService favoritoService;

    @Autowired
    public FavoritoController(IFavoritoService favoritoService) {
        this.favoritoService = favoritoService;
    }

    // 🔹 Crear favorito (solo USER)
    @PreAuthorize("hasRole('USER')")
    @PostMapping
    public ResponseEntity<FavoritoDTO> crearFavorito(@RequestBody FavoritoDTO favoritoDTO) {
        return ResponseEntity.ok(favoritoService.save(favoritoDTO));
    }

    // 🔹 Obtener favorito por ID (ADMIN o USER)
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<FavoritoDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(favoritoService.findById(id));
    }

    // 🔹 Listar todos los favoritos (solo ADMIN)
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<FavoritoDTO>> listarTodos() {
        return ResponseEntity.ok(favoritoService.findAll());
    }

    // 🔹 Eliminar favorito (solo USER o ADMIN)
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        favoritoService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // 🔹 Listar favoritos por usuario (solo USER o ADMIN)
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<FavoritoDTO>> listarPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(favoritoService.findByUsuarioId(usuarioId));
    }
}

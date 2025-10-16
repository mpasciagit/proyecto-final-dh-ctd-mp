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

    // 🔹 Crear favorito
    @PreAuthorize("hasAuthority('FAVORITO:CREAR')")
    @PostMapping
    public ResponseEntity<FavoritoDTO> crear(@RequestBody FavoritoDTO favoritoDTO) {
        return ResponseEntity.ok(favoritoService.save(favoritoDTO));
    }

    // 🔹 Buscar favorito por ID
    @PreAuthorize("hasAuthority('FAVORITO:BUSCAR')")
    @GetMapping("/{id}")
    public ResponseEntity<FavoritoDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(favoritoService.findById(id));
    }

    // 🔹 Listar todos los favoritos
    @PreAuthorize("hasAuthority('FAVORITO:LISTAR')")
    @GetMapping
    public ResponseEntity<List<FavoritoDTO>> listarTodos() {
        return ResponseEntity.ok(favoritoService.findAll());
    }

    // 🔹 Eliminar favorito
    @PreAuthorize("hasAuthority('FAVORITO:ELIMINAR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        favoritoService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // 🔹 Listar favoritos por usuario
    @PreAuthorize("hasAuthority('FAVORITO:LISTAR')")
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<FavoritoDTO>> listarPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(favoritoService.findByUsuarioId(usuarioId));
    }

    // 🔹 Modificar favorito
    @PreAuthorize("hasAuthority('FAVORITO:MODIFICAR')")
    @PutMapping("/{id}")
    public ResponseEntity<FavoritoDTO> modificar(@PathVariable Long id, @RequestBody FavoritoDTO favoritoDTO) {
        favoritoDTO.setId(id);
        return ResponseEntity.ok(favoritoService.update(favoritoDTO));
    }
}
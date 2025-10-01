package com.dh.ctd.mp.proyecto_final.controller;

import com.dh.ctd.mp.proyecto_final.dto.FavoritoDTO;
import com.dh.ctd.mp.proyecto_final.service.IFavoritoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/favoritos")
public class FavoritoController {

    private final IFavoritoService favoritoService;

    @Autowired
    public FavoritoController(IFavoritoService favoritoService) {
        this.favoritoService = favoritoService;
    }

    @PostMapping
    public ResponseEntity<FavoritoDTO> crearFavorito(@RequestBody FavoritoDTO favoritoDTO) {
        return ResponseEntity.ok(favoritoService.save(favoritoDTO));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FavoritoDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(favoritoService.findById(id));
    }

    @GetMapping
    public ResponseEntity<List<FavoritoDTO>> listarTodos() {
        return ResponseEntity.ok(favoritoService.findAll());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        favoritoService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<FavoritoDTO>> listarPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(favoritoService.findByUsuarioId(usuarioId));
    }
}

package com.dh.ctd.mp.proyecto_final.controller;

import com.dh.ctd.mp.proyecto_final.dto.ReservaDTO;
import com.dh.ctd.mp.proyecto_final.entity.EstadoReserva;
import com.dh.ctd.mp.proyecto_final.service.IReservaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/reservas")
public class ReservaController {

    private final IReservaService reservaService;

    @Autowired
    public ReservaController(IReservaService reservaService) {
        this.reservaService = reservaService;
    }

    // --- CRUD genérico ---

    @PostMapping
    public ResponseEntity<ReservaDTO> crearReserva(@RequestBody ReservaDTO reservaDTO) {
        ReservaDTO nuevaReserva = reservaService.save(reservaDTO);
        return ResponseEntity.ok(nuevaReserva);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservaDTO> obtenerReservaPorId(@PathVariable Long id) {
        Optional<ReservaDTO> reserva = reservaService.findById(id);
        return reserva.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<ReservaDTO>> listarTodas() {
        return ResponseEntity.ok(reservaService.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReservaDTO> actualizarReserva(@PathVariable Long id, @RequestBody ReservaDTO reservaDTO) {
        try {
            reservaDTO.setId(id);
            ReservaDTO actualizada = reservaService.update(reservaDTO);
            return ResponseEntity.ok(actualizada);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarReserva(@PathVariable Long id) {
        reservaService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // --- Búsquedas específicas ---

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<ReservaDTO>> obtenerPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(reservaService.findByUsuario(usuarioId));
    }

    @GetMapping("/producto/{productoId}")
    public ResponseEntity<List<ReservaDTO>> obtenerPorProducto(@PathVariable Long productoId) {
        return ResponseEntity.ok(reservaService.findByProducto(productoId));
    }

    @GetMapping("/rango-fechas")
    public ResponseEntity<List<ReservaDTO>> obtenerPorRangoFechas(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta) {
        return ResponseEntity.ok(reservaService.findByFechaInicioBetween(desde, hasta));
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<ReservaDTO>> obtenerPorEstado(@PathVariable EstadoReserva estado) {
        return ResponseEntity.ok(reservaService.findByEstado(estado));
    }

    @GetMapping("/usuario/{usuarioId}/estado/{estado}")
    public ResponseEntity<List<ReservaDTO>> obtenerPorUsuarioYEstado(
            @PathVariable Long usuarioId,
            @PathVariable EstadoReserva estado) {
        return ResponseEntity.ok(reservaService.findByUsuarioAndEstado(usuarioId, estado));
    }

    @GetMapping("/producto/{productoId}/estado/{estado}")
    public ResponseEntity<List<ReservaDTO>> obtenerPorProductoYEstado(
            @PathVariable Long productoId,
            @PathVariable EstadoReserva estado) {
        return ResponseEntity.ok(reservaService.findByProductoAndEstado(productoId, estado));
    }
}
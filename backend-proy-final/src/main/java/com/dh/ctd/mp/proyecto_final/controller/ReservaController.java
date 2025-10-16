package com.dh.ctd.mp.proyecto_final.controller;

import com.dh.ctd.mp.proyecto_final.dto.ReservaDTO;
import com.dh.ctd.mp.proyecto_final.entity.EstadoReserva;
import com.dh.ctd.mp.proyecto_final.service.IReservaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "reservas", description = "Gestión de Reservas")
@RestController
@RequestMapping("/api/reservas")
public class ReservaController {

    private final IReservaService reservaService;

    @Autowired
    public ReservaController(IReservaService reservaService) {
        this.reservaService = reservaService;
    }

    // ----------------- CREAR -----------------
    @PreAuthorize("hasAuthority('RESERVA:CREAR')")
    @PostMapping
    public ResponseEntity<ReservaDTO> crearReserva(@RequestBody ReservaDTO reservaDTO) {
        ReservaDTO nuevaReserva = reservaService.save(reservaDTO);
        return ResponseEntity.ok(nuevaReserva);
    }

    // ----------------- OBTENER POR ID -----------------
    @PreAuthorize("hasAuthority('RESERVA:BUSCAR')")
    @GetMapping("/{id}")
    public ResponseEntity<ReservaDTO> obtenerReservaPorId(@PathVariable Long id) {
        ReservaDTO reserva = reservaService.findById(id);
        return ResponseEntity.ok(reserva);
    }

    // ----------------- LISTAR TODAS -----------------
    @PreAuthorize("hasAuthority('RESERVA:LISTAR')")
    @GetMapping
    public ResponseEntity<List<ReservaDTO>> listarTodas() {
        return ResponseEntity.ok(reservaService.findAll());
    }

    // ----------------- ACTUALIZAR -----------------
    @PreAuthorize("hasAuthority('RESERVA:MODIFICAR')")
    @PutMapping("/{id}")
    public ResponseEntity<ReservaDTO> actualizarReserva(@PathVariable Long id, @RequestBody ReservaDTO reservaDTO) {
        reservaDTO.setId(id);
        ReservaDTO actualizada = reservaService.update(reservaDTO);
        return ResponseEntity.ok(actualizada);
    }

    // ----------------- ELIMINAR -----------------
    @PreAuthorize("hasAuthority('RESERVA:ELIMINAR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarReserva(@PathVariable Long id) {
        reservaService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ----------------- CONSULTAS POR USUARIO -----------------
    @PreAuthorize("hasAuthority('RESERVA:BUSCAR')")
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<ReservaDTO>> obtenerPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(reservaService.findByUsuario(usuarioId));
    }

    // ----------------- CONSULTAS POR PRODUCTO -----------------
    @PreAuthorize("hasAuthority('RESERVA:LISTAR')")
    @GetMapping("/producto/{productoId}")
    public ResponseEntity<List<ReservaDTO>> obtenerPorProducto(@PathVariable Long productoId) {
        return ResponseEntity.ok(reservaService.findByProducto(productoId));
    }

    // ----------------- RANGO DE FECHAS -----------------
    @PreAuthorize("hasAuthority('RESERVA:LISTAR')")
    @GetMapping("/rango-fechas")
    public ResponseEntity<List<ReservaDTO>> obtenerPorRangoFechas(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta) {
        return ResponseEntity.ok(reservaService.findByFechaInicioBetween(desde, hasta));
    }

    // ----------------- FILTROS POR ESTADO -----------------
    @PreAuthorize("hasAuthority('RESERVA:BUSCAR')")
    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<ReservaDTO>> obtenerPorEstado(@PathVariable EstadoReserva estado) {
        return ResponseEntity.ok(reservaService.findByEstado(estado));
    }

    @PreAuthorize("hasAuthority('RESERVA:BUSCAR')")
    @GetMapping("/usuario/{usuarioId}/estado/{estado}")
    public ResponseEntity<List<ReservaDTO>> obtenerPorUsuarioYEstado(
            @PathVariable Long usuarioId,
            @PathVariable EstadoReserva estado) {
        return ResponseEntity.ok(reservaService.findByUsuarioAndEstado(usuarioId, estado));
    }

    @PreAuthorize("hasAuthority('RESERVA:LISTAR')")
    @GetMapping("/producto/{productoId}/estado/{estado}")
    public ResponseEntity<List<ReservaDTO>> obtenerPorProductoYEstado(
            @PathVariable Long productoId,
            @PathVariable EstadoReserva estado) {
        return ResponseEntity.ok(reservaService.findByProductoAndEstado(productoId, estado));
    }
}
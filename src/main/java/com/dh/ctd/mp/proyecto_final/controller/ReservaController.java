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
    // ✅ Solo USER autenticado puede crear reservas
    @PreAuthorize("hasRole('USER')")
    @PostMapping
    public ResponseEntity<ReservaDTO> crearReserva(@RequestBody ReservaDTO reservaDTO) {
        ReservaDTO nuevaReserva = reservaService.save(reservaDTO);
        return ResponseEntity.ok(nuevaReserva);
    }

    // ----------------- OBTENER POR ID -----------------
    // ✅ USER autenticado puede ver sus reservas
    // ✅ ADMIN puede ver cualquier reserva
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<ReservaDTO> obtenerReservaPorId(@PathVariable Long id) {
        ReservaDTO reserva = reservaService.findById(id);
        return ResponseEntity.ok(reserva);
    }

    // ----------------- LISTAR TODAS -----------------
    // ✅ Solo ADMIN puede listar todas las reservas del sistema
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<ReservaDTO>> listarTodas() {
        return ResponseEntity.ok(reservaService.findAll());
    }

    // ----------------- ACTUALIZAR -----------------
    // ✅ USER puede modificar su propia reserva (control adicional podría ir en el service)
    // ✅ ADMIN puede actualizar cualquiera
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ReservaDTO> actualizarReserva(@PathVariable Long id, @RequestBody ReservaDTO reservaDTO) {
        reservaDTO.setId(id);
        ReservaDTO actualizada = reservaService.update(reservaDTO);
        return ResponseEntity.ok(actualizada);
    }

    // ----------------- ELIMINAR -----------------
    // ✅ Solo ADMIN puede eliminar reservas
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarReserva(@PathVariable Long id) {
        reservaService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ----------------- CONSULTAS POR USUARIO -----------------
    // ✅ Solo USER autenticado o ADMIN puede ver reservas por usuario
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<ReservaDTO>> obtenerPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(reservaService.findByUsuario(usuarioId));
    }

    // ----------------- CONSULTAS POR PRODUCTO -----------------
    // ✅ ADMIN puede consultar todas las reservas de un producto
    // ✅ USER no debería tener acceso (no tiene sentido que vea reservas de otros usuarios)
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/producto/{productoId}")
    public ResponseEntity<List<ReservaDTO>> obtenerPorProducto(@PathVariable Long productoId) {
        return ResponseEntity.ok(reservaService.findByProducto(productoId));
    }

    // ----------------- RANGO DE FECHAS -----------------
    // ✅ ADMIN puede consultar por rango
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/rango-fechas")
    public ResponseEntity<List<ReservaDTO>> obtenerPorRangoFechas(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta) {
        return ResponseEntity.ok(reservaService.findByFechaInicioBetween(desde, hasta));
    }

    // ----------------- FILTROS POR ESTADO -----------------
    // ✅ ADMIN puede consultar cualquier reserva por estado
    // ✅ USER puede consultar sus propias reservas por estado
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<ReservaDTO>> obtenerPorEstado(@PathVariable EstadoReserva estado) {
        return ResponseEntity.ok(reservaService.findByEstado(estado));
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @GetMapping("/usuario/{usuarioId}/estado/{estado}")
    public ResponseEntity<List<ReservaDTO>> obtenerPorUsuarioYEstado(
            @PathVariable Long usuarioId,
            @PathVariable EstadoReserva estado) {
        return ResponseEntity.ok(reservaService.findByUsuarioAndEstado(usuarioId, estado));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/producto/{productoId}/estado/{estado}")
    public ResponseEntity<List<ReservaDTO>> obtenerPorProductoYEstado(
            @PathVariable Long productoId,
            @PathVariable EstadoReserva estado) {
        return ResponseEntity.ok(reservaService.findByProductoAndEstado(productoId, estado));
    }
}

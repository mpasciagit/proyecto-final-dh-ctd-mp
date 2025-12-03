package com.dh.ctd.mp.proyecto_final.service;

import com.dh.ctd.mp.proyecto_final.dto.ReservaDTO;
import com.dh.ctd.mp.proyecto_final.entity.EstadoReserva;

import java.time.LocalDate;
import java.util.List;

public interface IReservaService {
    ReservaDTO save(ReservaDTO reservaDTO);
    ReservaDTO findById(Long id);
    List<ReservaDTO> findAll();
    ReservaDTO update(ReservaDTO reservaDTO);
    void delete(Long id);

    // Extras específicos de Reserva
    List<ReservaDTO> findByUsuario(Long usuarioId);
    List<ReservaDTO> findByProducto(Long productoId);
    List<ReservaDTO> findByFechaInicioBetween(LocalDate desde, LocalDate hasta);
    List<ReservaDTO> findByEstado(EstadoReserva estado);
    List<ReservaDTO> findByUsuarioAndEstado(Long usuarioId, EstadoReserva estado);
    List<ReservaDTO> findByProductoAndEstado(Long productoId, EstadoReserva estado);

    // Verifica si el producto está disponible en un rango de fechas
    boolean verificarDisponibilidad(Long productoId, LocalDate fechaInicio, LocalDate fechaFin);
}

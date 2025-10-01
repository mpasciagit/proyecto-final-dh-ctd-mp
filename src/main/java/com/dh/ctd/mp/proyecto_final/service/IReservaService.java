package com.dh.ctd.mp.proyecto_final.service;

import com.dh.ctd.mp.proyecto_final.dto.ReservaDTO;
import com.dh.ctd.mp.proyecto_final.entity.EstadoReserva;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface IReservaService {
    ReservaDTO save(ReservaDTO reservaDTO);

    Optional<ReservaDTO> findById(Long id);

    List<ReservaDTO> findAll();

    ReservaDTO update(ReservaDTO reservaDTO) throws Exception;

    void delete(Long id);

    // Extras específicos de Reserva
    List<ReservaDTO> findByUsuario(Long usuarioId);

    List<ReservaDTO> findByProducto(Long productoId);

    List<ReservaDTO> findByFechaInicioBetween(LocalDate desde, LocalDate hasta);

    List<ReservaDTO> findByEstado(EstadoReserva estado);

    List<ReservaDTO> findByUsuarioAndEstado(Long usuarioId, EstadoReserva estado);

    List<ReservaDTO> findByProductoAndEstado(Long productoId, EstadoReserva estado);
}
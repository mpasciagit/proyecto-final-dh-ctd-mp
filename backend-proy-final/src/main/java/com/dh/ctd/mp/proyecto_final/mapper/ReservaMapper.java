package com.dh.ctd.mp.proyecto_final.mapper;

import com.dh.ctd.mp.proyecto_final.dto.ReservaDTO;
import com.dh.ctd.mp.proyecto_final.entity.Reserva;
import com.dh.ctd.mp.proyecto_final.entity.EstadoReserva;

import java.time.format.DateTimeFormatter;

public class ReservaMapper {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public static ReservaDTO toDTO(Reserva reserva) {
        if (reserva == null) return null;
        return new ReservaDTO(
            reserva.getId(),
            reserva.getFechaInicio(),
            reserva.getFechaFin(),
            reserva.getEstado() != null ? reserva.getEstado().name() : null,
            reserva.getUsuario() != null ? reserva.getUsuario().getId() : null,
            reserva.getProducto() != null ? reserva.getProducto().getId() : null,
            reserva.getFechaCreacion() != null ? reserva.getFechaCreacion().format(DATE_FORMATTER) : null
        );
    }

    public static Reserva toEntity(ReservaDTO dto) {
        if (dto == null) return null;
        Reserva reserva = new Reserva();
        reserva.setId(dto.getId());
        reserva.setFechaInicio(dto.getFechaInicio());
        reserva.setFechaFin(dto.getFechaFin());
        reserva.setEstado(dto.getEstado() != null ? EstadoReserva.valueOf(dto.getEstado()) : null);
        if (dto.getFechaCreacion() != null) {
            reserva.setFechaCreacion(java.time.LocalDate.parse(dto.getFechaCreacion(), DATE_FORMATTER).atStartOfDay());
        }
        // usuario y producto deben setearse aparte si se requieren entidades completas
        return reserva;
    }
}
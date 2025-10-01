package com.dh.ctd.mp.proyecto_final.mapper;

import com.dh.ctd.mp.proyecto_final.dto.ReservaDTO;
import com.dh.ctd.mp.proyecto_final.entity.Reserva;
import com.dh.ctd.mp.proyecto_final.entity.EstadoReserva;

public class ReservaMapper {

    public static ReservaDTO toDTO(Reserva reserva) {
        if (reserva == null) return null;
        return new ReservaDTO(
            reserva.getId(),
            reserva.getFechaInicio(),
            reserva.getFechaFin(),
            reserva.getEstado() != null ? reserva.getEstado().name() : null,
            reserva.getUsuario() != null ? reserva.getUsuario().getId() : null,
            reserva.getProducto() != null ? reserva.getProducto().getId() : null
        );
    }

    public static Reserva toEntity(ReservaDTO dto) {
        if (dto == null) return null;
        Reserva reserva = new Reserva();
        reserva.setId(dto.getId());
        reserva.setFechaInicio(dto.getFechaInicio());
        reserva.setFechaFin(dto.getFechaFin());
        reserva.setEstado(dto.getEstado() != null ? EstadoReserva.valueOf(dto.getEstado()) : null);
        // usuario y producto deben setearse aparte si se requieren entidades completas
        return reserva;
    }
}
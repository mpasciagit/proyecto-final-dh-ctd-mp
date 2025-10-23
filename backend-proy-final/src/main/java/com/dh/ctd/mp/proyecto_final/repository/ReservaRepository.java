package com.dh.ctd.mp.proyecto_final.repository;

import com.dh.ctd.mp.proyecto_final.entity.Reserva;
import com.dh.ctd.mp.proyecto_final.entity.EstadoReserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    // Todas las reservas de un usuario
    List<Reserva> findByUsuarioId(Long usuarioId);

    // Todas las reservas de un producto
    List<Reserva> findByProductoId(Long productoId);

    // Reservas en un rango de fechas
    List<Reserva> findByFechaInicioBetween(LocalDate desde, LocalDate hasta);

    // Todas las reservas con un estado específico
    List<Reserva> findByEstado(EstadoReserva estado);

    // Reservas de un usuario con un estado dado
    List<Reserva> findByUsuarioIdAndEstado(Long usuarioId, EstadoReserva estado);

    // Reservas de un producto con un estado dado
    List<Reserva> findByProductoIdAndEstado(Long productoId, EstadoReserva estado);

    // 🔹 Verificación de regla de negocio: producto reservado en un rango de fechas
    boolean existsByProductoIdAndFechaInicioLessThanEqualAndFechaFinGreaterThanEqual(
            Long productoId, LocalDate fechaFin, LocalDate fechaInicio);

    // 🔹 Nuevo método: verifica si el usuario tuvo una reserva FINALIZADA de un producto
    boolean existsByUsuarioIdAndProductoIdAndEstado(Long usuarioId, Long productoId, EstadoReserva estado);
}
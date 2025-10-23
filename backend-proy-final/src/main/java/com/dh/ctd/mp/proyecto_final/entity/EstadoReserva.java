package com.dh.ctd.mp.proyecto_final.entity;

public enum EstadoReserva {
    PENDIENTE,      // Reserva creada, esperando confirmación
    CONFIRMADA,     // Reserva aprobada, esperando inicio
    RECHAZADA,      // Reserva denegada
    NO_PRESENTADO,  // Usuario no se presentó para recoger el vehículo
    EN_CURSO,       // Vehículo entregado, reserva activa
    EN_INSPECCION,   // Vehículo devuelto, en proceso de inspección técnica
    FINALIZADA,     // Vehículo devuelto correctamente
    CANCELADA       // Reserva cancelada
}


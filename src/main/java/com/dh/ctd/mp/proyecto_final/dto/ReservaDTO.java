package com.dh.ctd.mp.proyecto_final.dto;

import java.time.LocalDate;

public class ReservaDTO {
    private Long id;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private String estado;
    private Long usuarioId;
    private Long productoId;

    public ReservaDTO() {}

    public ReservaDTO(Long id, LocalDate fechaInicio, LocalDate fechaFin, String estado, Long usuarioId, Long productoId) {
        this.id = id;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.estado = estado;
        this.usuarioId = usuarioId;
        this.productoId = productoId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDate getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(LocalDate fechaInicio) { this.fechaInicio = fechaInicio; }

    public LocalDate getFechaFin() { return fechaFin; }
    public void setFechaFin(LocalDate fechaFin) { this.fechaFin = fechaFin; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }

    public Long getProductoId() { return productoId; }
    public void setProductoId(Long productoId) { this.productoId = productoId; }
}

package com.dh.ctd.mp.proyecto_final.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewDTO {
    private Long id;
    private Integer puntuacion;
    private String comentario;
    private LocalDateTime fechaCreacion;
    private Long usuarioId;
    private Long productoId;
}

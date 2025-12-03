package com.dh.ctd.mp.proyecto_final.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
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
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Long usuarioId;
    private String usuarioNombre;
    private Long productoId;
    private Long reservaId;
}

package com.dh.ctd.mp.proyecto_final.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FavoritoDTO {
    private Long id;
    private LocalDateTime fechaCreacion;
    private Long usuarioId;
    private Long productoId;
}
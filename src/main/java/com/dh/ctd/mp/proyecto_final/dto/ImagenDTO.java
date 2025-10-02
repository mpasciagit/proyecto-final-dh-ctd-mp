package com.dh.ctd.mp.proyecto_final.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImagenDTO {
    private Long id;
    private String url;
    private String textoAlternativo;
    private Integer orden;
    private Long productoId;
}

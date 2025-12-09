package com.dh.ctd.mp.proyecto_final.authentication;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ForgotPasswordRequest {

    private String email;

    // Etiqueta opcional, el backend mapeará a la baseUrl correspondiente
    private OriginType origin;
}
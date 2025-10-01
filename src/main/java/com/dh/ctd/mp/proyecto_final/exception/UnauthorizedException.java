package com.dh.ctd.mp.proyecto_final.exception;

public class UnauthorizedException extends RuntimeException {

    public UnauthorizedException() {
        super("Acceso no autorizado");
    }

    public UnauthorizedException(String message) {
        super(message);
    }
}

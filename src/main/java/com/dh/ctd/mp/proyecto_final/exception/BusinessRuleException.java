package com.dh.ctd.mp.proyecto_final.exception;

/**
 * Excepción para errores de reglas de negocio.
 * Ejemplo: producto ya reservado en ciertas fechas, stock insuficiente, etc.
 */
public class BusinessRuleException extends RuntimeException {

    public BusinessRuleException() {
        super();
    }

    public BusinessRuleException(String message) {
        super(message);
    }

    public BusinessRuleException(String message, Throwable cause) {
        super(message, cause);
    }

    public BusinessRuleException(Throwable cause) {
        super(cause);
    }

    protected BusinessRuleException(String message, Throwable cause,
                                    boolean enableSuppression,
                                    boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}

package com.dh.ctd.mp.proyecto_final.service;

public interface EmailService {
    void sendResetPasswordEmail(String to, String token);
}

package com.dh.ctd.mp.proyecto_final.service;

import com.dh.ctd.mp.proyecto_final.dto.UsuarioDTO;

import java.util.List;

public interface IUsuarioService {

    // ----------------- CRUD genérico -----------------
    UsuarioDTO save(UsuarioDTO usuarioDTO);
    UsuarioDTO findById(Long id);                     // lanza ResourceNotFoundException si no existe
    List<UsuarioDTO> findAll();
    UsuarioDTO update(UsuarioDTO usuarioDTO);         // actualiza datos básicos
    void delete(Long id);                             // lanza ResourceNotFoundException si no existe

    // ----------------- Búsquedas específicas -----------------
    UsuarioDTO findByEmail(String email);             // lanza ResourceNotFoundException si no existe
    List<UsuarioDTO> findByRol(String nombreRol);
    List<UsuarioDTO> findByNombre(String nombre);

    // ----------------- Gestión de contraseñas -----------------

    /**
     * Resetea la contraseña de un usuario con una nueva provista (caso normal).
     * Usado cuando el propio usuario o un admin especifica la nueva contraseña.
     */
    void resetPassword(Long userId, String newPassword);

    /**
     * Genera una contraseña temporal aleatoria y la asigna al usuario.
     * Usado por administradores para recuperación o desbloqueo de cuentas.
     */
    void resetPasswordByAdmin(Long userId);
}

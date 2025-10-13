package com.dh.ctd.mp.proyecto_final.service;

import com.dh.ctd.mp.proyecto_final.dto.UsuarioDTO;

import java.util.List;

public interface IUsuarioService {

    // CRUD genérico
    UsuarioDTO save(UsuarioDTO usuarioDTO);
    UsuarioDTO findById(Long id);   // lanza ResourceNotFoundException si no existe
    List<UsuarioDTO> findAll();
    UsuarioDTO update(UsuarioDTO usuarioDTO);  // ya no declara 'throws Exception'
    void delete(Long id);            // lanza ResourceNotFoundException si no existe

    // Búsquedas específicas
    UsuarioDTO findByEmail(String email);        // lanza ResourceNotFoundException si no existe
    List<UsuarioDTO> findByRol(String nombreRol);
    List<UsuarioDTO> findByNombre(String nombre);

    // Resetear password de un usuario (solo ADMIN/SUPER_ADMIN)
    void resetPassword(Long userId, String newPassword);
}

package com.dh.ctd.mp.proyecto_final.service;

import com.dh.ctd.mp.proyecto_final.dto.UsuarioDTO;

import java.util.List;
import java.util.Optional;

public interface IUsuarioService {

    // CRUD genérico
    UsuarioDTO save(UsuarioDTO usuarioDTO);
    Optional<UsuarioDTO> findById(Long id);
    List<UsuarioDTO> findAll();
    UsuarioDTO update(UsuarioDTO usuarioDTO) throws Exception;
    void delete(Long id);

    // Búsquedas específicas
    Optional<UsuarioDTO> findByEmail(String email);
    List<UsuarioDTO> findByRol(String nombreRol);
    List<UsuarioDTO> findByNombre(String nombre);
}

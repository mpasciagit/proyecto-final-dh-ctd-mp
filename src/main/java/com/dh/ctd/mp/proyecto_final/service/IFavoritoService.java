package com.dh.ctd.mp.proyecto_final.service;

import com.dh.ctd.mp.proyecto_final.dto.FavoritoDTO;

import java.util.List;
import java.util.Optional;

public interface IFavoritoService {
    FavoritoDTO save(FavoritoDTO favoritoDTO);
    Optional<FavoritoDTO> findById(Long id);
    List<FavoritoDTO> findAll();
    void delete(Long id);
    List<FavoritoDTO> findByUsuarioId(Long usuarioId);
}
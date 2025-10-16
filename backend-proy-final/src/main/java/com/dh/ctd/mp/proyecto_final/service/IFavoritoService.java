package com.dh.ctd.mp.proyecto_final.service;

import com.dh.ctd.mp.proyecto_final.dto.FavoritoDTO;

import java.util.List;

public interface IFavoritoService {
    FavoritoDTO save(FavoritoDTO favoritoDTO);
    FavoritoDTO findById(Long id);
    List<FavoritoDTO> findAll();
    void delete(Long id);
    List<FavoritoDTO> findByUsuarioId(Long usuarioId);
    FavoritoDTO update(FavoritoDTO favoritoDTO);
}
